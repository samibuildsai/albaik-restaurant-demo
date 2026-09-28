"use client";

import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { restaurantInfo, socialLinks, navigationItems } from "@/data/restaurant";

// Custom social media icons since lucide-react doesn't have them
const SocialIcons = {
  Facebook: () => (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  Instagram: () => (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  ),
  Twitter: () => (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
    </svg>
  ),
  YouTube: () => (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
};

function getSocialIcon(name: string) {
  switch (name) {
    case "Facebook":
      return <SocialIcons.Facebook />;
    case "Instagram":
      return <SocialIcons.Instagram />;
    case "Twitter":
      return <SocialIcons.Twitter />;
    case "YouTube":
      return <SocialIcons.YouTube />;
    default:
      return null;
  }
}

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4" aria-label="Al Baik Fast Food Home">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">Al Baik Fast Food</span>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Where flavor meets fire. Serving flame-grilled perfection since 2020.
              Fresh ingredients, bold flavors, unforgettable meals.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                  aria-label={social.name}
                >
                  {getSocialIcon(social.name)}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <nav aria-label="Footer navigation">
              <ul className="space-y-3">
                {navigationItems.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-gray-400 hover:text-amber-400 transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/tracking" className="text-gray-400 hover:text-amber-400 transition-colors">
                    Track Order
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <address className="not-italic space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-medium text-white">Visit Us</p>
                  <p className="text-gray-400">{restaurantInfo.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-medium text-white">Call Us</p>
                  <a href={`tel:${restaurantInfo.phone.replace(/\s/g, "")}`} className="text-gray-400 hover:text-amber-400 transition-colors">
                    {restaurantInfo.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-medium text-white">Email Us</p>
                  <a href={`mailto:${restaurantInfo.email}`} className="text-gray-400 hover:text-amber-400 transition-colors">
                    {restaurantInfo.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-medium text-white">Opening Hours</p>
                  <p className="text-gray-400">{restaurantInfo.hours.days}: {restaurantInfo.hours.open} – {restaurantInfo.hours.close}</p>
                </div>
              </div>
            </address>

            {/* Contact action buttons */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <a
                href={`tel:${restaurantInfo.phone.replace(/[^\d]/g, "")}`}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold transition-colors"
              >
                📞 Call Now
              </a>
              <a
                href={`https://wa.me/${restaurantInfo.whatsapp.replace(/[^\d]/g, "")}?text=${encodeURIComponent(restaurantInfo.whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25D366] hover:bg-[#1eb955] text-white text-sm font-semibold transition-colors"
              >
                💬 WhatsApp
              </a>
              <a
                href={restaurantInfo.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-sm font-semibold transition-colors"
              >
                🧭 Directions
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-4">
              Get the latest deals, new menu items, and exclusive offers delivered to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                aria-label="Email address"
                required
              />
              <button type="submit" className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-medium rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all">
                Subscribe
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-3">
              By subscribing, you agree to our Privacy Policy.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Al Baik Fast Food. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-6 gap-y-2 text-sm text-gray-500">
              <a href={`tel:${restaurantInfo.phone.replace(/[^\d]/g, "")}`} className="hover:text-amber-400 transition-colors">
                {restaurantInfo.phone}
              </a>
              <a href={`https://wa.me/${restaurantInfo.whatsapp.replace(/[^\d]/g, "")}?text=${encodeURIComponent(restaurantInfo.whatsappMessage)}`} target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">
                WhatsApp
              </a>
              <a href={restaurantInfo.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">
                Get Directions
              </a>
              <Link href="/tracking" className="hover:text-amber-400 transition-colors">
                Track Order
              </Link>
              <Link href="/admin" className="hover:text-amber-400 transition-colors">
                Admin Demo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}