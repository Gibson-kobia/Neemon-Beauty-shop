"use client";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchProductBySlug, fetchProducts, type Product } from "../../../lib/products";
import { AddToCartButton } from "../../../components/add-to-cart-button";
import { AddToWishlistButton } from "../../../components/add-to-wishlist-button";
import { useState, useEffect } from "react";

export default function ProductPage({ params }: { params: { slug: string } }) {
  const [imgError, setImgError] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const p = await fetchProductBySlug(params.slug);
        setProduct(p);

        if (p) {
          // Fetch all products to find related ones
          // Ideally we would have a specific fetchRelatedProducts API, but filtering client-side or fetching all is okay for now as per previous logic
          const allProducts = await fetchProducts();
          const rel = allProducts
            .filter((item) => item.category === p.category && item.id !== p.id)
            .slice(0, 4);
          setRelated(rel);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.slug]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!product) return notFound();
  const blur = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><rect width='100%' height='100%' fill='%23f5e7c6'/></svg>";

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="relative rounded-2xl p-8 md:p-12 border bg-white dark:bg-black overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--nude-blush)] via-[color:var(--champagne-gold)] to-[color:var(--ivory-white)] opacity-25" />
        <div className="relative text-center">
          <div className="font-serif text-xl md:text-2xl">💄 Our full beauty collection is launching soon</div>
          <div className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
            We are carefully curating the best products for every skin tone and style.
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative aspect-[4/5] rounded-xl overflow-hidden border bg-white dark:bg-black">
          {product.image.startsWith("http") && !imgError && (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              placeholder="blur"
              blurDataURL={blur}
              onError={() => setImgError(true)}
              className="object-cover"
            />
          )}
        </div>
        <div>
          <div className="text-sm text-zinc-500">{product.brand}</div>
          <div className="font-serif text-2xl mt-1">{product.name}</div>
          <div className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
            <span aria-hidden>☆☆☆☆☆</span>
            <span className="ml-2">No reviews yet</span>
          </div>
          <div className="mt-3 text-xl font-semibold">KES {product.priceKes.toLocaleString()}</div>
          <p className="mt-4 text-sm text-zinc-700 dark:text-zinc-300">{product.description}</p>
          <div className="mt-5 flex gap-3">
            <AddToCartButton productId={product.id} />
            <AddToWishlistButton productId={product.id} />
          </div>
        </div>
      </div>
      {related.length > 0 && (
        <div className="mt-12">
          <div className="font-serif text-xl mb-4">You may also like</div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p) => (
              <div key={p.id} className="rounded-xl border p-4 bg-white dark:bg-black">
                <Link href={`/product/${p.slug}`} className="block">
                  <div className="relative aspect-[4/5] rounded-md overflow-hidden">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      placeholder="blur"
                      blurDataURL={blur}
                      className="object-cover"
                    />
                  </div>
                  <div className="mt-3 text-xs text-zinc-500">{p.brand}</div>
                  <div className="font-medium">{p.name}</div>
                  <div className="mt-1 font-semibold">KES {p.priceKes.toLocaleString()}</div>
                  <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                    <span aria-hidden>☆☆☆☆☆</span>
                    <span className="ml-2">No reviews yet</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
