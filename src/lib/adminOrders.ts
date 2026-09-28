import { getOrders, updateOrderStatus } from "@/lib/orders";
import { mockOrders } from "@/data/admin";
import type { AdminOrder, OrderStatus } from "@/data/admin";

function formatDateTime(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Real customer orders from localStorage (restaurant_orders) come FIRST,
 * followed by the static demo orders used for presentation.
 */
export function getAdminOrders(): AdminOrder[] {
  const realOrders: AdminOrder[] = getOrders().map((o) => ({
    id: o.id,
    customer: o.customerName || "Website Customer",
    phone: o.phone || "—",
    address: o.address,
    total: o.total,
    type:
      o.orderType === "Pickup"
        ? "Takeaway"
        : o.orderType === "Dine In"
        ? "Dine In"
        : o.orderType === "Takeaway"
        ? "Takeaway"
        : "Delivery",
    status: o.status,
    time: formatDateTime(o.createdAt),
    createdAt: o.createdAt,
    paymentMethod: o.paymentMethod || "Cash on Delivery",
    items: (o.items || []).map((item) => ({
      name: item.name,
      qty: item.quantity,
      price: item.price,
    })),
  }));

  const demoOrders: AdminOrder[] = mockOrders.map((o) => ({
    ...o,
    paymentMethod: o.paymentMethod || "Cash",
    isDemo: true,
  }));

  return [...realOrders, ...demoOrders];
}

/** Persist a status change for real orders (demo orders stay in memory). */
export function saveOrderStatus(id: string, status: OrderStatus): boolean {
  const exists = getOrders().some((order) => order.id === id);
  if (!exists) return false;
  updateOrderStatus(id, status);
  return true;
}

export { updateOrderStatus, getOrders };
