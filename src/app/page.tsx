import { products } from "../lib/products";
import { ProductCard } from "../components/product-card";
import Link from "next/link";

export default function Home() {
  const featured = products.slice(0, 12);
  return (
    <div className="mx-auto max-w-7xl px-6">
      <section className="relative overflow-hidden rounded-3xl mt-8 bg-[color:var(--ivory-white)] dark:bg-charcoal">
        <div className="grid md:grid-cols-2">
          <div className="p-10 md:p-16">
            <div className="font-serif text-4xl md:text-5xl leading-tight">
              Luxury Beauty, For Every Shade
            </div>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              Authentic brands. Inclusive glams. Nairobi same‑day delivery.
            </p>
            <div className="mt-8 flex gap-4">
              <Link
                href="/category/makeup"
                className="rounded-full px-6 py-3 bg-[color:var(--champagne-gold)] text-white"
              >
                Shop Beauty
              </Link>
              <Link
                href="/shade-quiz"
                className="rounded-full px-6 py-3 border border-black/10 dark:border-white/10"
              >
                Find Your Shade
              </Link>
            </div>
          </div>
          <div className="p-10 md:p-16">
            <div className="h-full w-full rounded-2xl bg-[color:var(--nude-blush)] dark:bg-black/50"></div>
          </div>
        </div>
      </section>

      <section className="mt-12 grid sm:grid-cols-3 gap-6">
        <div className="rounded-xl p-5 border bg-white dark:bg-black">
          <div className="font-medium">Authentic products</div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            Trusted beauty brands sold in Kenya
          </div>
        </div>
        <div className="rounded-xl p-5 border bg-white dark:bg-black">
          <div className="font-medium">Secure M‑Pesa payments</div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            Pay securely with M‑Pesa and cards
          </div>
        </div>
        <div className="rounded-xl p-5 border bg-white dark:bg-black">
          <div className="font-medium">Fast delivery</div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            Nairobi same‑day, nationwide courier
          </div>
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
            className="mt-4 inline-block rounded-full px-4 py-2 border"
          >
            Try the shade quiz
          </Link>
        </div>
        <div className="rounded-xl border p-6 bg-white dark:bg-black">
          <div className="font-serif text-xl">Customer Reviews</div>
          <div className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            “Top‑tier service, authentic products.” — Wanjiru, Nairobi
          </div>
          <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            “Same‑day delivery saved my event.” — Amina, Kileleshwa
          </div>
        </div>
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
