import { Product, DBProduct, CategorySlug } from "./types";
import { getSupabase } from "./supabase";

export type { Product };

// Mapper to convert DB Product to Frontend Product
function mapDBProductToProduct(dbProduct: DBProduct): Product {
  return {
    id: dbProduct.id,
    slug: dbProduct.slug,
    name: dbProduct.name,
    brand: dbProduct.brand,
    category: dbProduct.category as CategorySlug,
    priceKes: dbProduct.price,
    image: dbProduct.image_url,
    description: dbProduct.description,
    stock: dbProduct.stock,
    rating: dbProduct.rating,
    reviewsCount: dbProduct.reviews_count,
  };
}

// --- ASYNC FUNCTIONS FOR SUPABASE ---

export async function fetchProducts(): Promise<Product[]> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .gt("stock", 0);

    if (error) {
      console.error("Error fetching products:", error);
      return [];
    }

    return (data || []).map(mapDBProductToProduct);
  } catch (error) {
    console.error("Supabase client not initialized:", error);
    return [];
  }
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error || !data) {
      return null;
    }
    return mapDBProductToProduct(data);
  } catch (error) {
    console.error("Supabase client not initialized:", error);
    return null;
  }
}

export async function fetchProductsByCategory(category: string): Promise<Product[]> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category", category)
      .eq("is_active", true)
      .gt("stock", 0);

    if (error) return [];
    return (data || []).map(mapDBProductToProduct);
  } catch (error) {
    console.error("Supabase client not initialized:", error);
    return [];
  }
}
