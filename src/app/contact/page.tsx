"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui";
import { Input, Textarea } from "@/components/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { useToast } from "@/context/ToastContext";
import { restaurantInfo } from "@/data/restaurant";
import { telLink, defaultWhatsAppLink } from "@/lib/whatsapp";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Loader2, Map } from "lucide-react";

export default function ContactPage() {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Enter a valid email";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);

    showToast("Message sent successfully! We'll get back to you soon.", "success");
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Get in Touch</h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Have a question, feedback, or want to book a table? We'd love to hear from you.
              Our team is here to help make your experience exceptional.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
            <Card variant="elevated" className="h-full">
              <CardContent className="p-6 space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
                <p className="text-gray-600">
                  We're here to help! Reach out to us through any of these channels.
                </p>

                <div className="space-y-6">
                  <ContactItem
                    icon={<MapPin className="h-5 w-5" />}
                    title="Visit Us"
                    details={[
                      restaurantInfo.address,
                      "Open Daily",
                      `${restaurantInfo.hours.open} – ${restaurantInfo.hours.close}`,
                    ]}
                  />
                  <ContactItem
                    icon={<Phone className="h-5 w-5" />}
                    title="Call Us"
                    details={[
                      restaurantInfo.phone,
                      "Available during business hours",
                    ]}
                    action={
                      <a href={`tel:${restaurantInfo.phone.replace(/\s/g, "")}`} className="text-amber-600 hover:underline text-sm font-medium">
                        Call Now
                      </a>
                    }
                  />
                  <ContactItem
                    icon={<Mail className="h-5 w-5" />}
                    title="Email Us"
                    details={[restaurantInfo.email, "We respond within 24 hours"]}
                    action={
                      <a href={`mailto:${restaurantInfo.email}`} className="text-amber-600 hover:underline text-sm font-medium">
                        Send Email
                      </a>
                    }
                  />
                  <ContactItem
                    icon={<Clock className="h-5 w-5" />}
                    title="Opening Hours"
                    details={[
                      `${restaurantInfo.hours.days}: ${restaurantInfo.hours.open} – ${restaurantInfo.hours.close}`,
                      "Kitchen closes 30 min before closing time",
                    ]}
                  />
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <a
                    href={`https://wa.me/${restaurantInfo.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
                  >
                    <div className="p-3 bg-green-100 rounded-xl">
                      <svg className="h-6 w-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.611-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.194 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378 9.86 9.86 0 01-.47-.372 10.48 10.48 0 01-1.472-3.443 10.42 10.42 0 012.867-5.46 10.56 10.56 0 016.234 1.698c1.267.778 2.356 1.82 2.939 2.921a10.57 10.57 0 011.699 6.305c0 .88-.087 1.738-.253 2.567-.173.88-.517 1.676-1.114 2.347-.596.67-1.358 1.128-2.3 1.128-.399 0-.798-.052-1.177-.172" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">WhatsApp Us</p>
                      <p className="text-sm text-gray-500">Quick response during business hours</p>
                    </div>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card variant="outlined" className="mt-6">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Follow Us</h3>
                <div className="flex gap-3">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
                    <svg className="h-6 w-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
                    <svg className="h-6 w-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
                    <svg className="h-6 w-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" /></svg>
                  </a>
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
                    <svg className="h-6 w-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Send Us a Message</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      label="Full Name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      error={errors.name}
                      required
                    />
                    <Input
                      label="Email Address"
                      placeholder="john@example.com"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      error={errors.email}
                      required
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      label="Phone Number"
                      placeholder="+92 320 3750081"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      error={errors.phone}
                      required
                    />
                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select a topic</option>
                        <option value="general">General Inquiry</option>
                        <option value="reservation">Table Reservation</option>
                        <option value="catering">Catering & Events</option>
                        <option value="feedback">Feedback & Complaints</option>
                        <option value="careers">Careers</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.subject && <p className="mt-1.5 text-sm text-red-600">{errors.subject}</p>}
                    </div>
                  </div>
                  <Textarea
                    label="Message"
                    placeholder="Tell us how we can help..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    error={errors.message}
                    rows={5}
                    required
                  />
                  <Button
                    variant="primary"
                    size="lg"
                    isLoading={isSubmitting}
                    className="w-full sm:w-auto"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card variant="outlined" className="mt-6">
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { q: "What are your delivery hours?", a: "We deliver from 12:00 PM to 11:30 PM daily. Last orders accepted at 11:00 PM." },
                  { q: "Do you offer catering for events?", a: "Yes! We cater events of all sizes. Contact us at catering@albaikfastfood.pk for custom menus and pricing." },
                  { q: "Are your ingredients halal?", a: "Absolutely. All our meat is 100% halal certified. We source from trusted halal suppliers." },
                  { q: "Can I customize my order?", a: "Yes, you can add special instructions during checkout. For allergies, please mention them clearly." },
                  { q: "What payment methods do you accept?", a: "We accept Cash on Delivery and Pay at Counter (for pickup orders)." },
                  { q: "How can I track my order?", a: "Use the Track Order page with your order number, or check your SMS/WhatsApp for live updates." },
                ].map((faq, index) => (
                  <details key={index} className="group">
                    <summary className="flex items-center justify-between cursor-pointer p-4 bg-gray-50 rounded-xl list-none">
                      <p className="font-medium text-gray-900 pr-8">{faq.q}</p>
                      <svg className="h-5 w-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <p className="mt-3 text-gray-600 leading-relaxed">{faq.a}</p>
                  </details>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Map Placeholder */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-12">
          <Card variant="elevated" className="overflow-hidden">
            <div className="aspect-video bg-gray-100 relative flex items-center justify-center">
              <div className="text-center p-8">
                <Map className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Our Location</h3>
                <p className="text-gray-500">{restaurantInfo.address}</p>
                <div className="mt-4 flex flex-wrap gap-3 justify-center">
                  <a href={restaurantInfo.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors font-medium">
                    🧭 Get Directions
                  </a>
                  <a href={telLink()} className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium">
                    📞 Call Now
                  </a>
                  <a href={defaultWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-[#25D366] text-white rounded-xl hover:bg-[#1eb955] transition-colors font-medium">
                    💬 WhatsApp Us
                  </a>
                </div>
                <iframe
                  title="Restaurant location map"
                  src="https://www.google.com/maps?q=32.0477566,72.931248&z=17&output=embed"
                  className="mt-6 w-full h-56 rounded-xl border-0"
                  loading="lazy"
                />
              </div>
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3">
                <p className="text-sm font-medium text-gray-900">Al Baik Fast Food Restaurant</p>
                <p className="text-sm text-gray-500">{restaurantInfo.address}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function ContactItem({ icon, title, details, action }: { icon: React.ReactNode; title: string; details: string[]; action?: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="p-3 bg-amber-50 rounded-xl text-amber-600 flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-900">{title}</p>
        <div className="space-y-1 mt-1">
          {details.map((detail, i) => (
            <p key={i} className="text-sm text-gray-600">{detail}</p>
          ))}
        </div>
        {action && <div className="mt-2">{action}</div>}
      </div>
    </div>
  );
}