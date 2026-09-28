"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, RefreshCw, Package } from "lucide-react";
import { orderStatuses, statusStyles, AdminOrder, OrderStatus } from "@/data/admin";
import { getAdminOrders, saveOrderStatus } from "@/lib/adminOrders";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | OrderStatus>("All");
  const [selected, setSelected] = useState<AdminOrder | null>(null);

  // Always read from the shared localStorage key (restaurant_orders)
  const loadOrders = () => setOrders(getAdminOrders());

  useEffect(() => {
    loadOrders();
    const onStorage = () => loadOrders();
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onStorage);
    };
  }, []);

  const setStatus = (id: string, status: OrderStatus) => {
    saveOrderStatus(id, status); // persists to localStorage for real orders
    loadOrders();
    setSelected((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
  };

  const visible = useMemo(
    () =>
      orders.filter(
        (o) =>
          (filter === "All" || o.status === filter) &&
          (o.id.toLowerCase().includes(search.toLowerCase()) ||
            o.customer.toLowerCase().includes(search.toLowerCase()) ||
            o.phone.toLowerCase().includes(search.toLowerCase()))
      ),
    [orders, filter, search]
  );

  const statusCounts = orderStatuses.map((s) => ({
    status: s,
    count: orders.filter((o) => o.status === s).length,
  }));

  const realCount = orders.filter((o) => !o.isDemo).length;

  return (
    <div className="space-y-5">
      {/* Status chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <button
          onClick={() => setFilter("All")}
          className={`rounded-2xl border p-3.5 text-left transition-all ${
            filter === "All"
              ? "border-amber-500 bg-amber-50 shadow-md"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <p className="text-2xl font-bold text-slate-900">{orders.length}</p>
          <p className="text-[11px] font-medium text-slate-500 mt-0.5">All Orders</p>
        </button>
        {statusCounts.map((s) => (
          <button
            key={s.status}
            onClick={() => setFilter(filter === s.status ? "All" : s.status)}
            className={`rounded-2xl border p-3.5 text-left transition-all ${
              filter === s.status
                ? "border-amber-500 bg-amber-50 shadow-md"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <p className="text-2xl font-bold text-slate-900">{s.count}</p>
            <p className="text-[11px] font-medium text-slate-500 mt-0.5">{s.status}</p>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order ID, customer or phone..."
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
        >
          <option value="All">All statuses</option>
          {orderStatuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          onClick={loadOrders}
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors"
        >
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full font-medium">
          ● {realCount} customer order{realCount !== 1 ? "s" : ""} from the website
        </span>
        <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full font-medium">
          {orders.length - realCount} demo orders
        </span>
        <span>Storage key: <code className="bg-slate-100 px-1.5 py-0.5 rounded">restaurant_orders</code></span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[1000px]">
            <thead>
              <tr className="text-left text-xs text-slate-500 bg-slate-50">
                <th className="px-4 py-3 font-medium">Order ID</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Items</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Payment</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date / Time</th>
                <th className="px-4 py-3 font-medium">Update Status</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((o) => (
                <tr key={o.id} className="border-t border-slate-100 hover:bg-slate-50/60">
                  <td className="px-4 py-3.5">
                    <button
                      onClick={() => setSelected(o)}
                      className="font-mono font-medium text-slate-900 hover:text-amber-600"
                    >
                      {o.id}
                    </button>
                    {o.isDemo && (
                      <span className="block text-[10px] text-slate-400">demo</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="font-medium text-slate-800">{o.customer}</p>
                    <p className="text-[11px] text-slate-500">{o.phone}</p>
                  </td>
                  <td className="px-4 py-3.5 max-w-[220px]">
                    <p className="text-slate-700 truncate">
                      {o.items.map((i) => `${i.name} × ${i.qty}`).join(", ") || "—"}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {o.items.reduce((s, i) => s + i.qty, 0)} item(s)
                    </p>
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-slate-900 whitespace-nowrap">
                    ₨{o.total.toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">{o.type}</td>
                  <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                    {o.paymentMethod || "—"}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`text-[11px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${statusStyles[o.status]}`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">{o.time}</td>
                  <td className="px-4 py-3.5">
                    <select
                      value={o.status}
                      onChange={(e) => setStatus(o.id, e.target.value as OrderStatus)}
                      className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      {orderStatuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-5 py-14 text-center text-slate-500">
                    <Package className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                    No orders match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-md bg-white h-full overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs text-slate-500">Order details</p>
                <h3 className="font-mono font-bold text-lg text-slate-900">{selected.id}</h3>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
                aria-label="Close details"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <InfoRow label="Customer" value={selected.customer} />
              <InfoRow label="Phone" value={selected.phone} />
              <InfoRow label="Address" value={selected.address || "—"} />
              <InfoRow label="Type" value={selected.type} />
              <InfoRow label="Payment" value={selected.paymentMethod || "—"} />
              <InfoRow label="Date / Time" value={selected.time} />
              <InfoRow
                label="Status"
                value={
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${statusStyles[selected.status]}`}
                  >
                    {selected.status}
                  </span>
                }
              />
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100">
              <p className="text-xs font-medium text-slate-500 mb-3">ITEMS</p>
              <div className="space-y-2.5">
                {selected.items.map((it, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-slate-700">
                      {it.name} <span className="text-slate-400">× {it.qty}</span>
                    </span>
                    <span className="font-medium text-slate-900">
                      ₨{(it.price * it.qty).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between font-bold text-slate-900">
                <span>Total</span>
                <span>₨{selected.total.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-6">
              <label className="text-xs font-medium text-slate-500 block mb-2">UPDATE STATUS</label>
              <div className="grid grid-cols-2 gap-2">
                {orderStatuses.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(selected.id, s)}
                    className={`text-xs font-medium py-2.5 rounded-xl border transition-all ${
                      selected.status === s
                        ? "bg-amber-500 border-amber-500 text-white"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-800 text-right">{value}</span>
    </div>
  );
}
