export type CategorySlug =
  | "makeup"
  | "skincare"
  | "hair"
  | "perfumes"
  | "tools";

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: CategorySlug;
  priceKes: number; // Frontend uses this
  image: string;    // Frontend uses this
  description: string;
  stock: number;
  rating: number;
  reviewsCount: number; // Frontend uses this
  is_active?: boolean;
};

// Database representation of a Product
export type DBProduct = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  image_url: string;
  description: string;
  stock: number;
  rating: number;
  reviews_count: number;
  is_active: boolean;
  seller_id?: string; // Added for RLS
  created_at?: string;
};

export type CartItem = {
  productId: string;
  qty: number;
};

export type OrderStatus = 'NEW' | 'PREPARING' | 'WITH_RIDER' | 'DELIVERED' | 'CANCELLED';

export type Order = {
  id: string;
  user_id?: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  items: CartItem[]; // Stored as JSONB in DB
  total: number;
  delivery_method: string;
  status: OrderStatus;
  created_at: string;
};
