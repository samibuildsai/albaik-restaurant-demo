/**
 * Integration test: customer checkout save -> admin Orders display -> status update.
 * Run: node --import ./scripts/register.mjs scripts/test-admin-flow.ts
 */
const store = new Map<string, string>();
(globalThis as any).localStorage = {
  getItem: (k: string) => (store.has(k) ? (store.get(k) as string) : null),
  setItem: (k: string, v: string) => void store.set(k, String(v)),
  removeItem: (k: string) => void store.delete(k),
  clear: () => void store.clear(),
};
(globalThis as any).window = globalThis;

const orders = await import("../src/lib/orders.ts");
const adminOrders = await import("../src/lib/adminOrders.ts");

let failures = 0;
function check(label: string, condition: boolean, extra?: unknown) {
  if (condition) console.log(`  PASS  ${label}`);
  else {
    failures++;
    console.log(`  FAIL  ${label}`, extra ?? "");
  }
}

// --- customer places an order (same call the checkout page makes)
const order = orders.buildOrder({
  id: orders.generateOrderId(),
  items: [
    { id: "m1", type: "menu", name: "Flame Burger", price: 900, image: "", quantity: 2 },
    { id: "m2", type: "menu", name: "Fries", price: 350, image: "", quantity: 1 },
  ],
  subtotal: 2150,
  deliveryFee: 0,
  total: 2150,
  customerName: "Ali Raza",
  phone: "03001234567",
  address: "Sargodha",
  paymentMethod: "Cash on Delivery",
  orderType: "Delivery",
  deliveryType: "delivery",
  notes: "no onions",
  estimatedTime: "30–45 minutes",
});
orders.saveOrder(order);

// --- admin Orders page reads the same key
const rows = adminOrders.getAdminOrders();
const first = rows[0];

check("real order appears FIRST (before demo rows)", first && first.id === "AB-1001", first?.id);
check("real order is not flagged as demo", first?.isDemo === undefined || first.isDemo === false);
check("customer name shown", first?.customer === "Ali Raza", first?.customer);
check("phone shown", first?.phone === "03001234567", first?.phone);
check(
  "items shown with qty",
  first?.items.length === 2 && first.items[0].name === "Flame Burger" && first.items[0].qty === 2,
  first?.items
);
check("total shown", first?.total === 2150, first?.total);
check("order type shown", first?.type === "Delivery", first?.type);
check("payment method shown", first?.paymentMethod === "Cash on Delivery", first?.paymentMethod);
check("status shown", first?.status === "Pending", first?.status);
check("date/time shown", Boolean(first?.time && first.time !== "—"), first?.time);
check("demo rows still present after real order", rows.length > 1, rows.length);
check("real orders listed before demo rows", rows.findIndex((r) => r.isDemo) === 1);

// --- admin changes status
const persisted = adminOrders.saveOrderStatus("AB-1001", "Out for Delivery");
check("saveOrderStatus reports a persisted (real) order", persisted === true, persisted);

const afterStatus = adminOrders.getAdminOrders()[0];
check("admin shows new status", afterStatus.status === "Out for Delivery", afterStatus.status);
check(
  "status persisted in restaurant_orders",
  JSON.parse(store.get(orders.ORDERS_STORAGE_KEY)!)[0].status === "Out for Delivery"
);

// --- refresh: re-read from scratch
const afterRefresh = adminOrders.getAdminOrders()[0];
check("order still there after refresh", afterRefresh.id === "AB-1001");
check("status still correct after refresh", afterRefresh.status === "Out for Delivery");

// --- demo (mock) order status change must NOT crash / must not pretend to persist
const demoRow = rows.find((r) => r.isDemo);
if (demoRow) {
  check("saveOrderStatus returns false for demo orders", adminOrders.saveOrderStatus(demoRow.id, "Cancelled") === false);
}

// --- all 7 statuses valid
for (const s of ["Pending", "Accepted", "Preparing", "Ready", "Out for Delivery", "Completed", "Cancelled"]) {
  adminOrders.saveOrderStatus("AB-1001", s as any);
  const ok = adminOrders.getAdminOrders()[0].status === s;
  if (!ok) {
    failures++;
    console.log(`  FAIL  status ${s} not applied`);
  }
}
console.log("  PASS  all 7 statuses apply and persist");

console.log(failures === 0 ? "\nALL TESTS PASSED" : `\n${failures} TEST(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
