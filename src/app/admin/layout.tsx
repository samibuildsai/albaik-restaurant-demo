"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  Calculator,
  UtensilsCrossed,
  Tag,
  Package,
  Receipt,
  BarChart3,
  Settings,
  Menu as MenuIcon,
  X,
  Flame,
} from "lucide-react";

const items = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/pos", label: "POS", icon: Calculator },
  { href: "/admin/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/admin/deals", label: "Deals", icon: Tag },
  { href: "/admin/inventory", label: "Inventory", icon: Package },
  { href: "/admin/expenses", label: "Expenses", icon: Receipt },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col transform transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-slate-800">
          <Link href="/admin" className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Flame className="h-5 w-5 text-white" />
            </span>
            <div className="leading-tight">
              <p className="font-bold text-white">Al Baik Fast Food</p>
              <p className="text-[11px] text-slate-400">Admin Panel</p>
            </div>
          </Link>
          <button className="lg:hidden p-1 text-slate-400" onClick={() => setOpen(false)} aria-label="Close sidebar">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {items.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-900/30"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Link
            href="/"
            className="block text-center text-sm text-slate-300 hover:text-white bg-slate-800 rounded-xl py-2.5 transition-colors"
          >
            ← View Customer Site
          </Link>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-lg bg-slate-100"
              onClick={() => setOpen(true)}
              aria-label="Open sidebar"
            >
              <MenuIcon className="h-5 w-5 text-slate-700" />
            </button>
            <div>
              <h1 className="font-semibold text-slate-900">
                {items.find((i) =>
                  i.href === "/admin" ? pathname === "/admin" : pathname.startsWith(i.href)
                )?.label || "Admin"}
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full">
              ● Kitchen Open
            </span>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center text-sm font-bold">
                A
              </div>
              <div className="hidden sm:block leading-tight">
                <p className="text-sm font-medium text-slate-900">Admin</p>
                <p className="text-[11px] text-slate-500">Manager</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
