"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui";
import { Input, Textarea } from "@/components/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Badge } from "@/components/ui";
import { useCart } from "@/context/CartContext";
import { useOrder } from "@/context/OrderContext";
import { useToast } from "@/context/ToastContext";
import { formatPrice, calculateDeliveryFee, getEstimatedDeliveryTime } from "@/lib/utils";
import { generateOrderId, buildOrder, saveOrder } from "@/lib/orders";
import { restaurantInfo } from "@/data/restaurant";
import { Truck, CreditCard, MapPin, Clock, Shield, CheckCircle, User, Phone, Mail } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { addOrder, setCurrentOrder } = useOrder();
  const { showToast } = useToast();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    deliveryType: "delivery" as "delivery" | "pickup",
    paymentMethod: "cod" as "cod" | "counter",
    notes: "",
    promoCode: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const deliveryFee = formData.deliveryType === "delivery" ? calculateDeliveryFee(subtotal) : 0;
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <svg className="mx-auto h-24 w-24 text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Cart is Empty</h1>
            <p className="text-gray-500 mb-8">Add some items to your cart before checking out.</p>
            <Button variant="primary" size="lg" onClick={() => router.push("/menu")}>
              Browse Menu
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  const validateStep = (stepNum: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepNum === 1) {
      if (!formData.name.trim()) newErrors.name = "Name is required";
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
      else if (!/^[\d\s\-\+\(\)]{10,}$/.test(formData.phone)) newErrors.phone = "Enter a valid phone number";
      if (formData.deliveryType === "delivery" && !formData.address.trim()) {
        newErrors.address = "Delivery address is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(1)) return;

    setIsSubmitting(true);

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const orderNumber = generateOrderId();
    const estimatedTime = getEstimatedDeliveryTime();

    const order = buildOrder({
      id: orderNumber,
      items,
      subtotal,
      deliveryFee,
      total,
      customerName: formData.name,
      phone: formData.phone,
      address: formData.address,
      paymentMethod: formData.paymentMethod === "cod" ? "Cash on Delivery" : "Pay at Counter",
      orderType: formData.deliveryType === "delivery" ? "Delivery" : "Pickup",
      deliveryType: formData.deliveryType,
      notes: formData.notes,
      estimatedTime,
    });

    // Persist to the shared localStorage key (restaurant_orders) used by /admin/orders
    saveOrder(order);
    addOrder(order);
    setCurrentOrder(order);
    clearCart();
    setIsSubmitting(false);

    router.push(`/checkout/success?order=${orderNumber}`);
  };

  const deliveryTime = formData.deliveryType === "delivery" ? "30–45 minutes" : "15–20 minutes";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Steps */}
      <section className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: "Details", icon: User },
              { num: 2, label: "Delivery", icon: Truck },
              { num: 3, label: "Payment", icon: CreditCard },
              { num: 4, label: "Confirm", icon: CheckCircle },
            ].map((s, index) => (
              <div key={s.num} className="flex items-center">
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      step >= s.num
                        ? "bg-amber-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step > s.num ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <s.icon className="h-5 w-5" />
                    )}
                  </div>
                  {index < 3 && (
                    <div
                      className={`w-16 h-1 mx-2 hidden sm:block transition-all ${
                        step > s.num ? "bg-amber-600" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
                <span
                  className={`text-sm font-medium hidden sm:block ${
                    step >= s.num ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Step 1: Customer Details */}
              {step === 1 && (
                <div className="space-y-6">
                  <Card variant="elevated">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-amber-600" />
                        Customer Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Input
                        label="Full Name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        error={errors.name}
                        required
                      />
                      <Input
                        label="Phone Number"
                        placeholder="+92 320 3750081"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        error={errors.phone}
                        required
                      />
                    </CardContent>
                  </Card>

                  <Card variant="elevated">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-amber-600" />
                        Delivery Address
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer flex-1 p-4 rounded-xl border-2 transition-colors relative {formData.deliveryType === 'delivery' ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-gray-300'}">
                          <input
                            type="radio"
                            name="deliveryType"
                            value="delivery"
                            checked={formData.deliveryType === "delivery"}
                            onChange={(e) => setFormData({ ...formData, deliveryType: e.target.value as "delivery" })}
                            className="sr-only"
                          />
                          <Truck className="h-5 w-5 text-amber-600" />
                          <span className="font-medium">Delivery</span>
                          <span className="text-sm text-gray-500 ml-auto">{deliveryTime}</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer flex-1 p-4 rounded-xl border-2 transition-colors relative {formData.deliveryType === 'pickup' ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-gray-300'}">
                          <input
                            type="radio"
                            name="deliveryType"
                            value="pickup"
                            checked={formData.deliveryType === "pickup"}
                            onChange={(e) => setFormData({ ...formData, deliveryType: e.target.value as "pickup" })}
                            className="sr-only"
                          />
                          <svg className="h-5 w-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>
                          <span className="font-medium">Pickup</span>
                          <span className="text-sm text-gray-500 ml-auto">15-20 min</span>
                        </label>
                      </div>
                      <Textarea
                        label="Delivery Address"
                        placeholder="House #, Street, Area, City"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        error={errors.address}
                        rows={3}
                        disabled={formData.deliveryType === "pickup"}
                      />
                      {formData.deliveryType === "pickup" && (
                        <div className="p-3 bg-gray-50 rounded-xl text-sm text-gray-600">
                          <p className="font-medium">Pickup Location:</p>
                          <p>{restaurantInfo.address}</p>
                          <p>Open: {restaurantInfo.hours.open} – {restaurantInfo.hours.close}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card variant="elevated">
                    <CardHeader>
                      <CardTitle>Order Notes (Optional)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        placeholder="Any special instructions, allergies, or preferences..."
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows={3}
                      />
                    </CardContent>
                  </Card>

                  <div className="flex justify-end">
                    <Button variant="primary" size="lg" onClick={() => setStep(2)}>
                      Continue to Delivery
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Delivery Options */}
              {step === 2 && (
                <div className="space-y-6">
                  <Card variant="elevated">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Truck className="h-5 w-5 text-amber-600" />
                        Delivery Options
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border-2 border-gray-200 hover:border-amber-300 transition-colors">
                          <input
                            type="radio"
                            name="deliverySpeed"
                            value="standard"
                            checked={true}
                            className="sr-only"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">Standard Delivery</p>
                            <p className="text-sm text-gray-500">30–45 minutes • Free over ₨2,000</p>
                          </div>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border-2 border-gray-200 hover:border-amber-300 transition-colors">
                          <input
                            type="radio"
                            name="deliverySpeed"
                            value="express"
                            className="sr-only"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">Express Delivery</p>
                            <p className="text-sm text-gray-500">20–30 minutes • +₨100 fee</p>
                          </div>
                          <Badge variant="info" size="sm">New</Badge>
                        </label>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-between">
                    <Button variant="ghost" size="lg" onClick={() => setStep(1)}>
                      Back
                    </Button>
                    <Button variant="primary" size="lg" onClick={() => setStep(3)}>
                      Continue to Payment
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <div className="space-y-6">
                  <Card variant="elevated">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-amber-600" />
                        Payment Method
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border-2 border-gray-200 hover:border-amber-300 transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={formData.paymentMethod === "cod"}
                          onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as "cod" })}
                          className="sr-only"
                        />
                        <div className="p-3 bg-gray-50 rounded-xl">
                          <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Cash on Delivery</p>
                          <p className="text-sm text-gray-500">Pay when your order arrives</p>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border-2 border-gray-200 hover:border-amber-300 transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="counter"
                          checked={formData.paymentMethod === "counter"}
                          onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as "counter" })}
                          className="sr-only"
                        />
                        <div className="p-3 bg-gray-50 rounded-xl">
                          <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Pay at Counter</p>
                          <p className="text-sm text-gray-500">Pickup and pay at restaurant</p>
                        </div>
                      </label>
                    </CardContent>
                  </Card>

                  <Card variant="elevated">
                    <CardHeader>
                      <CardTitle>Promo Code (Optional)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-3">
                        <Input
                          placeholder="Enter promo code"
                          value={formData.promoCode}
                          onChange={(e) => setFormData({ ...formData, promoCode: e.target.value })}
                          className="flex-1"
                        />
                        <Button variant="outline" type="button">
                          Apply
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Try: FREESHIP, WELCOME10, SAVE200
                      </p>
                    </CardContent>
                  </Card>

                  <div className="flex justify-between">
                    <Button variant="ghost" size="lg" onClick={() => setStep(2)}>
                      Back
                    </Button>
                    <Button variant="primary" size="lg" onClick={() => setStep(4)}>
                      Review Order
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4: Confirm */}
              {step === 4 && (
                <div className="space-y-6">
                  <Card variant="elevated">
                    <CardHeader>
                      <CardTitle>Review Your Order</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        {items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                            <div className="flex items-center gap-3">
                              <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                              <div>
                                <p className="font-medium text-gray-900">{item.name}</p>
                                <p className="text-sm text-gray-500">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                              </div>
                            </div>
                            <span className="font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-4 border-t border-gray-100 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Subtotal</span>
                          <span>{formatPrice(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Delivery Fee</span>
                          <span>{deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-100">
                          <span>Total</span>
                          <span>{formatPrice(total)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card variant="elevated">
                    <CardHeader>
                      <CardTitle>Delivery Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <User className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Name</p>
                          <p className="font-medium">{formData.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <Phone className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium">{formData.phone}</p>
                        </div>
                      </div>
                      {formData.deliveryType === "delivery" && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                          <MapPin className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Address</p>
                            <p className="font-medium">{formData.address}</p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <Truck className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Type</p>
                          <p className="font-medium capitalize">{formData.deliveryType}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <CreditCard className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Payment</p>
                          <p className="font-medium capitalize">{formData.paymentMethod === "cod" ? "Cash on Delivery" : "Pay at Counter"}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-between">
                    <Button variant="ghost" size="lg" onClick={() => setStep(3)}>
                      Back
                    </Button>
                    <Button
                      variant="primary"
                      size="lg"
                      isLoading={isSubmitting}
                      onClick={handleSubmit}
                    >
                      Place Order
                    </Button>
                  </div>
                </div>
              )}
            </motion.form>
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <Card variant="elevated" className="lg:sticky lg:top-[100px]">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg" />
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">{item.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1">
                      <Truck className="h-3.5 w-3.5" />
                      Delivery
                    </span>
                    <span className="font-medium">{deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-500 text-center">
                  <p className="flex items-center justify-center gap-1">
                    <Shield className="h-3.5 w-3.5" />
                    Secure checkout
                  </p>
                  <p className="flex items-center justify-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    Ready in ~{deliveryTime}
                  </p>
                  <p className="flex items-center justify-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {formData.deliveryType === "delivery" ? "Delivery to your door" : "Pickup at restaurant"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}