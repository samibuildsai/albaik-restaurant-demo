"use client";

import { deals } from "@/data/menu";
import { Badge } from "@/components/ui";
import { formatPrice } from "@/lib/utils";
import { Tag } from "lucide-react";

export default function AdminDealsPage() {
  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-semibold text-slate-900">Active Meal Deals</h2>
          <p className="text-xs text-slate-500">{deals.length} deals published on your website</p>
        </div>
        <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl">
          <Tag className="h-4 w-4" /> Total discount value: ₨
          {deals.reduce((s, d) => s + (d.originalPrice - d.discountedPrice), 0).toLocaleString()}
        </span>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {deals.map((d) => (
          <div key={d.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-[16/9] relative">
              <img src={d.image} alt={d.name} className="w-full h-full object-cover" loading="lazy" />
              <span className="absolute top-3 left-3 text-[10px] font-bold bg-white/95 text-slate-800 px-2.5 py-1 rounded-full">
                {d.badge}
              </span>
              <span className="absolute top-3 right-3 text-[10px] font-bold bg-emerald-500 text-white px-2.5 py-1 rounded-full">
                {d.discountPercent}% OFF
              </span>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-slate-900">{d.name}</h3>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${d.popular ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"}`}>
                  {d.popular ? "Popular" : "Active"}
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-3">{d.description}</p>
              <ul className="space-y-1 mb-3">
                {d.items.slice(0, 3).map((it, i) => (
                  <li key={i} className="text-xs text-slate-600 flex gap-2">
                    <span className="text-amber-500">✓</span>
                    {it}
                  </li>
                ))}
                {d.items.length > 3 && (
                  <li className="text-xs text-amber-600 font-medium">+{d.items.length - 3} more</li>
                )}
              </ul>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div>
                  <span className="font-bold text-slate-900">{formatPrice(d.discountedPrice)}</span>
                  <span className="text-xs text-slate-400 line-through ml-1.5">{formatPrice(d.originalPrice)}</span>
                </div>
                <button className="text-xs font-medium text-amber-600 hover:text-amber-700">Edit →</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
