import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";
import { Shell } from "@/components/layout/Shell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Al Baik Fast Food | Flame-Grilled Burgers, Pizza, BBQ & More",
    template: "%s | Al Baik Fast Food",
  },
  description: "Experience flame-grilled perfection at Al Baik Fast Food. Burgers, pizza, BBQ, pasta, and more. Fast delivery, fresh ingredients, unforgettable flavor. Order now!",
  keywords: ["restaurant", "food delivery", "burgers", "pizza", "BBQ", "pasta", "flame grilled", "Pakistan"],
  authors: [{ name: "Al Baik Fast Food" }],
  creator: "Al Baik Fast Food",
  publisher: "Al Baik Fast Food",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://albaikfastfood.pk",
    siteName: "Al Baik Fast Food",
    title: "Al Baik Fast Food | Flame-Grilled Perfection",
    description: "Experience flame-grilled perfection. Burgers, pizza, BBQ, pasta & more. Order online for fast delivery!",
    images: [
      {
        url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=630&fit=crop",
        width: 1200,
        height: 630,
        alt: "Al Baik Fast Food - Flame-grilled burger",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Al Baik Fast Food | Flame-Grilled Perfection",
    description: "Experience flame-grilled perfection. Burgers, pizza, BBQ, pasta & more.",
    images: ["https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=630&fit=crop"],
  },
};

export const viewport: Viewport = {
  themeColor: "#f59e0b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
        <Providers>
          <Shell>{children}</Shell>
        </Providers>
      </body>
    </html>
  );
}