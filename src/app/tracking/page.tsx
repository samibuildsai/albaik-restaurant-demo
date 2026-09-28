"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Badge } from "@/components/ui";
import { useOrder } from "@/context/OrderContext";
import { useToast } from "@/context/ToastContext";
import { CheckCircle, Truck, Clock, MapPin, Phone, Mail, AlertCircle, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { restaurantInfo } from "@/data/restaurant";

const trackingSteps = [
  { id: "received", label: "Order Received", description: "Your order has been confirmed and sent to the kitchen", icon: CheckCircle },
  { id: "preparing", label: "Preparing", description: "Our chefs are cooking your meal with care", icon: Loader2 },
  { id: "ready", label: "Ready for Pickup/Delivery", description: "Your order is ready and waiting for the driver", icon: CheckCircle },
  { id: "out-for-delivery", label: "Out for Delivery", description: "Your driver is on the way to your location", icon: Truck },
  { id: "delivered", label: "Delivered", description: "Your order has been delivered. Enjoy!", icon: CheckCircle },
];

const statusOrder = ["received", "preparing", "ready", "out-for-delivery", "delivered"];

/** Shared order status (admin panel) -> tracking step id */
const STATUS_TO_STEP: Record<string, string> = {
  Pending: "received",
  Accepted: "preparing",
  Preparing: "preparing",
  Ready: "ready",
  "Out for Delivery": "out-for-delivery",
  Completed: "delivered",
  Cancelled: "received",
};

/** tracking step id -> shared order status */
const STEP_TO_STATUS: Record<string, string> = {
  received: "Pending",
  preparing: "Preparing",
  ready: "Ready",
  "out-for-delivery": "Out for Delivery",
  delivered: "Completed",
};

function stepFromStatus(status: string) {
  return (
    STATUS_TO_STEP[status] ||
    (statusOrder.includes(status) ? status : "received")
  );
}

function TrackingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { getOrderByNumber, orders } = useOrder();
  const { showToast } = useToast();

  const [orderNumber, setOrderNumber] = useState(searchParams.get("order") || "");
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [simulateProgress, setSimulateProgress] = useState(false);

  useEffect(() => {
    if (searchParams.get("order")) {
      const foundOrder = getOrderByNumber(searchParams.get("order")!);
      if (foundOrder) {
        setOrder(foundOrder);
      }
    }
  }, [searchParams, getOrderByNumber]);

  const handleTrack = () => {
    if (!orderNumber.trim()) {
      showToast("Please enter an order number", "error");
      return;
    }

    setIsLoading(true);
    const foundOrder = getOrderByNumber(orderNumber.trim().toUpperCase());

    setTimeout(() => {
      setIsLoading(false);
      if (foundOrder) {
        setOrder(foundOrder);
        router.push(`/tracking?order=${orderNumber.trim().toUpperCase()}`);
      } else {
        showToast("Order not found. Please check your order number.", "error");
      }
    }, 1000);
  };

  const handleSimulateProgress = () => {
    if (!order) return;
    setSimulateProgress(true);
    let currentIndex = statusOrder.indexOf(stepFromStatus(order.status));

    const interval = setInterval(() => {
      if (currentIndex < statusOrder.length - 1) {
        currentIndex++;
        const newStatus = statusOrder[currentIndex];
        setOrder({ ...order, status: STEP_TO_STATUS[newStatus] || "Preparing" });
      } else {
        clearInterval(interval);
        setSimulateProgress(false);
      }
    }, 2000);
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="mx-auto max-w-md px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="mx-auto w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mb-6">
              <Truck className="h-10 w-10 text-amber-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
            <p className="text-gray-500 mb-8">
              Enter your order number to see real-time delivery updates.
            </p>

            <Card variant="elevated">
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Order Number</label>
                  <div className="flex gap-3">
                    <Input
                      placeholder="FF-XXXXXX"
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                      className="flex-1 font-mono text-lg"
                    />
                    <Button variant="primary" size="lg" onClick={handleTrack} isLoading={isLoading}>
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        "Track"
                      )}
                    </Button>
                  </div>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  Demo order numbers: FF-1A2B3C, FF-4D5E6F, FF-7G8H9I
                </p>

                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600 mb-3">Or try a demo order:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {orders.slice(0, 3).map((o) => (
                      <button
                        key={o.orderNumber}
                        onClick={() => {
                          setOrderNumber(o.orderNumber);
                          handleTrack();
                        }}
                        className="px-3 py-2 text-sm font-mono bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        {o.orderNumber}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  const currentStepIndex = statusOrder.indexOf(stepFromStatus(order.status));
  const progress = ((currentStepIndex + 1) / statusOrder.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Button variant="ghost" onClick={() => router.push("/")} className="mb-2">
                ← Back to Home
              </Button>
              <h1 className="text-3xl font-bold text-gray-900">Order Tracking</h1>
              <p className="text-gray-600 mt-1">Order #{order.orderNumber}</p>
            </div>
            <Badge variant="success" size="lg" className="capitalize">
              {order.status.replace("-", " ")}
            </Badge>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Tracking Timeline */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
            <Card variant="elevated">
              <CardContent className="p-6">
                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="relative">
                    <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-gray-200" />
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 h-1 bg-amber-600 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                    {trackingSteps.map((step, index) => (
                      <div key={step.id} className="absolute top-1/2 -translate-y-1/2 transform" style={{ left: `${(index / (trackingSteps.length - 1)) * 100}%` }}>
                        <div
                          className={`w-4 h-4 rounded-full border-4 transform -translate-x-1/2 transition-all duration-500 ${
                            index <= currentStepIndex
                              ? "bg-amber-600 border-amber-600"
                              : "bg-white border-gray-300"
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Steps */}
                <div className="space-y-6">
                  {trackingSteps.map((step, index) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center relative z-10 ${
                            index < currentStepIndex
                              ? "bg-green-100 text-green-600"
                              : index === currentStepIndex
                              ? "bg-amber-100 text-amber-600 animate-pulse"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {index < currentStepIndex ? (
                            <CheckCircle className="h-6 w-6" />
                          ) : (
                            <step.icon className={index === currentStepIndex && step.icon === Loader2 ? "h-6 w-6 animate-spin" : "h-6 w-6"} />
                          )}
                        </div>
                        <div className="flex-1 pt-1">
                          <div className="flex items-center gap-3">
                            <h3 className={`font-semibold ${index <= currentStepIndex ? "text-gray-900" : "text-gray-400"}`}>
                              {step.label}
                            </h3>
                            {index === currentStepIndex && (
                              <Badge variant="info" size="sm">Current</Badge>
                            )}
                          </div>
                          <p className={`text-sm mt-1 ${index <= currentStepIndex ? "text-gray-600" : "text-gray-400"}`}>
                            {step.description}
                          </p>
                        </div>
                        <div className="text-right">
                          {stepFromStatus(order.status) === step.id && (
                            <p className="text-sm text-amber-600 font-medium">Now</p>
                          )}
                        </div>
                      </div>
                      {index < trackingSteps.length - 1 && (
                        <div className="ml-6 border-l border-gray-200" />
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Simulate Progress Button */}
                {currentStepIndex < trackingSteps.length - 1 && !simulateProgress && (
                  <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <Button variant="outline" onClick={handleSimulateProgress} leftIcon={<Loader2 className="h-4 w-4" />}>
                      Simulate Progress (Demo)
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">Click to see the order progress through all stages</p>
                  </div>
                )}

                {simulateProgress && (
                  <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <Loader2 className="mx-auto h-8 w-8 text-amber-600 animate-spin mb-2" />
                    <p className="text-gray-600">Simulating order progress...</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card variant="elevated" className="mt-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                      <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span>{order.deliveryFee === 0 ? "Free" : formatPrice(order.deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Card variant="elevated" className="lg:sticky lg:top-[100px]">
              <CardHeader>
                <CardTitle>Delivery Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">Estimated Delivery</p>
                  <p className="text-xl font-bold text-amber-600">{order.estimatedTime}</p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-gray-500">Type</p>
                      <p className="font-medium capitalize">{order.deliveryType}</p>
                    </div>
                  </div>

                  {order.deliveryType === "delivery" && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-gray-500">Address</p>
                        <p className="font-medium truncate">{order.customer.address}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-gray-500">Contact</p>
                      <p className="font-medium">{order.customer.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                    <div>
                      <p className="text-gray-500">Payment</p>
                      <p className="font-medium">{order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod === "counter" ? "Pay at Counter" : order.paymentMethod}</p>
                    </div>
                  </div>
                </div>

                {order.notes && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                    <p className="text-sm font-medium text-amber-800">Special Instructions</p>
                    <p className="text-sm text-amber-700 mt-1">{order.notes}</p>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-100 space-y-2 text-center">
                  <p className="text-sm text-gray-500">Questions about your order?</p>
                  <div className="flex gap-2">
                    <a href={`tel:${restaurantInfo.phone.replace(/\s/g, "")}`} className="flex-1 text-sm text-amber-600 hover:underline">
                      Call Restaurant
                    </a>
                    <a href={`https://wa.me/${restaurantInfo.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex-1 text-sm text-green-600 hover:underline">
                      WhatsApp
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Driver Info (when out for delivery) */}
            {(stepFromStatus(order.status) === "out-for-delivery" || stepFromStatus(order.status) === "delivered") && (
              <Card variant="elevated" className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-amber-600" />
                    Your Driver
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center">
                      <Truck className="h-7 w-7 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Ahmed Khan</p>
                      <p className="text-sm text-gray-500">Driver • 4.9★</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="primary" fullWidth size="sm" leftIcon={<Phone className="h-4 w-4" />}>
                      Call Driver
                    </Button>
                    <Button variant="outline" fullWidth size="sm" leftIcon={<Mail className="h-4 w-4" />}>
                      Message
                    </Button>
                  </div>
                  <div className="p-3 bg-green-50 rounded-xl text-center">
                    <p className="text-sm text-green-700">Your driver is 5 minutes away</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
export default function TrackingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>}>
      <TrackingContent />
    </Suspense>
  );
}
