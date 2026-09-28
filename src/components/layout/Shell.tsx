"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { FloatingWhatsApp } from "./FloatingWhatsApp";

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  // Pages with a sticky mobile action bar: lift the floating WhatsApp button above it
  const hasStickyBar = pathname === "/cart";

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <Navbar />
      {/* Announcement bar (28px mobile / 36px desktop) + header (56px / 64px) */}
      <main className="flex-1 pt-[84px] sm:pt-[100px]">{children}</main>
      <Footer />
      <FloatingWhatsApp raised={hasStickyBar} />
    </>
  );
}
