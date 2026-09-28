import type { CartItem, Order, OrderStatus } from "@/types";

/**
 * Single source of truth for customer orders.
 * Both the customer website and the admin panel MUST use this file.
 */
export const ORDERS_STORAGE_KEY = "restaurant_orders";
const LEGACY_ORDERS_STORAGE_KEY = "flame-fork-orders";
const SEQ_STORAGE_KEY = "restaurant_orders_seq";

export const ORDER_STATUSES: OrderStatus[] = [
  "Pending",
  "Accepted",
  "Preparing",
  "Ready",
  "Out for Delivery",
  "Completed",
  "Cancelled",
];

/** Old status values -> new shared status values */
const LEGACY_STATUS_MAP: Record<string, OrderStatus> = {
  received: "Pending",
  pending: "Pending",
  accepted: "Accepted",
  preparing: "Preparing",
  ready: "Ready",
  "out-for-delivery": "Out for Delivery",
  "out for delivery": "Out for Delivery",
  delivered: "Completed",
  completed: "Completed",
  cancelled: "Cancelled",
};

function parse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function hasWindow() {
  return typeof window !== "undefined";
}

/** Convert any legacy / partial order record into the shared structure. */
export function normalizeOrder(input: any): Order | null {
  if (!input || typeof input !== "object") return null;

  const customer = input.customer || {};
  const items: CartItem[] = Array.isArray(input.items) ? input.items : [];

  const customerName: string = input.customerName || customer.name || "Website Customer";
  const phone: string = input.phone || customer.phone || "";
  const address: string = input.address || customer.address || "";

  const legacyStatus = String(input.status || "Pending").toLowerCase();
  const status: OrderStatus =
    LEGACY_STATUS_MAP[legacyStatus] ||
    (ORDER_STATUSES.find((s) => s.toLowerCase() === legacyStatus) as OrderStatus) ||
    "Pending";

  const deliveryType = input.deliveryType === "pickup" ? "pickup" : "delivery";
  const orderType: Order["orderType"] =
    input.orderType || (deliveryType === "pickup" ? "Pickup" : "Delivery");

  const id: string = input.id || input.orderNumber || `AB-${Date.now().toString().slice(-6)}`;

  const quantity: number =
    typeof input.quantity === "number"
      ? input.quantity
      : items.reduce((sum, item) => sum + (item.quantity || 0), 0);

  return {
    id,
    orderNumber: input.orderNumber || id,
    customerName,
    phone,
    address,
    customer: { name: customerName, phone, address },
    items,
    quantity,
    subtotal: Number(input.subtotal) || 0,
    deliveryFee: Number(input.deliveryFee) || 0,
    discount: Number(input.discount) || 0,
    total: Number(input.total) || 0,
    paymentMethod:
      input.paymentMethod === "cod" || input.paymentMethod === "Cash on Delivery"
        ? "Cash on Delivery"
        : input.paymentMethod === "counter" || input.paymentMethod === "Pay at Counter"
        ? "Pay at Counter"
        : input.paymentMethod || "Cash on Delivery",
    orderType,
    deliveryType,
    notes: input.notes || "",
    status,
    createdAt: input.createdAt || new Date().toISOString(),
    estimatedTime: input.estimatedTime || "30–45 minutes",
  } as Order;
}

/** Generate the next unique order id: AB-1001, AB-1002 … */
export function generateOrderId(existing?: Order[]): string {
  const orders = existing ?? getOrders();
  let max = 1000;

  orders.forEach((order) => {
    const match = /^AB-(\d+)$/.exec(order.id || "");
    if (match) max = Math.max(max, parseInt(match[1], 10));
  });

  if (hasWindow()) {
    const seq = Number(localStorage.getItem(SEQ_STORAGE_KEY) || 0);
    max = Math.max(max, seq);
  }

  const next = max + 1;
  if (hasWindow()) localStorage.setItem(SEQ_STORAGE_KEY, String(next));
  return `AB-${next}`;
}

/** Read every order (customer orders first). Migrates the legacy key once. */
export function getOrders(): Order[] {
  if (!hasWindow()) return [];

  const stored = parse<any[]>(localStorage.getItem(ORDERS_STORAGE_KEY)) || [];
  let orders = stored.map(normalizeOrder).filter(Boolean) as Order[];

  if (orders.length === 0) {
    const legacy = parse<any[]>(localStorage.getItem(LEGACY_ORDERS_STORAGE_KEY)) || [];
    orders = legacy.map(normalizeOrder).filter(Boolean) as Order[];
    if (orders.length > 0) {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    }
  }

  // newest first
  return orders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/** Overwrite the whole list (used by the customer context). */
export function saveOrders(orders: Order[]): void {
  if (!hasWindow()) return;
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (error) {
    console.error("Failed to save orders:", error);
  }
}

/** Persist a brand new customer order at the top of the list. */
export function saveOrder(order: Order): Order[] {
  const orders = getOrders();
  const normalized = normalizeOrder(order) as Order;
  const next = [normalized, ...orders.filter((o) => o.id !== normalized.id)];
  saveOrders(next);
  return next;
}

/** Update an order's status (admin panel) and persist it. */
export function updateOrderStatus(id: string, status: OrderStatus): Order[] {
  const orders = getOrders().map((order) =>
    order.id === id ? { ...order, status } : order
  );
  saveOrders(orders);
  return orders;
}

/** Helper for building an order object from the checkout form. */
export function buildOrder(params: {
  id: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount?: number;
  total: number;
  customerName: string;
  phone: string;
  address: string;
  paymentMethod: string;
  orderType: Order["orderType"];
  deliveryType: "delivery" | "pickup";
  notes: string;
  estimatedTime: string;
}): Order {
  const quantity = params.items.reduce((sum, item) => sum + item.quantity, 0);
  const order = {
    id: params.id,
    orderNumber: params.id,
    customerName: params.customerName,
    phone: params.phone,
    address: params.address,
    customer: {
      name: params.customerName,
      phone: params.phone,
      address: params.address,
    },
    items: params.items,
    quantity,
    subtotal: params.subtotal,
    deliveryFee: params.deliveryFee,
    discount: params.discount || 0,
    total: params.total,
    paymentMethod: params.paymentMethod,
    orderType: params.orderType,
    deliveryType: params.deliveryType,
    notes: params.notes,
    status: "Pending" as OrderStatus,
    createdAt: new Date().toISOString(),
    estimatedTime: params.estimatedTime,
  };
  return order as Order;
}
