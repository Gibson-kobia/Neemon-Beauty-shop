"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CartProvider, useCart } from "./cart/cart-provider";
import { AuthProvider, useAuth } from "./auth/auth-provider";
import { CartDrawer } from "./cart/cart-drawer";
import { products } from "../lib/products";

import { useRouter } from "next/navigation";

export function SiteShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored) {
      document.documentElement.setAttribute("data-theme", stored);
    }
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <Shell>{children}</Shell>
        <CartDrawer />
      </CartProvider>
    </AuthProvider>
  );
}

function CartButton() {
  const { count, openDrawer, items } = useCart();
  const lines = items
    .map((i) => ({ ...i, product: products.find((p) => p.id === i.productId) }))
    .filter((l) => l.product)
    .slice(0, 3);
  const subtotal = lines.reduce(
    (sum, l) => sum + (l.product?.priceKes || 0) * l.qty,
    0
  );
  const blur = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><rect width='100%' height='100%' fill='%23f5e7c6'/></svg>";
  return (
    <div className="relative">
      <button
        onClick={openDrawer}
        className="relative rounded-full px-3 py-2 border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10"
      >
        <span className="inline-flex items-center gap-2">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 9h14l-1.2 11H8.2L7 9Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path
              d="M9 9V7a3 3 0 0 1 6 0v2"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          <span className="hidden sm:inline">Cart</span>
        </span>
        {count > 0 && (
          <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full bg-[color:var(--champagne-gold)] text-white text-xs grid place-items-center">
            {count}
          </span>
        )}
      </button>
      <div className="absolute right-0 mt-2 w-[320px] rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-black shadow-lg overflow-hidden hidden md:block">
        <div className="p-3">
          {lines.length === 0 ? (
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              Your cart is empty.
            </div>
          ) : (
            <div className="space-y-3">
              {lines.map((l) => (
                <div key={l.product!.id} className="flex items-center gap-3">
                  <div className="relative w-10 h-12 rounded-md overflow-hidden">
                    <Image
                      src={
                        l.product!.image && l.product!.image.startsWith("http")
                          ? l.product!.image
                          : "/product-placeholder.png"
                      }
                      alt={l.product!.name}
                      fill
                      sizes="40px"
                      placeholder="blur"
                      blurDataURL={blur}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-zinc-500">
                      {l.product!.brand}
                    </div>
                    <div className="text-sm leading-5">
                      {l.product!.name}
                    </div>
                  </div>
                  <div className="text-xs">
                    × {l.qty}
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between text-sm pt-2 border-t border-black/10 dark:border-white/10">
                <div className="text-zinc-600 dark:text-zinc-400">Subtotal</div>
                <div className="font-semibold">
                  KES {subtotal.toLocaleString()}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2">
          <Link
            href="/cart"
            className="text-center px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10"
          >
            View cart
          </Link>
          <Link
            href="/checkout"
            className="text-center px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/10"
          >
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const [isDark, setIsDark] = useState(() => {
    if (typeof document === "undefined") return false;
    const attr = document.documentElement.getAttribute("data-theme");
    const stored = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    const current = stored || attr || "light";
    return current === "dark";
  });
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState<null | "shop" | "categories">(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const trending = ["lipstick", "niacinamide", "wig cap", "yara", "eco gel"];
  useEffect(() => {
    const onScroll = () => {
      setSolid(window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(null);
        setSearchOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className={`${solid ? "bg-white/95 dark:bg-black/85 shadow-lg" : "bg-transparent"} sticky top-0 z-40 backdrop-blur transition-colors`}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center justify-between h-9 text-xs">
            <div className="opacity-80">✨ Free Nairobi delivery on orders over KES 3,000</div>
            <div className="flex items-center gap-3">
              <button className="w-6 h-6 rounded-full grid place-items-center bg-white/50 dark:bg-black/40">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Z"/><path d="M16 11.37a4 4 0 1 1-7.87 1.16 4 4 0 0 1 7.87-1.16Z"/><path d="M17.5 6.5h.01"/></svg>
              </button>
              <a href="https://wa.me/254700000000" className="w-6 h-6 rounded-full grid place-items-center bg-white/50 dark:bg-black/40">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M15.05 14.45c-.2.1-1.15.55-1.33.6-.18.07-.32.1-.45-.1-.13-.2-.52-.6-.64-.73-.12-.13-.23-.15-.43-.05-.2.1-.85.42-1.62 1.34-.6.73-.99 1.62-1.1 1.82-.1.2-.22.18-.42.1-.2-.1-1.1-.4-1.85-.86-.76-.47-1.37-1.03-1.97-1.78-.6-.76-1.06-1.58-1.35-2.48-.28-.9-.4-1.77-.4-2.6 0-2.4 1.05-4.6 2.87-6.1a8.66 8.66 0 0 1 5.47-2.01c2.38 0 4.65.92 6.34 2.57a8.66 8.66 0 0 1 2.52 6.17c0 2.33-.91 4.52-2.56 6.17A8.66 8.66 0 0 1 12 21.33c-.81 0-1.61-.12-2.38-.35l-3.59 1.16 1.18-3.5A9.13 9.13 0 0 1 3 12.03c0-2.54.99-4.92 2.77-6.7A9.46 9.46 0 0 1 12 2.87c2.52 0 4.9.98 6.68 2.76a9.46 9.46 0 0 1 2.76 6.68c0 2.52-.98 4.89-2.76 6.67A9.46 9.46 0 0 1 12 21.73"/></svg>
              </a>
              <button
                aria-label="Toggle theme"
                className="w-6 h-6 rounded-full grid place-items-center bg-white/50 dark:bg-black/40"
                onClick={() => {
                  const html = document.documentElement;
                  const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
                  html.setAttribute("data-theme", next);
                  localStorage.setItem("theme", next);
                  setIsDark(next === "dark");
                }}
              >
                {isDark ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/></svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                )}
              </button>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-6 py-3 md:py-4 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10" />
            <Link href="/" className="group">
              <span className="font-serif text-2xl tracking-[0.04em]">NEEMON</span>
              <span className="hidden xl:block text-xs text-zinc-500">Beauty Shop & Cosmetics</span>
            </Link>
          </div>
          <div className="hidden lg:flex items-center gap-6 text-sm">
            <Link href="/" className="transition-opacity hover:opacity-80">Home</Link>
            <button
              onMouseEnter={() => setMenuOpen("shop")}
              onFocus={() => setMenuOpen("shop")}
              onClick={() => setMenuOpen(menuOpen === "shop" ? null : "shop")}
              className="inline-flex items-center gap-1 transition-opacity hover:opacity-80"
            >
              Shop
              <span>▾</span>
            </button>
            <button
              onMouseEnter={() => setMenuOpen("categories")}
              onFocus={() => setMenuOpen("categories")}
              onClick={() => setMenuOpen(menuOpen === "categories" ? null : "categories")}
              className="inline-flex items-center gap-1 transition-opacity hover:opacity-80"
            >
              Categories
              <span>▾</span>
            </button>
            <Link href="/shade-quiz" className="transition-opacity hover:opacity-80">Shade Quiz</Link>
            <Link href="/shop" className="transition-opacity hover:opacity-80">Offers</Link>
            <Link href="/about" className="transition-opacity hover:opacity-80">About</Link>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              aria-label="Search"
              className="rounded-xl px-3 py-2 border border-black/10 dark:border-white/10"
              onClick={() => setSearchOpen(true)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </button>
            {user ? (
              <Link href="/account" className="rounded-xl px-3 py-2 border border-black/10 dark:border-white/10">Account</Link>
            ) : (
              <Link href="/auth/login" className="rounded-xl px-3 py-2 border border-black/10 dark:border-white/10">Login</Link>
            )}
            <CartButton />
            <button className="lg:hidden rounded-xl px-3 py-2 border" onClick={() => setMobileOpen(true)}>☰</button>
          </div>
        </div>
        {menuOpen && (
          <div
            onMouseLeave={() => setMenuOpen(null)}
            className="hidden lg:block border-t border-black/10 dark:border-white/10 bg-white/95 dark:bg-black/90 backdrop-blur"
          >
            <div className="mx-auto max-w-7xl px-6 py-6 grid grid-cols-5 gap-6">
              <div>
                <div className="font-serif mb-2">💄 Makeup</div>
                <div className="space-y-1 text-sm">
                  <Link href="/category/makeup" className="block hover:opacity-80">Face</Link>
                  <Link href="/category/makeup" className="block hover:opacity-80">Eyes</Link>
                  <Link href="/category/makeup" className="block hover:opacity-80">Lips</Link>
                  <Link href="/category/makeup" className="block hover:opacity-80">Palettes</Link>
                </div>
              </div>
              <div>
                <div className="font-serif mb-2">🌸 Skincare</div>
                <div className="space-y-1 text-sm">
                  <Link href="/category/skincare" className="block hover:opacity-80">Cleansers</Link>
                  <Link href="/category/skincare" className="block hover:opacity-80">Toners</Link>
                  <Link href="/category/skincare" className="block hover:opacity-80">Serums</Link>
                  <Link href="/category/skincare" className="block hover:opacity-80">Sunscreen</Link>
                </div>
              </div>
              <div>
                <div className="font-serif mb-2">💇 Hair</div>
                <div className="space-y-1 text-sm">
                  <Link href="/category/hair" className="block hover:opacity-80">Wigs</Link>
                  <Link href="/category/hair" className="block hover:opacity-80">Oils</Link>
                  <Link href="/category/hair" className="block hover:opacity-80">Relaxers</Link>
                  <Link href="/category/hair" className="block hover:opacity-80">Shampoos</Link>
                </div>
              </div>
              <div>
                <div className="font-serif mb-2">🌺 Perfumes</div>
                <div className="space-y-1 text-sm">
                  <Link href="/category/perfumes" className="block hover:opacity-80">Women</Link>
                  <Link href="/category/perfumes" className="block hover:opacity-80">Men</Link>
                  <Link href="/category/perfumes" className="block hover:opacity-80">Unisex</Link>
                </div>
              </div>
              <div>
                <div className="font-serif mb-2">🧰 Beauty Tools</div>
                <div className="space-y-1 text-sm">
                  <Link href="/category/tools" className="block hover:opacity-80">Brushes</Link>
                  <Link href="/category/tools" className="block hover:opacity-80">Lashes</Link>
                  <Link href="/category/tools" className="block hover:opacity-80">Curlers</Link>
                  <Link href="/category/tools" className="block hover:opacity-80">Mirrors</Link>
                </div>
              </div>
            </div>
            <div className="mx-auto max-w-7xl px-6 pb-6">
              <div className="rounded-2xl border p-6 bg-white dark:bg-black grid md:grid-cols-5">
                <div className="md:col-start-5 md:col-span-1">
                  <div className="rounded-xl bg-black/5 dark:bg-white/10 aspect-[3/4]" />
                  <div className="mt-3 text-sm">Featured Brand of the Week</div>
                  <button
                    onClick={() => router.push("/shop")}
                    className="mt-2 rounded-full px-4 py-2 bg-[color:var(--champagne-gold)] text-white text-sm"
                  >
                    Explore Collection
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {searchOpen && (
          <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm">
            <div className="mx-auto max-w-2xl px-6 pt-24">
              <div className="rounded-2xl border p-6 bg-white dark:bg-black">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search makeup, skincare, perfumes…"
                  className="w-full rounded-xl px-4 py-3 border bg-transparent text-lg"
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  {trending.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSearchQuery(t)}
                      className="rounded-full px-3 py-1 text-sm border"
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => {
                      if (searchQuery.trim()) {
                        setSearchOpen(false);
                        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                      }
                    }}
                    className="rounded-full px-4 py-2 bg-[color:var(--champagne-gold)] text-white"
                  >
                    Search
                  </button>
                  <button onClick={() => setSearchOpen(false)} className="rounded-full px-4 py-2 border">Close</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
      <main className="flex-1">{children}</main>
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/85 dark:bg-black/70 backdrop-blur lg:hidden">
        <div className="mx-auto max-w-7xl px-6 py-2 flex items-center justify-between">
          <a href="https://wa.me/254700000000" className="rounded-full px-4 py-2 border text-sm">WhatsApp</a>
          <button onClick={() => setSearchOpen(true)} className="rounded-full px-4 py-2 border text-sm">Search</button>
          <button onClick={() => setMobileOpen(true)} className="rounded-full px-4 py-2 border text-sm">Menu</button>
        </div>
      </div>
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm">
          <div className="absolute left-0 top-0 bottom-0 w-[80%] max-w-[340px] bg-white dark:bg-black p-6 rounded-tr-2xl rounded-br-2xl shadow-xl">
            <div className="flex items-center justify-between">
              <div className="font-serif text-xl">NEEMON</div>
              <button onClick={() => setMobileOpen(false)} className="rounded-full px-3 py-1 border">Close</button>
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <Link href="/" onClick={() => setMobileOpen(false)}>Home</Link>
              <Link href="/shop" onClick={() => setMobileOpen(false)}>Shop</Link>
              <Link href="/category/makeup" onClick={() => setMobileOpen(false)}>Categories</Link>
              <Link href="/shade-quiz" onClick={() => setMobileOpen(false)}>Shade Quiz</Link>
              <Link href="/shop" onClick={() => setMobileOpen(false)}>Offers</Link>
              <Link href="/about" onClick={() => setMobileOpen(false)}>About</Link>
              <Link href="/account" onClick={() => setMobileOpen(false)}>Account</Link>
            </div>
          </div>
        </div>
      )}
      <footer className="border-t border-black/10 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-10 grid gap-6 sm:grid-cols-3">
          <div>
            <div className="font-serif text-xl mb-2">NEEMON</div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Luxury, inclusive beauty for Kenya. Authentic brands, secure
              payments, same‑day Nairobi delivery, nationwide courier.
            </p>
          </div>
          <div className="text-sm">
            <div className="font-medium mb-2">Links</div>
            <div className="flex flex-col gap-1">
              <Link href="/" className="hover:opacity-80">
                Home
              </Link>
              <Link href="/about" className="hover:opacity-80">
                About
              </Link>
              <Link href="/checkout" className="hover:opacity-80">
                Checkout
              </Link>
            </div>
          </div>
          <div className="text-sm">
            <div className="font-medium mb-2">Contact</div>
            <div className="flex flex-col gap-1">
              <span>Nairobi, Kenya</span>
              <a href="mailto:hello@neemon.co.ke" className="hover:opacity-80">
                hello@neemon.co.ke
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
