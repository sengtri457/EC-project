export type Audience = "all" | "men" | "women" | "kids" | "unisex";
export type Department = "all" | "clothes" | "shoes" | "accessories";
export type Subcategory =
  | "all"
  // Clothes
  | "tshirt"
  | "sweater"
  | "hoodies"
  // Shoes
  | "running"
  | "basketball"
  | "lifestyle"
  // Accessories
  | "hat"
  | "jewelry"
  | "socks";

export type Product = {
  id: number;
  slug?: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  thumbnail: string;
  category: string;
  
  // 3-Tier Hierarchical Taxonomy
  audience?: Audience;
  department?: Department;
  subcategory?: Subcategory;

  fabric?: string;
  sizes?: string[];
  imageWidth?: number;
  imageHeight?: number;
};

export type CartItem = {
  productId: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
};

export type ShippingMethod =
  | "phnom_penh_express"
  | "phnom_penh_standard"
  | "provincial";

export type PaymentMethod = "khqr" | "cod" | "card";

export type Customer = {
  name: string;
  email: string;
  phone: string; // Cambodian phone (0xx xxx xxx or +855...)
  telegram?: string;
  address: string; // Full composite address string
  
  // Structured Cambodian Address
  cityProvince: string; // e.g. "Phnom Penh", "Siem Reap", "Battambang"
  khanDistrict?: string; // e.g. "Chamkarmon", "Tuol Kouk"
  sangkatCommune?: string; // e.g. "BKK1", "Phsar Thmey"
  streetAddress: string; // e.g. "House #24, Street 310"
  landmark?: string; // e.g. "Near Russian Market / BKK High School"

  // Legacy fallback optional fields
  street?: string;
  apartment?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;

  // Order choices
  shippingMethod?: ShippingMethod;
  shippingCost?: number;
  paymentMethod?: PaymentMethod;
  cardNumberLast4?: string;
  orderNotes?: string;
};

export type Order = {
  id: string;
  createdAt: string; // ISO date string
  customer: Customer;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  totalKhr?: number; // Cambodian Riel at 1 USD = 4,100 KHR
  trackingNumber?: string;
  status?: "confirmed" | "processing" | "out_for_delivery" | "delivered";
};

export type UserAddress = {
  cityProvince: string;
  khanDistrict?: string;
  sangkatCommune?: string;
  streetAddress: string;
  landmark?: string;
  // Fallbacks
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  telegram?: string;
  address?: UserAddress;
};
