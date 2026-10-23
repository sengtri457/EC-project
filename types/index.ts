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

export type Customer = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

export type Order = {
  id: string;
  createdAt: string; // ISO date string
  customer: Customer;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
};
