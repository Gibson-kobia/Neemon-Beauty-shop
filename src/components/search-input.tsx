"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { fetchProducts, type Product } from "../lib/products";

export function SearchInput({ className }: { className?: string }) {
  const blur = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><rect width='100%' height='100%' fill='%23f5e7c6'/></svg>";
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function load() {
      const p = await fetchProducts();
      setProducts(p);
    }
    load();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const results = useMemo<Product[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      )
      .slice(0, 5);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setOpen(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="flex items-center relative">
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search products..."
          className="w-full rounded-full pl-4 pr-10 py-2 border border-black/10 dark:border-white/10 bg-white/70 dark:bg-black/60 focus:outline-none focus:ring-2 focus:ring-[color:var(--champagne-gold)]"
        />
        <button
          type="submit"
          className="absolute right-1 top-1 bottom-1 px-3 rounded-full bg-[color:var(--champagne-gold)] text-white flex items-center justify-center"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </button>
      </form>

      {open && (query.trim() || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-xl shadow-lg overflow-hidden z-50">
          {results.length > 0 ? (
            <div className="py-2">
              <div className="px-3 py-1 text-xs text-zinc-500 uppercase tracking-wider font-medium">
                Suggestions
              </div>
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                >
                  <div className="relative w-8 h-10 flex-shrink-0 rounded overflow-hidden">
                    <Image
                      src={
                        product.image && product.image.startsWith("http")
                          ? product.image
                          : "/product-placeholder.png"
                      }
                      alt={product.name}
                      fill
                      sizes="32px"
                      placeholder="blur"
                      blurDataURL={blur}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {product.name}
                    </div>
                    <div className="text-xs text-zinc-500 truncate">
                      {product.brand}
                    </div>
                  </div>
                </Link>
              ))}
              <div className="border-t border-black/10 dark:border-white/10 mt-1">
                <Link
                  href={`/search?q=${encodeURIComponent(query.trim())}`}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 text-sm text-center text-[color:var(--champagne-gold)] hover:underline"
                >
                  See all results for &quot;{query}&quot;
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-4 text-sm text-zinc-500 text-center">
              No products found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
