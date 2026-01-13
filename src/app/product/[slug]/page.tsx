"use client";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, products } from "../../../lib/products";
import { AddToCartButton } from "../../../components/add-to-cart-button";
import { AddToWishlistButton } from "../../../components/add-to-wishlist-button";
import { useState } from "react";

export default function ProductPage({ params }: { params: { slug: string } }) {
  const [imgError, setImgError] = useState(false);
  const product = getProductBySlug(params.slug);
  if (!product) return notFound();

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  const blur = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><rect width='100%' height='100%' fill='%23f5e7c6'/></svg>";

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="relative aspect-[4/5] rounded-2xl border overflow-hidden bg_white dark:bg-black">
          <Image
            src={
              !imgError && product.image && product.image.startsWith("http")
                ? product.image
                : "/product-placeholder.png"
            }
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            placeholder="blur"
            blurDataURL={blur}
            onError={() => setImgError(true)}
            className="object-cover"
          />
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            {product.brand}
          </div>
          <h1 className="font-serif text-3xl mt-2">{product.name}</h1>
          <div className="mt-3 text-2xl font-semibold">
            KES {product.priceKes.toLocaleString()}
          </div>
          <p className="mt-6 text-sm text-zinc-700 dark:text-zinc-300">
            {product.description}
          </p>
          <div className="mt-6">
            <AddToCartButton
              productId={product.id}
              className="relative rounded-full px-6 py-3 bg-[color:var(--champagne-gold)] text-white hover:opacity-90 transition-transform active:scale-[0.98]"
            />
          </div>
          <span className="mt-3 ml-3 inline-block">
            <AddToWishlistButton productId={product.id} />
          </span>
          <div className="mt-8 border-t pt-4 text-sm text-zinc-600 dark:text-zinc-400"></div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="font-serif text-2xl mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p) => (
              <div key={p.id} className="group">
                <Link href={`/product/${p.slug}`}>
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-white dark:bg-black border border-black/5 dark:border-white/10">
                    <Image
                      src={
                        p.image && p.image.startsWith("http")
                          ? p.image
                          : "/product-placeholder.png"
                      }
                      alt={p.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      placeholder="blur"
                      blurDataURL={blur}
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                </Link>
                <div className="mt-3">
                  <div className="text-xs text-zinc-500">{p.brand}</div>
                  <Link href={`/product/${p.slug}`}>
                    <div className="font-medium hover:underline truncate">
                      {p.name}
                    </div>
                  </Link>
                  <div className="mt-1 font-semibold">
                    KES {p.priceKes.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
