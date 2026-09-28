/**
 * Throwaway integration test for src/lib/orders.ts
 * Run: node scripts/test-orders.ts
 */
const store = new Map<string, string>();
(globalThis as any).localStorage = {
  getItem: (k: string) => (store.has(k) ? (store.get(k) as string) : null),
  setItem: (k: string, v: string) => void store.set(k, String(v)),
  removeItem: (k: string) => void store.delete(k),
  clear: () => void store.clear(),
};
// The utility checks for `window` before touching localStorage
(globalThis as any).window = globalThis;

const {
  ORDERS_STORAGE_KEY,
  generateOrderId,
  buildOrder,
  saveOrder,
  getOrders,
  updateOrderStatus,
} = await import("../src/lib/orders.ts");

let failures = 0;
function check(label: string, condition: boolean, extra?: unknown) {
  if (condition) {
    console.log(`  PASS  ${label}`);
  } else {
    failures++;
    console.log(`  FAIL  ${label}`, extra ?? "");
  }
}

// --- 1. Customer places order #1
const order1 = buildOrder({
  id: generateOrderId(),
  items: [{ id: "m1", type: "menu", name: "Flame Burger", price: 900, image: "", quantity: 2 }],
  subtotal: 1800,
  deliveryFee: 150,
  total: 1950,
  customerName: "Ali",
  phone: "03001234567",
  address: "Sargodha",
  paymentMethod: "Cash on Delivery",
  orderType: "Delivery",
  deliveryType: "delivery",
  notes: "extra spicy",
  estimatedTime: "30–45 minutes",
});
saveOrder(order1);

check("order id is AB-1001", order1.id === "AB-1001", order1.id);
check("status defaults to Pending", order1.status === "Pending", order1.status);
check("quantity calculated", order1.quantity === 2, order1.quantity);

let orders = getOrders();
check("1 order stored", orders.length === 1, orders.length);
check(
  "stored in restaurant_orders key",
  (store.get(ORDERS_STORAGE_KEY) || "").includes("AB-1001")
);
check("flat fields saved", orders[0].customerName === "Ali" && orders[0].phone === "03001234567" && orders[0].address === "Sargodha");
check("money fields saved", orders[0].subtotal === 1800 && orders[0].deliveryFee === 150 && orders[0].total === 1950);
check("payment + type saved", orders[0].paymentMethod === "Cash on Delivery" && orders[0].orderType === "Delivery");
check("notes saved", orders[0].notes === "extra spicy");
check("createdAt present", Boolean(orders[0].createdAt));

// --- 2. Second order gets AB-1002
const order2 = buildOrder({
  id: generateOrderId(),
  items: [{ id: "m2", type: "menu", name: "Pizza", price: 1490, image: "", quantity: 1 }],
  subtotal: 1490,
  deliveryFee: 0,
  total: 1490,
  customerName: "Sara",
  phone: "03331112222",
  address: "Lahore",
  paymentMethod: "Pay at Counter",
  orderType: "Pickup",
  deliveryType: "pickup",
  notes: "",
  estimatedTime: "15–20 minutes",
});
saveOrder(order2);
check("second order id is AB-1002", order2.id === "AB-1002", order2.id);

orders = getOrders();
check("2 orders stored", orders.length === 2, orders.length);
check("newest order first", orders[0].id === "AB-1002", orders[0].id);

// --- 3. Admin changes a status
updateOrderStatus("AB-1001", "Preparing");
orders = getOrders();
const reloaded = orders.find((o) => o.id === "AB-1001");
check("status updated to Preparing", reloaded?.status === "Preparing", reloaded?.status);

// Simulate a page refresh: read straight from localStorage again
const freshRead = JSON.parse(store.get(ORDERS_STORAGE_KEY)!);
check(
  "status persists after refresh",
  freshRead.find((o: any) => o.id === "AB-1001")?.status === "Preparing"
);

updateOrderStatus("AB-1001", "Out for Delivery");
const freshRead2 = JSON.parse(store.get(ORDERS_STORAGE_KEY)!);
check(
  "second status change persists",
  freshRead2.find((o: any) => o.id === "AB-1001")?.status === "Out for Delivery"
);

// --- 4. Legacy orders (old key / old shape) are migrated
store.clear();
store.set(
  "flame-fork-orders",
  JSON.stringify([
    {
      id: "FF-1042",
      orderNumber: "FF-1042",
      items: [{ id: "x", type: "menu", name: "Biryani", price: 1190, quantity: 2 }],
      subtotal: 2380,
      deliveryFee: 150,
      discount: 0,
      total: 2530,
      customer: { name: "Old Customer", phone: "03009999999", address: "Karachi" },
      deliveryType: "delivery",
      paymentMethod: "cod",
      notes: "",
      status: "out-for-delivery",
      createdAt: "2026-09-28T10:00:00.000Z",
      estimatedTime: "30–45 minutes",
    },
  ])
);
const migrated = getOrders();
check("legacy order migrated", migrated.length === 1, migrated.length);
check("legacy status mapped", migrated[0]?.status === "Out for Delivery", migrated[0]?.status);
check("legacy nested customer flattened", migrated[0]?.customerName === "Old Customer");
check("legacy payment readable", migrated[0]?.paymentMethod === "Cash on Delivery", migrated[0]?.paymentMethod);
check(
  "migrated into restaurant_orders",
  (store.get(ORDERS_STORAGE_KEY) || "").includes("FF-1042")
);

console.log(failures === 0 ? "\nALL TESTS PASSED" : `\n${failures} TEST(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
