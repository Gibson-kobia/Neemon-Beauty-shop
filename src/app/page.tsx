import { products } from "../lib/products";
import { ProductCard } from "../components/product-card";
import Link from "next/link";

export default function Home() {
  const featured = products.slice(0, 12);
  return (
    <div className="mx-auto max-w-7xl px-6">
      <section className="relative overflow-hidden rounded-3xl mt-8">
        <div className="absolute inset-0 bg-gradient-to-tr from-[color:var(--nude-blush)] via-[color:var(--champagne-gold)] to-[color:var(--ivory-white)]" />
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "radial-gradient(1px 1px at 10% 20%, rgba(0,0,0,0.6), transparent 1px), radial-gradient(1px 1px at 80% 70%, rgba(0,0,0,0.6), transparent 1px)" }} />
        <div className="relative grid md:grid-cols-2">
          <div className="p-10 md:p-16">
            <div className="font-serif text-4xl md:text-5xl leading-tight tracking-[0.02em]">
              Elevate Your Glow
            </div>
            <p className="mt-4 text-zinc-700 dark:text-zinc-300">
              Authentic brands. Inclusive glam. Nairobi same‑day delivery.
            </p>
            <div className="mt-8 flex gap-3 sm:gap-4 flex-col sm:flex-row">
              <Link
                href="/category/makeup"
                aria-label="Shop New Arrivals"
                className="inline-flex items-center justify-center rounded-xl px-6 py-3 sm:px-7 sm:py-3.5 min-h-12 bg-[color:var(--champagne-gold)] text-white text-sm sm:text-base tracking-[0.02em] transition-all hover:opacity-90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--champagne-gold)] focus-visible:ring-offset-2"
              >
                Shop New Arrivals
              </Link>
              <Link
                href="/shade-quiz"
                aria-label="Find Your Shade"
                className="inline-flex items-center justify-center rounded-xl px-6 py-3 sm:px-7 sm:py-3.5 min-h-12 border border-black/10 dark:border-white/10 text-sm sm:text-base tracking-[0.02em] transition-all hover:bg-black/5 dark:hover:bg-white/10 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--champagne-gold)] focus-visible:ring-offset-2"
              >
                Find Your Shade
              </Link>
            </div>
          </div>
          <div className="p-10 md:p-16">
            <div className="h-full w-full rounded-2xl bg-[color:var(--nude-blush)]/60 dark:bg-black/40"></div>
          </div>
        </div>
      </section>

      <section className="mt-6">
        <div className="rounded-full px-4 py-2 text-xs grid grid-cols-3 gap-2 text-center border bg-white dark:bg-black">
          <div className="opacity-80">Authentic Products</div>
          <div className="opacity-80">Fast Delivery</div>
          <div className="opacity-80">Secure Payment</div>
        </div>
      </section>

      <section className="mt-12">
        <div className="font-serif text-2xl mb-6">Shop by Category</div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[
            { slug: "makeup", title: "Makeup" },
            { slug: "skincare", title: "Skincare" },
            { slug: "hair", title: "Hair Products" },
            { slug: "perfumes", title: "Perfumes" },
            { slug: "tools", title: "Beauty Tools" },
          ].map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="rounded-xl border p-6 bg-white dark:bg-black hover:opacity-90 text-center"
            >
              {c.title}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <div className="font-serif text-2xl mb-6">Featured Products</div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="mt-12 grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border p-6 bg-white dark:bg-black">
          <div className="font-serif text-xl">AI Beauty Experience</div>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Get recommendations based on your skin tone and preferences.
          </p>
          <Link
            href="/shade-quiz"
            aria-label="Try the shade quiz"
            className="mt-4 inline-flex items-center justify-center rounded-xl px-4 py-3 min-h-12 border text-sm tracking-[0.02em] transition-all hover:bg-black/5 dark:hover:bg-white/10 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--champagne-gold)] focus-visible:ring-offset-2"
          >
            Try the shade quiz
          </Link>
        </div>
        <div className="rounded-xl border p-6 bg-white dark:bg-black"></div>
      </section>

      <section className="mt-12 rounded-xl border p-6 bg-white dark:bg-black">
        <div className="font-serif text-2xl">Delivery & Payments</div>
        <div className="mt-4 grid sm:grid-cols-3 gap-6 text-sm">
          <div>
            <div className="font-medium">Bodaboda (Nairobi)</div>
            <div className="text-zinc-600 dark:text-zinc-400">Same‑day</div>
          </div>
          <div>
            <div className="font-medium">Courier (Kenya)</div>
            <div className="text-zinc-600 dark:text-zinc-400">1‑3 days</div>
          </div>
          <div>
            <div className="font-medium">M‑Pesa + Cards</div>
            <div className="text-zinc-600 dark:text-zinc-400">Secure payment</div>
          </div>
        </div>
      </section>
    </div>
  );
}
