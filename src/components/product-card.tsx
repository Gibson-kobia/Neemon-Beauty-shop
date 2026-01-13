"use client";
import Image from "next/image";
import Link from "next/link";
import { Product } from "../lib/types";
import { AddToCartButton } from "./add-to-cart-button";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-black overflow-hidden">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5]">
          <Image
            src={product.image && product.image.startsWith("http") ? product.image : "/product-placeholder.png"}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
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
        <div className="mt-3 flex items-center justify-between">
          <AddToCartButton productId={product.id} />
          <div className="text-xs text-zinc-500">
            {product.rating.toFixed(1)} ★ ({product.reviewsCount})
          </div>
        </div>
      </div>
    </div>
  );
}
