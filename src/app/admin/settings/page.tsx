"use client";

import { useState } from "react";
import Link from "next/link";
import { restaurantInfo } from "@/data/restaurant";
import { useToast } from "@/context/ToastContext";

export default function AdminSettingsPage() {
  const { showToast } = useToast();
  const [form, setForm] = useState({
    name: restaurantInfo.name,
    phone: restaurantInfo.phone,
    whatsapp: restaurantInfo.whatsapp,
    email: restaurantInfo.email,
    address: restaurantInfo.address,
    mapsUrl: restaurantInfo.googleMapsUrl,
    open: restaurantInfo.hours.open,
    close: restaurantInfo.hours.close,
    deliveryTime: restaurantInfo.deliveryTime,
    currency: restaurantInfo.currency,
    freeDeliveryThreshold: 2000,
    deliveryFee: 150,
  });

  const set = (k: string, v: string | number) => setForm({ ...form, [k]: v });

  return (
    <div className="grid lg:grid-cols-3 gap-5">
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-900 mb-1">Restaurant Profile</h2>
        <p className="text-xs text-slate-500 mb-5">
          These values power the phone, WhatsApp and directions buttons across the website.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Restaurant name" value={form.name} onChange={(v) => set("name", v)} />
          <Field label="Phone" value={form.phone} onChange={(v) => set("phone", v)} />
          <Field label="WhatsApp number (with country code)" value={form.whatsapp} onChange={(v) => set("whatsapp", v)} />
          <Field label="Email" value={form.email} onChange={(v) => set("email", v)} />
          <div className="sm:col-span-2">
            <Field label="Address" value={form.address} onChange={(v) => set("address", v)} />
          </div>
          <div className="sm:col-span-2">
            <Field label="Google Maps URL" value={form.mapsUrl} onChange={(v) => set("mapsUrl", v)} />
          </div>
          <Field label="Opening time" value={form.open} onChange={(v) => set("open", v)} />
          <Field label="Closing time" value={form.close} onChange={(v) => set("close", v)} />
          <Field label="Delivery time" value={form.deliveryTime} onChange={(v) => set("deliveryTime", v)} />
          <Field label="Currency" value={form.currency} onChange={(v) => set("currency", v)} />
          <Field
            label="Free delivery threshold (PKR)"
            value={form.freeDeliveryThreshold}
            onChange={(v) => set("freeDeliveryThreshold", Number(v))}
            type="number"
          />
          <Field
            label="Standard delivery fee (PKR)"
            value={form.deliveryFee}
            onChange={(v) => set("deliveryFee", Number(v))}
            type="number"
          />
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => showToast("Settings saved (demo — config file is the source of truth).", "success")}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold hover:from-amber-600 hover:to-orange-700 transition-all"
          >
            Save Settings
          </button>
          <button
            onClick={() =>
              setForm({
                name: restaurantInfo.name,
                phone: restaurantInfo.phone,
                whatsapp: restaurantInfo.whatsapp,
                email: restaurantInfo.email,
                address: restaurantInfo.address,
                mapsUrl: restaurantInfo.googleMapsUrl,
                open: restaurantInfo.hours.open,
                close: restaurantInfo.hours.close,
                deliveryTime: restaurantInfo.deliveryTime,
                currency: restaurantInfo.currency,
                freeDeliveryThreshold: 2000,
                deliveryFee: 150,
              })
            }
            className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="space-y-5">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-900 mb-3">Live Preview</h3>
          <div className="space-y-2.5 text-sm">
            <PreviewRow label="Name" value={form.name} />
            <PreviewRow label="Phone" value={form.phone} />
            <PreviewRow label="WhatsApp" value={form.whatsapp} />
            <PreviewRow label="Hours" value={`${form.open} – ${form.close}`} />
            <PreviewRow label="Delivery" value={form.deliveryTime} />
            <PreviewRow label="Currency" value={form.currency} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-900 mb-3">Quick Links</h3>
          <div className="space-y-2 text-sm">
            <a href={form.mapsUrl} target="_blank" rel="noopener noreferrer" className="block text-amber-600 hover:text-amber-700">
              🧭 Google Maps listing →
            </a>
            <a href={`tel:${form.phone.replace(/\s/g, "")}`} className="block text-amber-600 hover:text-amber-700">
              📞 Test phone link →
            </a>
            <a
              href={`https://wa.me/${form.whatsapp.replace(/[^\d]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-amber-600 hover:text-amber-700"
            >
              💬 Test WhatsApp link →
            </a>
            <Link href="/" className="block text-amber-600 hover:text-amber-700">
              🌐 View customer site →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
      />
    </div>
  );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-800 text-right truncate">{value}</span>
    </div>
  );
}
