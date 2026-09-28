export type OrderStatus =
  | "Pending"
  | "Accepted"
  | "Preparing"
  | "Ready"
  | "Out for Delivery"
  | "Completed"
  | "Cancelled";

export interface AdminOrder {
  id: string;
  customer: string;
  phone: string;
  address?: string;
  total: number;
  type: "Dine In" | "Takeaway" | "Delivery";
  status: OrderStatus;
  time: string;
  createdAt?: string;
  paymentMethod?: string;
  items: { name: string; qty: number; price: number }[];
  isDemo?: boolean;
}

export const mockOrders: AdminOrder[] = [
  { id: "FF-1042", customer: "Ali Hassan", phone: "+92 300 1111111", total: 3290, type: "Delivery", status: "Out for Delivery", time: "12:45 PM", items: [{ name: "Double Trouble Burger", qty: 2, price: 1290 }, { name: "Coke (500ml)", qty: 2, price: 120 }, { name: "Large Fries", qty: 1, price: 450 }] },
  { id: "FF-1041", customer: "Sarah Ahmed", phone: "+92 301 2222222", total: 2180, type: "Dine In", status: "Preparing", time: "12:38 PM", items: [{ name: "Creamy Carbonara", qty: 1, price: 1390 }, { name: "Mint Lemonade", qty: 2, price: 250 }, { name: "Chocolate Lava Cake", qty: 1, price: 590 }] },
  { id: "FF-1040", customer: "Usman Tariq", phone: "+92 302 3333333", total: 6490, type: "Delivery", status: "Pending", time: "12:30 PM", items: [{ name: "Family Feast Deal", qty: 1, price: 6490 }] },
  { id: "FF-1039", customer: "Hina Malik", phone: "+92 303 4444444", total: 1790, type: "Takeaway", status: "Ready", time: "12:22 PM", items: [{ name: "Pepperoni Feast", qty: 1, price: 1790 }] },
  { id: "FF-1038", customer: "Bilal Raza", phone: "+92 304 5555555", total: 4870, type: "Delivery", status: "Completed", time: "11:55 AM", items: [{ name: "Chicken Biryani", qty: 2, price: 1190 }, { name: "BBQ Mixed Platter", qty: 1, price: 3490 }] },
  { id: "FF-1037", customer: "Ayesha Noor", phone: "+92 305 6666666", total: 1180, type: "Dine In", status: "Completed", time: "11:40 AM", items: [{ name: "Chicken Tenders", qty: 1, price: 990 }, { name: "Sprite (500ml)", qty: 1, price: 120 }] },
  { id: "FF-1036", customer: "Kamran Shah", phone: "+92 306 7777777", total: 2290, type: "Takeaway", status: "Cancelled", time: "11:20 AM", items: [{ name: "Flame-Grilled BBQ Ribs", qty: 1, price: 2290 }] },
  { id: "FF-1035", customer: "Zara Khan", phone: "+92 307 8888888", total: 3980, type: "Delivery", status: "Completed", time: "11:05 AM", items: [{ name: "Chicken Alfredo", qty: 2, price: 1490 }, { name: "Garlic Bread", qty: 1, price: 500 }, { name: "Mango Lassi", qty: 2, price: 290 }] },
  { id: "FF-1034", customer: "Faisal Iqbal", phone: "+92 308 9999999", total: 1490, type: "Dine In", status: "Completed", time: "10:48 AM", items: [{ name: "Classic Margherita", qty: 1, price: 1490 }] },
  { id: "FF-1033", customer: "Nadia Saeed", phone: "+92 309 1231234", total: 2670, type: "Takeaway", status: "Completed", time: "10:30 AM", items: [{ name: "Philly Cheesesteak", qty: 2, price: 1190 }, { name: "Fresh Mint Lemonade", qty: 1, price: 250 }, { name: "Coke", qty: 1, price: 120 }] },
];

export const bestSellers = [
  { name: "Flame-Grilled Classic Burger", sold: 142, revenue: 126380, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop" },
  { name: "Pepperoni Feast Pizza", sold: 118, revenue: 211220, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=200&h=200&fit=crop" },
  { name: "Chicken Biryani", sold: 97, revenue: 115430, image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=200&h=200&fit=crop" },
  { name: "Flame-Grilled BBQ Ribs", sold: 76, revenue: 174040, image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=200&h=200&fit=crop" },
  { name: "Creamy Carbonara", sold: 71, revenue: 98690, image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=200&h=200&fit=crop" },
];

export const salesWeekly = [
  { label: "Mon", value: 48200 },
  { label: "Tue", value: 52100 },
  { label: "Wed", value: 44800 },
  { label: "Thu", value: 61300 },
  { label: "Fri", value: 88400 },
  { label: "Sat", value: 104900 },
  { label: "Sun", value: 96700 },
];

export const salesMonthly = [
  { label: "Week 1", value: 312000 },
  { label: "Week 2", value: 348000 },
  { label: "Week 3", value: 401000 },
  { label: "Week 4", value: 437500 },
];

export const inventory = [
  { name: "Beef Patties (200g)", category: "Meat", stock: 42, unit: "pcs", min: 50 },
  { name: "Chicken (whole)", category: "Meat", stock: 18, unit: "kg", min: 20 },
  { name: "Mozzarella Cheese", category: "Dairy", stock: 9, unit: "kg", min: 10 },
  { name: "Pizza Dough Balls", category: "Bakery", stock: 64, unit: "pcs", min: 40 },
  { name: "Burger Buns", category: "Bakery", stock: 85, unit: "pcs", min: 60 },
  { name: "Lettuce", category: "Vegetables", stock: 6, unit: "kg", min: 8 },
  { name: "Tomatoes", category: "Vegetables", stock: 14, unit: "kg", min: 10 },
  { name: "Cooking Oil", category: "Pantry", stock: 30, unit: "ltr", min: 15 },
  { name: "Coca Cola Cans", category: "Beverages", stock: 120, unit: "cans", min: 48 },
  { name: "French Fries (frozen)", category: "Frozen", stock: 22, unit: "kg", min: 25 },
];

export const expenses = [
  { id: "EXP-091", category: "Ingredients", note: "Weekly meat & dairy supplier", amount: 48500, date: "28 Sep 2026" },
  { id: "EXP-090", category: "Staff Payroll", note: "Weekly wages (kitchen + service)", amount: 62000, date: "26 Sep 2026" },
  { id: "EXP-089", category: "Utilities", note: "Electricity + gas", amount: 18400, date: "25 Sep 2026" },
  { id: "EXP-088", category: "Marketing", note: "Social media ads", amount: 12000, date: "24 Sep 2026" },
  { id: "EXP-087", category: "Packaging", note: "Delivery boxes & bags", amount: 7600, date: "23 Sep 2026" },
  { id: "EXP-086", category: "Rent", note: "Monthly shop rent", amount: 85000, date: "20 Sep 2026" },
];

export const statusStyles: Record<OrderStatus, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Accepted: "bg-cyan-100 text-cyan-700",
  Preparing: "bg-blue-100 text-blue-700",
  Ready: "bg-violet-100 text-violet-700",
  "Out for Delivery": "bg-orange-100 text-orange-700",
  Completed: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-600",
};

export const orderStatuses: OrderStatus[] = [
  "Pending",
  "Accepted",
  "Preparing",
  "Ready",
  "Out for Delivery",
  "Completed",
  "Cancelled",
];
