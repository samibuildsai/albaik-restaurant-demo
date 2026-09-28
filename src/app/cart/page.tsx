"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus, ArrowLeft, Gift, Truck, Tag, Shield } from "lucide-react";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { QuantitySelector } from "@/components/ui";
import { Badge } from "@/components/ui";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { formatPrice, calculateDeliveryFee } from "@/lib/utils";
import { waLink, buildOrderWhatsAppMessage } from "@/lib/whatsapp";

export default function CartPage() {
  const { items, subtotal, itemCount, removeItem, updateQuantity, clearCart, promoCode, setPromoCode } = useCart();
  const { showToast } = useToast();
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [waName, setWaName] = useState("");
  const [waAddress, setWaAddress] = useState("");

  const deliveryFee = calculateDeliveryFee(subtotal);
  const discount = promoCode === "FREESHIP" ? deliveryFee : promoCode === "WELCOME10" ? Math.round(subtotal * 0.1) : promoCode === "SAVE200" && subtotal >= 1500 ? 200 : 0;
  const total = subtotal + deliveryFee - discount;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim()) {
      setAppliedPromo(promoCode);
      showToast(`Promo code "${promoCode}" applied!`, "success");
    }
  };

  const handleRemovePromo = () => {
    setPromoCode("");
    setAppliedPromo(null);
    showToast("Promo code removed", "info");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md"
          >
            <svg className="mx-auto h-24 w-24 text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Cart is Empty</h1>
            <p className="text-gray-500 mb-8">
              Looks like you haven't added any delicious items yet.
            </p>
            <Link href="/menu">
              <Button variant="primary" size="lg" leftIcon={<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>}>
                Browse Menu
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
              <p className="text-gray-600 mt-1">
                {itemCount} item{itemCount !== 1 ? "s" : ""} in your cart
              </p>
            </div>
            <Link href="/menu">
              <Button variant="ghost" leftIcon={<ArrowLeft className="h-4 w-4" />}>
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 pb-32 lg:pb-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card variant="elevated" className="overflow-hidden">
              <div className="divide-y divide-gray-100">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 sm:p-6"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl flex-shrink-0"
                      loading="lazy"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">{formatPrice(item.price)} each</p>
                          {item.dealItems && (
                            <Badge variant="info" size="sm" className="mt-2">
                              Deal: {item.dealItems.length} items included
                            </Badge>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-4 mt-4">
                        <QuantitySelector
                          value={item.quantity}
                          onChange={(qty) => updateQuantity(item.id, qty)}
                          min={1}
                          max={99}
                          size="md"
                        />
                        <span className="text-lg font-bold text-gray-900 ml-auto">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Promo Code */}
            <Card variant="outlined" className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-amber-600" />
                  Promo Code
                </CardTitle>
              </CardHeader>
              <CardContent>
                {appliedPromo ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Gift className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-800">{appliedPromo}</p>
                        <p className="text-sm text-green-600">
                          {discount > 0 ? `Discount: ${formatPrice(discount)}` : "Free delivery applied"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleRemovePromo}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-3">
                    <Input
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="primary" type="submit">
                      Apply
                    </Button>
                  </form>
                )}
                <p className="text-xs text-gray-500 mt-3">
                  Try: FREESHIP (free delivery), WELCOME10 (10% off), SAVE200 (₨200 off orders over ₨1500)
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card variant="elevated" className="lg:sticky lg:top-[100px]">
              <CardHeader className="pb-4">
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                    <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1">
                      <Truck className="h-4 w-4" />
                      Delivery Fee
                    </span>
                    <span className="font-medium text-gray-900">
                      {deliveryFee === 0 ? (
                        <span className="text-green-600 flex items-center gap-1">
                          <Shield className="h-3.5 w-3.5" /> Free
                        </span>
                      ) : (
                        formatPrice(deliveryFee)
                      )}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span className="flex items-center gap-1">
                        <Tag className="h-4 w-4" />
                        Discount ({appliedPromo || "Promo"})
                      </span>
                      <span className="font-medium">-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-100 pt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                {deliveryFee > 0 && (
                  <div className="p-3 bg-amber-50 rounded-xl text-sm text-amber-700">
                    <p className="font-medium flex items-center gap-1">
                      <Truck className="h-4 w-4" />
                      Add {formatPrice(2000 - subtotal)} more for free delivery!
                    </p>
                  </div>
                )}

                <Link href="/checkout" className="block">
                  <Button variant="primary" fullWidth size="lg" className="py-4">
                    Proceed to Checkout
                  </Button>
                </Link>

                <div className="space-y-2 pt-1">
                  <input
                    value={waName}
                    onChange={(e) => setWaName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    value={waAddress}
                    onChange={(e) => setWaAddress(e.target.value)}
                    placeholder="Delivery address"
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <a
                    href={waLink(
                      buildOrderWhatsAppMessage({
                        name: waName,
                        address: waAddress,
                        items,
                        total,
                        deliveryType: "Delivery",
                      })
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#25D366] text-white font-semibold hover:bg-[#1eb955] transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.611-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.194 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378 9.86 9.86 0 01-.47-.372 10.48 10.48 0 01-1.472-3.443 10.42 10.42 0 012.867-5.46 10.56 10.56 0 016.234 1.698c1.267.778 2.356 1.82 2.939 2.921a10.57 10.57 0 011.699 6.305c0 .88-.087 1.738-.253 2.567-.173.88-.517 1.676-1.114 2.347-.596.67-1.358 1.128-2.3 1.128-.399 0-.798-.052-1.177-.172" />
                    </svg>
                    Order on WhatsApp
                  </a>
                </div>

                <Button variant="outline" fullWidth onClick={clearCart} className="mt-2">
                  Clear Cart
                </Button>

                <div className="pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-500 text-center">
                  <p className="flex items-center justify-center gap-1">
                    <Shield className="h-3.5 w-3.5" />
                    Secure checkout
                  </p>
                  <p className="flex items-center justify-center gap-1">
                    <Gift className="h-3.5 w-3.5" />
                    No hidden fees
                  </p>
                  <p className="flex items-center justify-center gap-1">
                    <Truck className="h-3.5 w-3.5" />
                    {deliveryFee === 0 ? "Free delivery" : "30-45 min delivery"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Sticky mobile checkout bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-gray-200 shadow-[0_-6px_24px_rgba(0,0,0,0.10)] px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-gray-500 leading-none mb-1">
            Total · {itemCount} item{itemCount !== 1 ? "s" : ""}
          </p>
          <p className="text-lg font-bold text-gray-900 truncate">{formatPrice(total)}</p>
        </div>
        <Link href="/checkout" className="shrink-0">
          <Button variant="primary" size="lg" className="px-8">
            Checkout
          </Button>
        </Link>
      </div>
    </div>
  );
}