"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui";
import { Card, CardContent } from "@/components/ui";
import { Badge } from "@/components/ui";
import { useOrder } from "@/context/OrderContext";
import { CheckCircle, Truck, Clock, MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import { restaurantInfo } from "@/data/restaurant";
import { formatPrice } from "@/lib/utils";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { getOrderByNumber, clearCurrentOrder } = useOrder();

  const orderNumber = searchParams.get("order");
  const order = orderNumber ? getOrderByNumber(orderNumber) : null;

  useEffect(() => {
    if (!orderNumber || !order) {
      router.push("/menu");
    }
  }, [orderNumber, order, router]);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <svg className="mx-auto h-16 w-16 text-amber-500 mb-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-600">Loading order details...</p>
        </motion.div>
      </div>
    );
  }

  const statusSteps = [
    { id: "received", label: "Order Received", icon: CheckCircle, time: order.createdAt },
    { id: "preparing", label: "Preparing", icon: Truck, time: null },
    { id: "ready", label: "Ready", icon: CheckCircle, time: null },
    { id: "out-for-delivery", label: "Out for Delivery", icon: Truck, time: null },
    { id: "delivered", label: "Delivered", icon: CheckCircle, time: null },
  ];

  const STATUS_TO_STEP: Record<string, string> = {
    Pending: "received",
    Accepted: "preparing",
    Preparing: "preparing",
    Ready: "ready",
    "Out for Delivery": "out-for-delivery",
    Completed: "delivered",
    Cancelled: "received",
  };

  const stepId =
    STATUS_TO_STEP[order.status] ||
    (statusSteps.some((s) => s.id === order.status) ? order.status : "received");

  const currentStatusIndex = statusSteps.findIndex((s) => s.id === stepId);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="mx-auto w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Thank you for your order. We've received it and our kitchen is already firing up the grill.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Card variant="elevated">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Order Number</p>
                    <p className="text-2xl font-bold text-gray-900 font-mono">{order.orderNumber}</p>
                  </div>
                  <Badge variant="success" size="lg">
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace("-", " ")}
                  </Badge>
                </div>

                <div className="border-t border-gray-100 pt-6 space-y-4">
                  <h3 className="font-semibold text-gray-900">Estimated Timeline</h3>
                  <div className="space-y-4">
                    {statusSteps.map((step, index) => (
                      <div key={step.id} className="flex items-start gap-4">
                        <div className="relative flex-shrink-0">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              index <= currentStatusIndex
                                ? "bg-green-100 text-green-600"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            {index < currentStatusIndex ? (
                              <CheckCircle className="h-5 w-5" />
                            ) : index === currentStatusIndex ? (
                              <step.icon className="h-5 w-5" />
                            ) : (
                              <step.icon className="h-5 w-5" />
                            )}
                          </div>
                          {index < statusSteps.length - 1 && (
                            <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-gray-100" />
                          )}
                        </div>
                        <div className="flex-1 pt-1">
                          <p className={`font-medium ${index <= currentStatusIndex ? "text-gray-900" : "text-gray-400"}`}>
                            {step.label}
                          </p>
                          {step.time && (
                            <p className="text-sm text-gray-500">
                              {new Date(step.time).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Delivery Info</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <span>Estimated: {order.estimatedTime}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <span>{order.deliveryType === "delivery" ? "Delivery" : "Pickup"}</span>
                    </div>
                    {order.deliveryType === "delivery" && (
                      <div className="flex items-center gap-3 text-gray-600">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <span>{order.customer.address}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-gray-600">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <span>{order.customer.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                      <span>Payment: {order.paymentMethod === "cod" ? "Cash on Delivery" : "Pay at Counter"}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card variant="elevated" className="mt-6">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
                      <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                      </div>
                      <span className="font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span>{order.deliveryFee === 0 ? "Free" : formatPrice(order.deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-100">
                    <span>Total Paid</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tracking & Actions */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <Card variant="elevated" className="lg:sticky lg:top-[100px]">
              <CardContent className="p-6 space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Your Order</h3>
                  <p className="text-gray-500 text-sm">Real-time updates on your delivery</p>
                </div>

                <Button
                  variant="primary"
                  fullWidth
                  size="lg"
                  leftIcon={<Truck className="h-5 w-5" />}
                  onClick={() => router.push(`/tracking?order=${order.orderNumber}`)}
                >
                  Track Order Live
                </Button>

                <div className="border-t border-gray-100 pt-6 space-y-4">
                  <h3 className="font-semibold text-gray-900">Need Help?</h3>
                  <div className="space-y-3">
                    <a href={`tel:${restaurantInfo.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="p-2 bg-amber-100 rounded-lg">
                        <Phone className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Call Us</p>
                        <p className="text-sm text-gray-500">{restaurantInfo.phone}</p>
                      </div>
                    </a>
                    <a href={`https://wa.me/${restaurantInfo.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.611-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.194 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378 9.86 9.86 0 01-.47-.372 10.48 10.48 0 01-1.472-3.443 10.42 10.42 0 012.867-5.46 10.56 10.56 0 016.234 1.698c1.267.778 2.356 1.82 2.939 2.921a10.57 10.57 0 011.699 6.305c0 .88-.087 1.738-.253 2.567-.173.88-.517 1.676-1.114 2.347-.596.67-1.358 1.128-2.3 1.128-.399 0-.798-.052-1.177-.172" /></svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">WhatsApp</p>
                        <p className="text-sm text-gray-500">Chat with support</p>
                      </div>
                    </a>
                    <a href={`mailto:${restaurantInfo.email}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Mail className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Email</p>
                        <p className="text-sm text-gray-500">{restaurantInfo.email}</p>
                      </div>
                    </a>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <Button variant="outline" fullWidth onClick={() => router.push("/menu")} leftIcon={<ArrowRight className="h-4 w-4" />}>
                    Continue Shopping
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Share Order */}
            <Card variant="outlined" className="mt-6">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Share Your Order</h3>
                <p className="text-gray-500 text-sm mb-4">Let your friends know what you're having!</p>
                <div className="flex gap-3">
                  <button className="flex-1 p-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-medium">
                    Share on WhatsApp
                  </button>
                  <button className="flex-1 p-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-sm font-medium">
                    Copy Link
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
