"use client";

import { expenses } from "@/data/admin";
import { Receipt } from "lucide-react";

const categoryColors: Record<string, string> = {
  Ingredients: "bg-blue-100 text-blue-700",
  "Staff Payroll": "bg-violet-100 text-violet-700",
  Utilities: "bg-amber-100 text-amber-700",
  Marketing: "bg-pink-100 text-pink-700",
  Packaging: "bg-cyan-100 text-cyan-700",
  Rent: "bg-slate-100 text-slate-700",
};

export default function AdminExpensesPage() {
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const byCategory = expenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});
  const maxCat = Math.max(...Object.values(byCategory));

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">Total Expenses (Sep)</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">₨{total.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">Largest Category</p>
          <p className="text-lg font-bold text-slate-900 mt-1">
            {Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0]?.[0]}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">Entries</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{expenses.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">Avg per Entry</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">₨{Math.round(total / expenses.length).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Recent Expenses</h2>
            <button className="text-sm font-medium text-amber-600 hover:text-amber-700">+ Add expense</button>
          </div>
          <div className="divide-y divide-slate-100">
            {expenses.map((e) => (
              <div key={e.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-slate-50/60">
                <span className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                  <Receipt className="h-4 w-4 text-slate-500" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{e.note}</p>
                  <p className="text-[11px] text-slate-500">
                    {e.id} · {e.date}
                  </p>
                </div>
                <span className={`hidden sm:inline text-[11px] font-medium px-2 py-1 rounded-full ${categoryColors[e.category] || "bg-slate-100 text-slate-600"}`}>
                  {e.category}
                </span>
                <span className="font-semibold text-slate-900 w-24 text-right">₨{e.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-900 mb-4">By Category</h2>
          <div className="space-y-4">
            {Object.entries(byCategory)
              .sort((a, b) => b[1] - a[1])
              .map(([cat, amount]) => (
                <div key={cat}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-slate-600">{cat}</span>
                    <span className="font-medium text-slate-800">₨{amount.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                      style={{ width: `${(amount / maxCat) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
