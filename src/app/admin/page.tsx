"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  DollarSign,
  ShoppingCart,
  Clock,
  TrendingUp,
  Wallet,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react";
import { bestSellers, salesWeekly, inventory, statusStyles, orderStatuses, AdminOrder } from "@/data/admin";
import { getAdminOrders } from "@/lib/adminOrders";

export default function AdminDashboard() {
  const [localOrders, setLocalOrders] = useState<AdminOrder[]>([]);

  useEffect(() => {
    const load = () => setLocalOrders(getAdminOrders());
    load();
    const onStorage = () => load();
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onStorage);
    };
  }, []);

  const orders = localOrders;
  const pending = orders.filter((o) => ["Pending", "Accepted", "Preparing"].includes(o.status)).length;
  const todaySales = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((s, o) => s + o.total, 0);
  const monthlyRevenue = 1498500;
  const monthlyExpenses = 742300;
  const profit = monthlyRevenue - monthlyExpenses;
  const lowStock = inventory.filter((i) => i.stock < i.min);

  const statusCounts = orderStatuses.map((s) => ({
    status: s,
    count: orders.filter((o) => o.status === s).length,
  }));

  const maxSales = Math.max(...salesWeekly.map((s) => s.value));

  const stats = [
    { label: "Today's Sales", value: `₨${todaySales.toLocaleString()}`, icon: DollarSign, trend: "+12.4%", color: "from-emerald-500 to-teal-600" },
    { label: "Today's Orders", value: orders.length.toString(), icon: ShoppingCart, trend: "+8.1%", color: "from-blue-500 to-indigo-600" },
    { label: "Pending Orders", value: pending.toString(), icon: Clock, trend: "Live", color: "from-amber-500 to-orange-600" },
    { label: "Monthly Revenue", value: `₨${monthlyRevenue.toLocaleString()}`, icon: TrendingUp, trend: "+18.2%", color: "from-violet-500 to-purple-600" },
    { label: "Expenses", value: `₨${monthlyExpenses.toLocaleString()}`, icon: Wallet, trend: "-3.5%", color: "from-rose-500 to-pink-600" },
    { label: "Profit", value: `₨${profit.toLocaleString()}`, icon: ArrowUpRight, trend: `+${Math.round((profit / monthlyRevenue) * 100)}%`, color: "from-cyan-500 to-sky-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border border-slate-200 hover:shadow-lg transition-shadow">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="h-5 w-5 text-white" />
            </div>
            <p className="text-xs text-slate-500 mb-1">{s.label}</p>
            <p className="text-lg font-bold text-slate-900">{s.value}</p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">{s.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sales chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold text-slate-900">Sales This Week</h2>
              <p className="text-xs text-slate-500">Revenue per day (PKR)</p>
            </div>
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full">
              +14.8% vs last week
            </span>
          </div>
          <div className="flex items-end gap-2 sm:gap-4 h-48">
            {salesWeekly.map((d) => (
              <div key={d.label} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[10px] font-medium text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  {(d.value / 1000).toFixed(0)}k
                </span>
                <div
                  className="w-full bg-gradient-to-t from-amber-500 to-orange-500 rounded-t-lg hover:from-amber-600 hover:to-orange-600 transition-all"
                  style={{ height: `${Math.max((d.value / maxSales) * 100, 8)}%` }}
                />
                <span className="text-[11px] text-slate-500">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Order status summary */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-900 mb-1">Order Status Summary</h2>
          <p className="text-xs text-slate-500 mb-4">Live counts across all channels</p>
          <div className="space-y-3">
            {statusCounts.map((s) => {
              const pct = orders.length ? (s.count / orders.length) * 100 : 0;
              return (
                <div key={s.status}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusStyles[s.status as keyof typeof statusStyles]}`}>
                      {s.status}
                    </span>
                    <span className="font-semibold text-slate-700">{s.count}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <Link
            href="/admin/orders"
            className="mt-5 block text-center text-sm font-medium text-amber-600 hover:text-amber-700"
          >
            View all orders →
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-amber-600 hover:text-amber-700 font-medium">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-500 bg-slate-50">
                  <th className="px-5 py-3 font-medium">Order</th>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium hidden sm:table-cell">Type</th>
                  <th className="px-5 py-3 font-medium">Total</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 6).map((o) => (
                  <tr key={o.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-5 py-3 font-mono font-medium text-slate-900">{o.id}</td>
                    <td className="px-5 py-3 text-slate-700">{o.customer}</td>
                    <td className="px-5 py-3 text-slate-500 hidden sm:table-cell">{o.type}</td>
                    <td className="px-5 py-3 font-medium text-slate-900">₨{o.total.toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <span className={`text-[11px] font-medium px-2 py-1 rounded-full ${statusStyles[o.status]}`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Best sellers + low stock */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-900 mb-4">Best Selling Products</h2>
            <div className="space-y-3.5">
              {bestSellers.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="w-5 text-xs font-bold text-slate-400">{i + 1}</span>
                  <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{p.name}</p>
                    <p className="text-[11px] text-slate-500">{p.sold} sold</p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600">₨{(p.revenue / 1000).toFixed(0)}k</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-red-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <h2 className="font-semibold text-slate-900">Low Stock Warning</h2>
            </div>
            <div className="space-y-2.5">
              {lowStock.map((i) => (
                <div key={i.name} className="flex items-center justify-between text-sm">
                  <span className="text-slate-700">{i.name}</span>
                  <span className="text-red-600 font-medium">
                    {i.stock} {i.unit}
                  </span>
                </div>
              ))}
            </div>
            <Link href="/admin/inventory" className="mt-4 block text-center text-sm font-medium text-red-600 hover:text-red-700">
              Manage inventory →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
