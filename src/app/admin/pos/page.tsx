"use client";

import { useMemo, useState } from "react";
import { Search, Plus, Minus, Trash2, X, Receipt, Percent } from "lucide-react";
import { menuItems, menuCategories } from "@/data/menu";

type CartLine = { id: string; name: string; price: number; qty: number };

export default function POSPage() {
  const [category, setCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [lines, setLines] = useState<CartLine[]>([]);
  const [orderType, setOrderType] = useState<"Dine In" | "Takeaway" | "Delivery">("Dine In");
  const [payment, setPayment] = useState<"Cash" | "Card">("Cash");
  const [discount, setDiscount] = useState<number>(0);
  const [cashReceived, setCashReceived] = useState<number>(0);
  const [sale, setSale] = useState<{ invoice: string; total: number; lines: CartLine[]; payment: string; type: string; discount: number; cash: number } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const products = useMemo(() => {
    return menuItems.filter(
      (m) =>
        (category === "all" || m.category === category) &&
        (m.name.toLowerCase().includes(search.toLowerCase()) ||
          m.description.toLowerCase().includes(search.toLowerCase()))
    );
  }, [category, search]);

  const add = (id: string) => {
    const item = menuItems.find((m) => m.id === id);
    if (!item) return;
    setLines((prev) => {
      const found = prev.find((l) => l.id === id);
      if (found) return prev.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l));
      return [...prev, { id, name: item.name, price: item.price, qty: 1 }];
    });
  };

  const changeQty = (id: string, delta: number) => {
    setLines((prev) =>
      prev
        .map((l) => (l.id === id ? { ...l, qty: l.qty + delta } : l))
        .filter((l) => l.qty > 0)
    );
  };

  const remove = (id: string) => setLines((prev) => prev.filter((l) => l.id !== id));

  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const discountAmount = Math.round((subtotal * discount) / 100);
  const deliveryFee = orderType === "Delivery" && subtotal > 0 ? 150 : 0;
  const total = subtotal - discountAmount + deliveryFee;
  const change = cashReceived - total;

  const completeSale = () => {
    if (lines.length === 0) return;
    const invoice = `INV-${Date.now().toString(36).toUpperCase().slice(-6)}`;
    setSale({ invoice, total, lines, payment, type: orderType, discount: discountAmount, cash: cashReceived });
    setShowSuccess(true);
    setLines([]);
    setDiscount(0);
    setCashReceived(0);
  };

  const startNew = () => {
    setSale(null);
    setShowSuccess(false);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-5 h-[calc(100vh-140px)]">
      {/* Left: products */}
      <div className="lg:col-span-2 flex flex-col min-h-0">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {[{ id: "all", name: "All", icon: "🍽️" }, ...menuCategories].map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                  category === c.id
                    ? "bg-amber-500 text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <span className="mr-1">{c.icon}</span>
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto mt-4 pr-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
            {products.map((p) => (
              <button
                key={p.id}
                onClick={() => add(p.id)}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden text-left hover:border-amber-400 hover:shadow-lg transition-all group"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                </div>
                <div className="p-3">
                  <p className="text-xs font-medium text-slate-800 line-clamp-2 leading-snug min-h-[32px]">{p.name}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-bold text-amber-600">₨{p.price.toLocaleString()}</span>
                    <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
                      <Plus className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </button>
            ))}
            {products.length === 0 && (
              <p className="col-span-full text-center text-slate-500 py-10 text-sm">No products found.</p>
            )}
          </div>
        </div>
      </div>

      {/* Right: bill */}
      <div className="bg-white rounded-2xl border border-slate-200 flex flex-col min-h-0">
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-slate-900">Current Bill</h2>
            {lines.length > 0 && (
              <button
                onClick={() => setLines([])}
                className="text-xs text-red-500 hover:text-red-600 font-medium"
              >
                Clear
              </button>
            )}
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {(["Dine In", "Takeaway", "Delivery"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setOrderType(t)}
                className={`py-2 rounded-xl text-xs font-medium transition-all ${
                  orderType === t
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 min-h-[140px]">
          {lines.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
              <Receipt className="h-10 w-10 mb-2" />
              <p className="text-sm font-medium">Bill is empty</p>
              <p className="text-xs">Tap products to add them</p>
            </div>
          )}
          {lines.map((l) => (
            <div key={l.id} className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{l.name}</p>
                <p className="text-[11px] text-slate-500">₨{l.price.toLocaleString()} each</p>
              </div>
              <div className="flex items-center gap-1 bg-white rounded-lg border border-slate-200">
                <button onClick={() => changeQty(l.id, -1)} className="p-1.5 text-slate-500 hover:text-slate-800" aria-label="decrease">
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-5 text-center text-sm font-semibold">{l.qty}</span>
                <button onClick={() => changeQty(l.id, 1)} className="p-1.5 text-slate-500 hover:text-slate-800" aria-label="increase">
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <span className="text-xs font-semibold text-slate-800 w-16 text-right">
                ₨{(l.price * l.qty).toLocaleString()}
              </span>
              <button onClick={() => remove(l.id)} className="text-slate-400 hover:text-red-500" aria-label="remove">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-100 space-y-3">
          {/* Discount */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="number"
                min={0}
                max={50}
                value={discount}
                onChange={(e) => setDiscount(Math.min(50, Math.max(0, Number(e.target.value))))}
                className="w-full pl-8 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Discount %"
              />
            </div>
            <div className="grid grid-cols-2 gap-1.5 flex-1">
              {(["Cash", "Card"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPayment(p)}
                  className={`py-2 rounded-xl text-xs font-medium transition-all ${
                    payment === p ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5 text-sm">
            <Row label="Subtotal" value={`₨${subtotal.toLocaleString()}`} />
            {discount > 0 && <Row label={`Discount (${discount}%)`} value={`- ₨${discountAmount.toLocaleString()}`} accent />}
            {deliveryFee > 0 && <Row label="Delivery fee" value={`₨${deliveryFee.toLocaleString()}`} />}
            <div className="flex justify-between pt-2 border-t border-dashed border-slate-200">
              <span className="font-bold text-slate-900">Total</span>
              <span className="font-bold text-lg text-amber-600">₨{total.toLocaleString()}</span>
            </div>
          </div>

          {payment === "Cash" && total > 0 && (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={cashReceived || ""}
                onChange={(e) => setCashReceived(Number(e.target.value))}
                placeholder="Cash received"
                className="flex-1 px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <span className={`text-xs font-semibold ${change >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                {cashReceived > 0 ? `Change: ₨${Math.max(change, 0).toLocaleString()}` : ""}
              </span>
            </div>
          )}

          <button
            onClick={completeSale}
            disabled={lines.length === 0}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold hover:from-amber-600 hover:to-orange-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-orange-500/20"
          >
            Complete Sale
          </button>
        </div>
      </div>

      {/* Success / receipt modal */}
      {showSuccess && sale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowSuccess(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="bg-emerald-500 text-white text-center py-6">
              <div className="w-14 h-14 rounded-full bg-white/20 mx-auto flex items-center justify-center mb-2">
                <Receipt className="h-7 w-7" />
              </div>
              <p className="font-bold text-lg">Sale Completed</p>
              <p className="text-sm text-emerald-100">Invoice {sale.invoice}</p>
            </div>

            <div className="p-5 text-sm">
              <div className="text-center mb-4 pb-3 border-b border-dashed border-slate-200">
                <p className="font-bold text-slate-900">Al Baik Fast Food</p>
                <p className="text-[11px] text-slate-500">Main Boulevard, Pakistan</p>
                <p className="text-[11px] text-slate-500">{new Date().toLocaleString()}</p>
              </div>

              <div className="space-y-1.5 max-h-40 overflow-y-auto mb-3">
                {sale.lines.map((l) => (
                  <div key={l.id} className="flex justify-between text-slate-700">
                    <span>
                      {l.name} × {l.qty}
                    </span>
                    <span>₨{(l.price * l.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-slate-200 pt-3 space-y-1.5">
                <Row label="Subtotal" value={`₨${sale.lines.reduce((s, l) => s + l.price * l.qty, 0).toLocaleString()}`} />
                {sale.discount > 0 && <Row label="Discount" value={`- ₨${sale.discount.toLocaleString()}`} accent />}
                <div className="flex justify-between font-bold text-slate-900 pt-1">
                  <span>Total</span>
                  <span>₨{sale.total.toLocaleString()}</span>
                </div>
                <Row label="Payment" value={sale.payment} />
                <Row label="Order type" value={sale.type} />
                {sale.payment === "Cash" && sale.cash > 0 && (
                  <Row label="Change" value={`₨${Math.max(sale.cash - sale.total, 0).toLocaleString()}`} />
                )}
              </div>

              <p className="text-center text-[11px] text-slate-400 mt-4">Thank you for dining with us! 🍽️</p>
            </div>

            <div className="p-4 pt-0 flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50"
              >
                Print Receipt
              </button>
              <button
                onClick={startNew}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800"
              >
                New Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-slate-500">{label}</span>
      <span className={`font-medium ${accent ? "text-emerald-600" : "text-slate-800"}`}>{value}</span>
    </div>
  );
}
