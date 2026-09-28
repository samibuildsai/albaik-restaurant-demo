"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui";
import { Home, RotateCcw, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <div className="mb-8">
          <motion.div
            animate={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="inline-flex"
          >
            <svg className="w-32 h-32 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </motion.div>
        </div>

        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Oops! Looks like you've wandered off the menu. The page you're looking for
          doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="primary" size="lg" leftIcon={<Home className="h-5 w-5" />}>
              Back to Home
            </Button>
          </Link>
          <Link href="/menu">
            <Button variant="secondary" size="lg" leftIcon={<Search className="h-5 w-5" />}>
              Browse Menu
            </Button>
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100">
          <p className="text-sm text-gray-500 mb-4">Or try these popular pages:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { href: "/menu", label: "Menu" },
              { href: "/deals", label: "Deals" },
              { href: "/about", label: "About Us" },
              { href: "/contact", label: "Contact" },
              { href: "/gallery", label: "Gallery" },
            ].map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 hover:text-amber-600 transition-colors"
              >
                {page.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Fun animation */}
        <div className="mt-12">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="inline-flex items-center gap-2 text-gray-400"
          >
            <RotateCcw className="h-5 w-5 animate-spin text-amber-500" />
            <span className="text-sm">Fresh content cooking...</span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}