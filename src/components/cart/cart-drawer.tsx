"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchProducts, type Product } from "../../lib/products";
import { useCart } from "./cart-provider";

export function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, setQty, removeItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function load() {
      const p = await fetchProducts();
      setProducts(p);
    }
    if (isDrawerOpen) {
      load();
    }
  }, [isDrawerOpen]);

  useEffect(() => {
    if (!isDrawerOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isDrawerOpen, closeDrawer]);

  const lines = items
    .map((i) => ({
      ...i,
      product: products.find((p) => p.id === i.productId),
    }))
    .filter((l) => l.product);

  const total = lines.reduce(
    (sum, l) => sum + (l.product?.priceKes || 0) * l.qty,
    0
  );

  return (
    <div
      className={`fixed inset-0 z-50 ${
        isDrawerOpen ? "" : "pointer-events-none"
      }`}
      aria-hidden={!isDrawerOpen}
    >
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity ${
          isDrawerOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={closeDrawer}
      />
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-black border-l border-black/10 dark:border-white/10 transition-transform duration-300 ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-5 flex items-center justify-between border-b border-black/10 dark:border-white/10">
          <div className="font-serif text-xl">Your Cart</div>
          <button
            className="rounded-full px-3 py-1 border border-black/10 dark:border-white/10"
            onClick={closeDrawer}
          >
            Close
          </button>
        </div>

        <div className="p-5 overflow-auto h-[calc(100%-168px)]">
          {lines.length === 0 ? (
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              Your cart is empty.
            </div>
          ) : (
            <div className="space-y-4">
              {lines.map((l) => (
                <div
                  key={l.product!.id}
                  className="flex gap-4 rounded-xl border border-black/10 dark:border-white/10 p-3"
                >
                  <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-white dark:bg-black">
                    <Image
                      src={l.product!.image || "/product-placeholder.png"}
                      alt={l.product!.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-zinc-500">
                      {l.product!.brand}
                    </div>
                    <div className="text-sm font-medium leading-5">
                      {l.product!.name}
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-sm font-semibold">
                        KES {l.product!.priceKes.toLocaleString()}
                      </div>
                      <div className="text-sm text-zinc-600 dark:text-zinc-400">
                        Subtotal:{" "}
                        <span className="font-medium">
                          KES {(l.product!.priceKes * l.qty).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full border border-black/10 dark:border-white/10 overflow-hidden">
                        <button
                          className="px-3 py-1 hover:bg-black/5 dark:hover:bg-white/10"
                          onClick={() => setQty(l.product!.id, l.qty - 1)}
                        >
                          −
                        </button>
                        <div className="px-3 py-1 text-sm">{l.qty}</div>
                        <button
                          className="px-3 py-1 hover:bg-black/5 dark:hover:bg-white/10"
                          onClick={() => setQty(l.product!.id, l.qty + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="text-sm text-zinc-500 hover:text-red-600"
                        onClick={() => removeItem(l.product!.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-5 border-t border-black/10 dark:border-white/10">
          <div className="flex items-center justify-between">
            <div className="text-sm text-zinc-600 dark:text-zinc-400">Total</div>
            <div className="text-lg font-semibold">
              KES {total.toLocaleString()}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link
              href="/cart"
              onClick={() => closeDrawer()}
              className="rounded-full px-4 py-2 border border-black/10 dark:border-white/10 text-center"
            >
              View cart
            </Link>
            <Link
              href="/checkout"
              onClick={() => closeDrawer()}
              className="rounded-full px-4 py-2 bg-[color:var(--champagne-gold)] text-white text-center"
            >
              Checkout
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
