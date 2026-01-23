"use client";
import Image from "next/image";
import Link from "next/link";
import { fetchProducts, type Product } from "../../lib/products";
import { useCart } from "../../components/cart/cart-provider";
import { useMemo, useState, useEffect } from "react";

export default function CartPage() {
  const { items: cart, setQty, removeItem, addItem } = useCart();
  const [delivery, setDelivery] = useState<"nairobi" | "kenya">("nairobi");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await fetchProducts();
      setProducts(data);
      setLoading(false);
    }
    load();
  }, []);

  const blur = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><rect width='100%' height='100%' fill='%23f5e7c6'/></svg>";

  const items = cart
    .map((c) => ({ ...c, product: products.find((p) => p.id === c.productId) }))
    .filter((i) => i.product);

  const total = items.reduce((sum, i) => sum + (i.product?.priceKes || 0) * i.qty, 0);
  const estimate = useMemo(() => {
    return delivery === "nairobi" ? "Same‑day via bodaboda" : "1‑3 days via courier";
  }, [delivery]);

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem("wishlist") : null;
    return raw ? (JSON.parse(raw) as string[]) : [];
  });

  const saveForLater = (id: string) => {
    const current = cart.find((c) => c.productId === id);
    if (current) {
      setWishlistIds((prev) => {
        const next = [...prev, id];
        const unique = Array.from(new Set(next));
        localStorage.setItem("wishlist", JSON.stringify(unique));
        return unique;
      });
      removeItem(id);
    }
  };

  const wishlistItems = wishlistIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p) => p !== undefined);

  const moveToCart = (id: string) => {
    setWishlistIds((prev) => {
      const next = prev.filter((pid) => pid !== id);
      localStorage.setItem("wishlist", JSON.stringify(next));
      return next;
    });
    addItem(id);
  };

  const removeWishlist = (id: string) => {
    setWishlistIds((prev) => {
      const next = prev.filter((pid) => pid !== id);
      localStorage.setItem("wishlist", JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="font-serif text-3xl mb-6">Your Cart</h1>
      {items.length === 0 ? (
        <div>
          <div>Your cart is empty.</div>
          <Link
            href="/"
            className="mt-4 inline-block rounded-full px-4 py-2 border"
          >
            Back to Home
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            {items.map((i) => (
              <div
                key={i.product?.id}
                className="flex items-center gap-4 border rounded-xl p-4 bg-white dark:bg-black"
              >
                <div className="relative w-20 h-24 rounded-md overflow-hidden">
                  <Image
                    src={
                      i.product?.image && i.product?.image.startsWith("http")
                        ? i.product?.image
                        : "/product-placeholder.png"
                    }
                    alt={i.product?.name || ""}
                    fill
                    sizes="80px"
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL={blur}
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-zinc-500">{i.product?.brand}</div>
                  <div className="font-medium">{i.product?.name}</div>
                  <div className="mt-1">
                    KES {i.product?.priceKes.toLocaleString()}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      className="px-2 py-1 border rounded"
                      onClick={() => setQty(i.product!.id, i.qty - 1)}
                    >
                      −
                    </button>
                    <span>{i.qty}</span>
                    <button
                      className="px-2 py-1 border rounded"
                      onClick={() => setQty(i.product!.id, i.qty + 1)}
                    >
                      +
                    </button>
                    <button
                      className="ml-4 text-red-600"
                      onClick={() => removeItem(i.product!.id)}
                    >
                      Remove
                    </button>
                    <button
                      className="ml-2 text-zinc-600 underline"
                      onClick={() => saveForLater(i.product!.id)}
                    >
                      Save for later
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {wishlistItems.length > 0 && (
              <div className="mt-6">
                <div className="font-medium mb-2">Saved for later</div>
                <div className="space-y-3">
                  {wishlistItems.map((p) => (
                    <div
                      key={p!.id}
                      className="flex items-center justify-between border rounded-xl p-3 bg-white dark:bg-black"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-16 rounded-md overflow-hidden">
                          <Image
                            src={
                              p!.image && p!.image.startsWith("http")
                                ? p!.image
                                : "/product-placeholder.png"
                            }
                            alt={p!.name}
                            fill
                            sizes="64px"
                            loading="lazy"
                            placeholder="blur"
                            blurDataURL={blur}
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="text-xs text-zinc-500">
                            {p!.brand}
                          </div>
                          <div className="text-sm font-medium">
                            {p!.name}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          className="text-sm underline"
                          onClick={() => moveToCart(p!.id)}
                        >
                          Move to cart
                        </button>
                        <button
                          className="text-sm text-red-600"
                          onClick={() => removeWishlist(p!.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="border rounded-xl p-4 bg-white dark:bg-black">
            <div className="font-medium">Order Summary</div>
            <div className="mt-2 flex justify-between">
              <span>Total</span>
              <span className="font-semibold">
                KES {total.toLocaleString()}
              </span>
            </div>
            <div className="mt-4">
              <div className="text-sm font-medium">Estimated delivery</div>
              <div className="mt-2 flex gap-2 text-sm">
                <button
                  className={`px-3 py-1 rounded-full border ${
                    delivery === "nairobi"
                      ? "bg-[color:var(--champagne-gold)] text-white"
                      : ""
                  }`}
                  onClick={() => setDelivery("nairobi")}
                >
                  Nairobi (bodaboda)
                </button>
                <button
                  className={`px-3 py-1 rounded-full border ${
                    delivery === "kenya"
                      ? "bg-[color:var(--champagne-gold)] text-white"
                      : ""
                  }`}
                  onClick={() => setDelivery("kenya")}
                >
                  Rest of Kenya (courier)
                </button>
              </div>
              <div className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
                {estimate}
              </div>
            </div>
            <Link
              href="/checkout"
              className="mt-4 block rounded-full px-4 py-2 bg-[color:var(--champagne-gold)] text-white text-center min-h-[48px]"
            >
              Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
