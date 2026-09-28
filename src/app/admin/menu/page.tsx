"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Search } from "lucide-react";
import { menuItems as seed, menuCategories } from "@/data/menu";
import { MenuItem } from "@/types";

const STORAGE_KEY = "ff-admin-menu";

interface ManagedItem extends MenuItem {
  enabled?: boolean;
}

export default function AdminMenuPage() {
  const [items, setItems] = useState<ManagedItem[]>([]);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("all");
  const [editing, setEditing] = useState<ManagedItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
      else setItems(seed.map((s) => ({ ...s, enabled: true })));
    } catch {
      setItems(seed.map((s) => ({ ...s, enabled: true })));
    }
  }, []);

  const persist = (next: ManagedItem[]) => {
    setItems(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  };

  const visible = items.filter(
    (i) =>
      (cat === "all" || i.category === cat) &&
      i.name.toLowerCase().includes(search.toLowerCase())
  );

  const blank: ManagedItem = {
    id: "",
    name: "",
    description: "",
    price: 0,
    category: "burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=450&fit=crop",
    badges: [],
    spicyLevel: 0,
    prepTime: "15 min",
    enabled: true,
  };

  const openNew = () => {
    setEditing(blank);
    setIsNew(true);
    setShowForm(true);
  };

  const openEdit = (item: ManagedItem) => {
    setEditing(item);
    setIsNew(false);
    setShowForm(true);
  };

  const save = () => {
    if (!editing || !editing.name.trim()) return;
    if (isNew) {
      const withId = { ...editing, id: `custom-${Date.now().toString(36)}` };
      persist([...items, withId]);
    } else {
      persist(items.map((i) => (i.id === editing.id ? editing : i)));
    }
    setShowForm(false);
  };

  const remove = (id: string) => {
    persist(items.filter((i) => i.id !== id));
  };

  const toggle = (id: string) => {
    persist(items.map((i) => (i.id === id ? { ...i, enabled: !i.enabled } : i)));
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search menu items..."
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <select
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            className="px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">All categories</option>
            {menuCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={openNew}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-semibold hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/20"
        >
          <Plus className="h-4 w-4" /> Add Item
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {visible.map((item) => (
          <div
            key={item.id}
            className={`bg-white rounded-2xl border overflow-hidden ${item.enabled ? "border-slate-200" : "border-slate-200 opacity-60"}`}
          >
            <div className="aspect-[4/3] relative">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
              {!item.enabled && (
                <span className="absolute top-2 left-2 text-[10px] font-bold bg-slate-900 text-white px-2 py-1 rounded-full">
                  DISABLED
                </span>
              )}
            </div>
            <div className="p-3.5">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-slate-800 line-clamp-1">{item.name}</p>
                <span className="text-sm font-bold text-amber-600 whitespace-nowrap">₨{item.price.toLocaleString()}</span>
              </div>
              <p className="text-[11px] text-slate-500 capitalize mt-1">
                {menuCategories.find((c) => c.id === item.category)?.name || item.category}
              </p>
              <div className="flex gap-1.5 mt-3">
                <button
                  onClick={() => openEdit(item)}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
                <button
                  onClick={() => toggle(item.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-lg ${
                    item.enabled
                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {item.enabled ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  {item.enabled ? "On" : "Off"}
                </button>
                <button
                  onClick={() => remove(item.id)}
                  className="w-9 flex items-center justify-center text-xs font-medium py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                  aria-label="Delete item"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {visible.length === 0 && (
        <div className="text-center py-16 text-slate-500 bg-white rounded-2xl border border-slate-200">
          No items found.
        </div>
      )}

      {/* Modal */}
      {showForm && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-lg text-slate-900">
                {isNew ? "Add Menu Item" : "Edit Menu Item"}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <Field label="Name">
                <input
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </Field>
              <Field label="Description">
                <textarea
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  rows={3}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Price (PKR)">
                  <input
                    type="number"
                    value={editing.price}
                    onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </Field>
                <Field label="Prep time">
                  <input
                    value={editing.prepTime}
                    onChange={(e) => setEditing({ ...editing, prepTime: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </Field>
              </div>
              <Field label="Category">
                <select
                  value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {menuCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Image URL">
                <input
                  value={editing.image}
                  onChange={(e) => setEditing({ ...editing, image: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </Field>
              <Field label="Badges (comma separated)">
                <input
                  value={editing.badges.join(", ")}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      badges: e.target.value
                        .split(",")
                        .map((b) => b.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="Popular, Spicy"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </Field>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={save}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold hover:from-amber-600 hover:to-orange-700"
                >
                  {isNew ? "Add Item" : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

