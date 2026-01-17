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
  priceKes: number;
  image: string;
  description: string;
  stock: number;
  rating: number;
  reviewsCount: number;
};

export type CartItem = {
  productId: string;
  qty: number;
};
