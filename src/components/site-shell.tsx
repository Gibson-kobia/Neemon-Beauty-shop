"use client";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { CartProvider, useCart } from "./cart/cart-provider";
import { AuthProvider, useAuth } from "./auth/auth-provider";
import { CartDrawer } from "./cart/cart-drawer";
import { products } from "../lib/products";

import { SearchInput } from "./search-input";

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
            className="text-center px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg_white/10"
          >
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 backdrop-blur bg-white/85 dark:bg-black/70">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between gap-6">
          <Link href="/" className="group flex-shrink-0">
            <span className="font-serif text-2xl tracking-[0.04em]">NEEMON</span>
            <span className="hidden lg:inline ml-2 text-sm text-zinc-500 group-hover:text-zinc-700 dark:text-zinc-400">
              BEAUTY SHOP & COSMETICS
            </span>
          </Link>
          
          <SearchInput className="hidden md:block flex-1 max-w-md mx-4" />
          
          <nav className="flex items-center gap-4 sm:gap-6 text-sm">
            <Link href="/" className="hidden sm:block transition-opacity duration-200 hover:opacity-80">
              Home
            </Link>
            <Link href="/about" className="hidden sm:block transition-opacity duration-200 hover:opacity-80">
              About
            </Link>
            {user ? (
              <>
                <Link href="/account" className="transition-opacity duration-200 hover:opacity-80">
                  Account
                </Link>
                <button
                  onClick={logout}
                  className="rounded-full px-3 py-2 border border-black/10 dark:border-white/10 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="rounded-full px-3 py-2 border border-black/10 dark:border-white/10 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="rounded-full px-3 py-2 bg-[color:var(--champagne-gold)] text-white hover:opacity-90"
                >
                  Sign up
                </Link>
              </>
            )}
            <CartButton />
            <button
              className="rounded-full px-3 py-2 border border-black/10 dark:border-white/10 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
              onClick={() => {
                const html = document.documentElement;
                const next =
                  html.getAttribute("data-theme") === "dark" ? "light" : "dark";
                html.setAttribute("data-theme", next);
                localStorage.setItem("theme", next);
              }}
            >
              Toggle
            </button>
          </nav>
        </div>
        <div className="md:hidden px-6 pb-4">
          <SearchInput />
        </div>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[color:var(--champagne-gold)] to-transparent opacity-60" />
      </header>
      <main className="flex-1">{children}</main>
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
