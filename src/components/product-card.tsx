"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Product } from "../lib/types";
import { AddToCartButton } from "./add-to-cart-button";

export function ProductCard({ product }: { product: Product }) {
  const [error, setError] = useState(false);
  const blur = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><rect width='100%' height='100%' fill='%23f5e7c6'/></svg>";
  const src =
    !error && product.image && product.image.startsWith("http")
      ? product.image
      : "/product-placeholder.png";
  return (
    <div className="group rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-black overflow-hidden">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5]">
          <Image
            src={src}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            placeholder="blur"
            blurDataURL={blur}
            onError={() => setError(true)}
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>
      </Link>
      <div className="p-4">
        <div className="text-xs text-zinc-500 mb-1">{product.brand}</div>
        <Link href={`/product/${product.slug}`} className="block">
          <div className="font-medium">{product.name}</div>
        </Link>
        <div className="mt-2 font-semibold">KES {product.priceKes.toLocaleString()}</div>
        <div className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
          <span aria-hidden>☆☆☆☆☆</span>
          <span className="ml-2">No reviews yet</span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <AddToCartButton productId={product.id} />
        </div>
      </div>
    </div>
  );
}
