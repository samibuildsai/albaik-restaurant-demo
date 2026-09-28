"use client";

import { useState } from "react";
import { TrendingUp, ShoppingCart, Wallet, PiggyBank } from "lucide-react";

const ranges = {
  Today: {
    revenue: 96800,
    orders: 42,
    expenses: 18500,
    sales: [
      { label: "12pm", value: 18400 },
      { label: "2pm", value: 22100 },
      { label: "4pm", value: 14800 },
      { label: "6pm", value: 20300 },
      { label: "8pm", value: 21200 },
    ],
  },
  Week: {
    revenue: 436400,
    orders: 197,
    expenses: 132000,
    sales: [
      { label: "Mon", value: 48200 },
      { label: "Tue", value: 52100 },
      { label: "Wed", value: 44800 },
      { label: "Thu", value: 61300 },
      { label: "Fri", value: 88400 },
      { label: "Sat", value: 104900 },
      { label: "Sun", value: 96700 },
    ],
  },
  Month: {
    revenue: 1498500,
    orders: 864,
    expenses: 742300,
    sales: [
      { label: "Week 1", value: 312000 },
      { label: "Week 2", value: 348000 },
      { label: "Week 3", value: 401000 },
      { label: "Week 4", value: 437500 },
    ],
  },
};

type RangeKey = keyof typeof ranges;

export default function ReportsPage() {
  const [range, setRange] = useState<RangeKey>("Today");
  const data = ranges[range];
  const profit = data.revenue - data.expenses;
  const max = Math.max(...data.sales.map((s) => s.value));
  const avgOrder = Math.round(data.revenue / data.orders);

  const cards = [
    { label: "Revenue", value: `₨${data.revenue.toLocaleString()}`, icon: TrendingUp, color: "from-emerald-500 to-teal-600", sub: `+${range === "Today" ? "12.4" : range === "Week" ? "14.8" : "18.2"}%` },
    { label: "Orders", value: data.orders.toString(), icon: ShoppingCart, color: "from-blue-500 to-indigo-600", sub: `Avg ₨${avgOrder.toLocaleString()}/order` },
    { label: "Expenses", value: `₨${data.expenses.toLocaleString()}`, icon: Wallet, color: "from-rose-500 to-pink-600", sub: `${Math.round((data.expenses / data.revenue) * 100)}% of revenue` },
    { label: "Profit", value: `₨${profit.toLocaleString()}`, icon: PiggyBank, color: "from-amber-500 to-orange-600", sub: `${Math.round((profit / data.revenue) * 100)}% margin` },
  ];

  return (
    <div className="space-y-5">
      {/* Range switcher */}
      <div className="flex items-center gap-2">
        {(["Today", "Week", "Month"] as RangeKey[]).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              range === r
                ? "bg-slate-900 text-white shadow-lg"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {r}
          </button>
        ))}
        <span className="ml-auto text-xs text-slate-500 hidden sm:block">
          Demo data · {range} view
        </span>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-lg transition-shadow">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center mb-3`}>
              <c.icon className="h-5 w-5 text-white" />
            </div>
            <p className="text-xs text-slate-500">{c.label}</p>
            <p className="text-xl font-bold text-slate-900 mt-1">{c.value}</p>
            <p className="text-[11px] text-slate-500 mt-1">{c.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-900 mb-1">Revenue Trend</h2>
          <p className="text-xs text-slate-500 mb-5">PKR breakdown for the selected range</p>
          <div className="flex items-end gap-3 h-56">
            {data.sales.map((s) => (
              <div key={s.label} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[10px] font-medium text-slate-600 opacity-0 group-hover:opacity-100 transition">
                  {(s.value / 1000).toFixed(1)}k
                </span>
                <div
                  className="w-full rounded-t-xl bg-gradient-to-t from-amber-500 via-orange-500 to-orange-400 group-hover:from-amber-600 group-hover:to-orange-600 transition-all"
                  style={{ height: `${Math.max((s.value / max) * 100, 6)}%` }}
                />
                <span className="text-[11px] text-slate-500">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-900 mb-4">Profit & Loss</h2>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between pb-3 border-b border-slate-100">
              <span className="text-slate-500">Gross Revenue</span>
              <span className="font-semibold text-slate-900">₨{data.revenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pb-3 border-b border-slate-100">
              <span className="text-slate-500">Total Expenses</span>
              <span className="font-semibold text-rose-600">- ₨{data.expenses.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pb-3 border-b border-slate-100">
              <span className="text-slate-500">Avg Order Value</span>
              <span className="font-semibold text-slate-900">₨{avgOrder.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="font-bold text-slate-900">Net Profit</span>
              <span className="font-bold text-lg text-emerald-600">₨{profit.toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-5 p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
            <p className="text-xs font-semibold text-amber-700 mb-1">Insight</p>
            <p className="text-sm text-amber-800">
              {range === "Month"
                ? "Weekend sales drive 34% of monthly revenue. Consider extending weekend offers."
                : range === "Week"
                ? "Friday & Saturday are your strongest days — staff up for peak hours."
                : "Lunch rush is steady; the 8 PM slot is your top performer today."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
