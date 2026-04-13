export type UserRole = "customer" | "vendor" | "admin";

export interface Profile {
  id: string;
  email?: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  phone: string | null;
  is_suspended?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  vendor_id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  category_id: string | null;
  images: string[];
  stock: number;
  status: "draft" | "active" | "archived";
  is_featured?: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
  vendor?: Profile;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  image_url: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  customer_id: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  shipping_address: ShippingAddress | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  customer?: Profile;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  vendor_id: string;
  quantity: number;
  price: number;
  created_at: string;
  product?: Product;
}

export interface ShippingAddress {
  first_name: string;
  last_name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user?: Profile;
  product?: Product;
}

export interface Dispute {
  id: string;
  order_id: string;
  customer_id: string;
  vendor_id: string;
  reason: string;
  status: "open" | "in_review" | "resolved" | "closed";
  resolution: string | null;
  created_at: string;
  updated_at: string;
  order?: Order;
  customer?: Profile;
  vendor?: Profile;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
