"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ShoppingCart, ChevronDown, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";
import { QuantitySelector } from "@/components/ui";
import { useCart } from "@/context/CartContext";
import { navigationItems, restaurantInfo } from "@/data/restaurant";
import { defaultWhatsAppLink } from "@/lib/whatsapp";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { itemCount, openCart, isOpen: isCartOpen, closeCart } = useCart();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Announcement Bar + Navbar (fixed as one unit) */}
      <div className="fixed top-0 left-0 right-0 z-40">
      <div className="bg-amber-600 text-white text-center py-1.5 sm:py-2 text-xs sm:text-sm font-medium whitespace-nowrap overflow-hidden px-3">
        <span className="sm:hidden">
          Free delivery over ₨2,000 · Code <span className="font-semibold underline">FREESHIP</span>
        </span>
        <span className="hidden sm:inline">
          Free delivery on orders over ₨2,000! Use code <span className="font-semibold underline">FREESHIP</span> at checkout.
        </span>
      </div>

      {/* Main Navbar */}
      <header
        className={cn(
          "left-0 right-0 transition-all duration-300",
          isScrolled
            ? "bg-white/95 backdrop-blur-sm shadow-md"
            : "bg-white sm:bg-transparent"
        )}
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2" aria-label="Al Baik Fast Food Home">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">
                Al Baik Fast Food
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-sm font-medium text-gray-700 hover:text-amber-600 transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-0 after:bg-amber-500 hover:after:w-full transition-all duration-200"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href={`tel:${restaurantInfo.phone.replace(/[^\d]/g, "")}`}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-amber-600 transition-colors"
              >
                <Phone className="h-4 w-4 text-amber-600" />
                {restaurantInfo.phone}
              </a>
              <Link href="/menu">
                <Button variant="primary" size="md" leftIcon={<ShoppingCart className="h-4 w-4" />}>
                  Order Now
                </Button>
              </Link>
              <Link href="/cart">
                <Button
                  variant="ghost"
                  size="md"
                  className="relative"
                  leftIcon={<ShoppingCart className="h-5 w-5" />}
                >
                  Cart
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {itemCount > 99 ? "99+" : itemCount}
                    </span>
                  )}
                </Button>
              </Link>
            </div>

            {/* Mobile Actions: Cart + Menu */}
            <div className="flex items-center gap-1 md:hidden">
              <Link
                href="/cart"
                className="relative p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label={`View cart, ${itemCount} items`}
              >
                <ShoppingCart className="h-6 w-6" />
                {itemCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </Link>
              <button
                className="p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={isMobileMenuOpen}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </nav>
      </header>
      </div>

      {/* Mobile Menu Sheet */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={closeCart} />
    </>
  );
}

function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
          onClick={onClose}
        />
      )}
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? 0 : "100%" }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed top-0 right-0 bottom-0 w-full md:w-80 bg-white z-50 shadow-2xl md:hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile menu"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2" onClick={onClose}>
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">Al Baik Fast Food</span>
          </Link>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 py-6 px-4 overflow-y-auto" aria-label="Mobile navigation">
          <ul className="space-y-1">
            {navigationItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 hover:text-amber-600 font-medium transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8 pt-6 border-t border-gray-100 space-y-3">
            <Link href="/menu" onClick={onClose} className="block">
              <Button variant="primary" fullWidth leftIcon={<ShoppingCart className="h-4 w-4" />}>
                Order Now
              </Button>
            </Link>
            <Link href="/cart" onClick={onClose} className="block">
              <Button variant="outline" fullWidth leftIcon={<ShoppingCart className="h-5 w-5" />}>
                View Cart
              </Button>
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Contact</p>
              <div className="space-y-2.5 text-gray-600 text-sm">
                <a
                  href={`tel:${restaurantInfo.phone.replace(/[^\d]/g, "")}`}
                  className="flex items-center gap-2 font-medium text-gray-900"
                >
                  <span className="w-5 text-center">📞</span> {restaurantInfo.phone}
                </a>
                <p className="flex items-center gap-2"><span className="w-5 text-center">📍</span> {restaurantInfo.address}</p>
                <p className="flex items-center gap-2"><span className="w-5 text-center">🕐</span> {restaurantInfo.hours.open} – {restaurantInfo.hours.close}</p>
              </div>
            </div>

            {/* Mobile contact CTAs */}
            <div className="grid grid-cols-1 gap-2.5 pt-1">
              <a
                href={`tel:${restaurantInfo.phone.replace(/[^\d]/g, "")}`}
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gray-900 text-white font-semibold text-sm active:scale-[0.98] transition-transform"
              >
                📞 Call Now
              </a>
              <a
                href={defaultWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#25D366] text-white font-semibold text-sm active:scale-[0.98] transition-transform"
              >
                💬 WhatsApp
              </a>
              <a
                href={restaurantInfo.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm active:scale-[0.98] transition-transform"
              >
                🧭 Get Directions
              </a>
            </div>
          </div>
        </nav>
      </motion.aside>
    </>
  );
}

function CartSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { items, subtotal, itemCount, removeItem, updateQuantity, clearCart } = useCart();
  const deliveryFee = subtotal >= 2000 ? 0 : subtotal >= 1000 ? 100 : 150;
  const total = subtotal + deliveryFee;

  if (!isOpen) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
        aria-hidden="true"
      />
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed top-0 right-0 bottom-0 w-full md:w-96 bg-white z-50 shadow-2xl flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Your Cart ({itemCount})</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Close cart"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
              <svg className="h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Your cart is empty</h3>
              <p className="text-gray-500 mb-6">Add some delicious items to get started!</p>
              <Link href="/menu" onClick={onClose}>
                <Button variant="primary" leftIcon={<ShoppingCart className="h-4 w-4" />}>
                  Browse Menu
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem key={item.id} item={item} onRemove={removeItem} onUpdateQuantity={updateQuantity} />
              ))}
            </div>
          )}

          {items.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-100 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">₨{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-medium text-gray-900">
                  {deliveryFee === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    `₨${deliveryFee.toLocaleString()}`
                  )}
                </span>
              </div>
              {deliveryFee > 0 && (
                <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-xl">
                  Add ₨{2000 - subtotal} more for free delivery!
                </p>
              )}
              <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t border-gray-100">
                <span>Total</span>
                <span>₨{total.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t border-gray-100 space-y-3">
            <Link href="/checkout" onClick={onClose}>
              <Button variant="primary" fullWidth size="lg">
                Proceed to Checkout
              </Button>
            </Link>
            <button
              onClick={clearCart}
              className="w-full text-sm text-gray-500 hover:text-gray-700 font-medium"
            >
              Clear Cart
            </button>
          </div>
        )}
      </motion.aside>
    </>
  );
}

function CartItem({
  item,
  onRemove,
  onUpdateQuantity,
}: {
  item: any;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}) {
  return (
    <div className="flex gap-3 p-3 bg-gray-50 rounded-xl">
      <img
        src={item.image}
        alt={item.name}
        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
        loading="lazy"
      />
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
        <p className="text-sm text-gray-500 mt-0.5">₨{item.price.toLocaleString()} each</p>
        <div className="flex items-center gap-2 mt-2">
          <QuantitySelector
            value={item.quantity}
            onChange={(qty) => onUpdateQuantity(item.id, qty)}
            min={1}
            max={99}
            size="sm"
          />
          <button
            onClick={() => onRemove(item.id)}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
            aria-label={`Remove ${item.name} from cart`}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}