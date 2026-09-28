"use client";

import { defaultWhatsAppLink } from "@/lib/whatsapp";

export function FloatingWhatsApp({ raised = false }: { raised?: boolean }) {
  return (
    <a
      href={defaultWhatsAppLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className={`fixed right-4 z-40 flex items-center justify-center sm:justify-start gap-2.5 bg-[#25D366] text-white rounded-full shadow-xl shadow-green-700/25 hover:scale-105 active:scale-95 transition-all duration-200 h-12 w-12 sm:w-auto sm:h-auto sm:py-3 sm:pl-3.5 sm:pr-4 ${
        raised ? "bottom-24 sm:bottom-6" : "bottom-4 sm:bottom-6"
      }`}
    >
      <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.611-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.194 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378 9.86 9.86 0 01-.47-.372 10.48 10.48 0 01-1.472-3.443 10.42 10.42 0 012.867-5.46 10.56 10.56 0 016.234 1.698c1.267.778 2.356 1.82 2.939 2.921a10.57 10.57 0 011.699 6.305c0 .88-.087 1.738-.253 2.567-.173.88-.517 1.676-1.114 2.347-.596.67-1.358 1.128-2.3 1.128-.399 0-.798-.052-1.177-.172" />
      </svg>
      <span className="hidden sm:block text-sm font-semibold">Order on WhatsApp</span>
    </a>
  );
}
