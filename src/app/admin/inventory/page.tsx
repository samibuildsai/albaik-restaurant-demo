"use client";

import { AlertTriangle, Package } from "lucide-react";
import { inventory } from "@/data/admin";

export default function AdminInventoryPage() {
  const low = inventory.filter((i) => i.stock < i.min);

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">Total Products</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{inventory.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-red-200 p-4">
          <p className="text-xs text-red-500 font-medium">Low Stock</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{low.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-emerald-200 p-4">
          <p className="text-xs text-emerald-600 font-medium">In Stock</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{inventory.length - low.length}</p>
        </div>
      </div>

      {low.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-800 text-sm">Restock needed</p>
            <p className="text-sm text-amber-700">
              {low.length} items are below minimum stock level: {low.map((i) => i.name).join(", ")}.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-left text-xs text-slate-500 bg-slate-50">
                <th className="px-5 py-3 font-medium">Product</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Stock</th>
                <th className="px-5 py-3 font-medium">Min Level</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((i) => {
                const isLow = i.stock < i.min;
                const pct = Math.min((i.stock / (i.min * 2)) * 100, 100);
                return (
                  <tr key={i.name} className="border-t border-slate-100 hover:bg-slate-50/60">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                          <Package className="h-4 w-4 text-slate-500" />
                        </span>
                        <span className="font-medium text-slate-800">{i.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">{i.category}</td>
                    <td className="px-5 py-3.5">
                      <div className="w-32">
                        <div className="flex justify-between text-xs mb-1">
                          <span className={isLow ? "text-red-600 font-semibold" : "text-slate-700 font-medium"}>
                            {i.stock} {i.unit}
                          </span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isLow ? "bg-red-500" : "bg-emerald-500"}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">
                      {i.min} {i.unit}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${
                          isLow ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {isLow ? "Reorder" : "Healthy"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
