export interface MenuCategory {
  id: string;
  name: string;
  icon: string;
  order: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  badges: string[];
  spicyLevel: 0 | 1 | 2 | 3;
  prepTime: string;
}

export interface Deal {
  id: string;
  name: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercent: number;
  image: string;
  items: string[];
  badge: string;
  popular: boolean;
}

export interface CartItem {
  id: string;
  type: "menu" | "deal";
  name: string;
  price: number;
  image: string;
  quantity: number;
  description?: string;
  dealItems?: string[];
}

export type OrderStatus =
  | "Pending"
  | "Accepted"
  | "Preparing"
  | "Ready"
  | "Out for Delivery"
  | "Completed"
  | "Cancelled";

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  items: CartItem[];
  quantity: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: string;
  orderType: "Delivery" | "Pickup" | "Dine In" | "Takeaway";
  notes: string;
  status: OrderStatus;
  createdAt: string;
  estimatedTime: string;
  /** Kept for the success / tracking pages */
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  deliveryType: "delivery" | "pickup";
}

export interface TrackingStep {
  id: string;
  label: string;
  description: string;
  completed: boolean;
  current: boolean;
  time?: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
}

export interface RestaurantInfo {
  name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  hours: {
    open: string;
    close: string;
    days: string;
  };
  deliveryTime: string;
  currency: string;
  currencySymbol: string;
}

export interface NavigationItem {
  label: string;
  href: string;
}

export interface AnnouncementBar {
  text: string;
  link: string;
  linkText: string;
}

export interface SocialLink {
  name: string;
  href: string;
  icon: string;
}

export interface WhyChooseUsItem {
  icon: string;
  title: string;
  description: string;
}

export interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  text: string;
  image: string;
}

export interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: "food" | "interior" | "kitchen";
}

export interface TodaysSpecial {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  badge: string;
  availableUntil: string;
}