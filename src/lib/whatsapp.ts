import { restaurantInfo } from "@/data/restaurant";
import { CartItem } from "@/types";

export function waLink(message: string, phone: string = restaurantInfo.whatsapp) {
  return `https://wa.me/${phone.replace(/[^\d]/g, "")}?text=${encodeURIComponent(message)}`;
}

export function defaultWhatsAppLink() {
  return waLink(restaurantInfo.whatsappMessage);
}

export function telLink() {
  // "+92 320 3750081" -> tel:+923203750081
  return `tel:${restaurantInfo.phone.replace(/[^\d]/g, "")}`;
}

export function phoneDisplay() {
  return restaurantInfo.phone;
}

export function buildOrderWhatsAppMessage(params: {
  name: string;
  address?: string;
  items: CartItem[];
  total: number;
  deliveryType?: string;
  notes?: string;
}) {
  const lines: string[] = [];
  lines.push(`*New Order – ${restaurantInfo.name}*`);
  lines.push("");
  lines.push(`Name: ${params.name || "—"}`);
  if (params.deliveryType) lines.push(`Type: ${params.deliveryType}`);
  if (params.address) lines.push(`Address: ${params.address}`);
  lines.push("");
  lines.push("*Items:*");
  params.items.forEach((item) => {
    lines.push(`• ${item.name} × ${item.quantity} = ₨${(item.price * item.quantity).toLocaleString()}`);
  });
  lines.push("");
  lines.push(`*Total: ₨${params.total.toLocaleString()}*`);
  if (params.notes) lines.push(`Notes: ${params.notes}`);
  lines.push("");
  lines.push("Sent from your website (demo).");
  return lines.join("\n");
}
