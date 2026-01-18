"use client";
import { products } from "../lib/products";
import { ProductCard } from "../components/product-card";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const featured = products.slice(0, 12);
  return (
    <div className="mx-auto max-w-7xl px-6">
      <HeroSlider />

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

function HeroSlider() {
  const noise =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>";
  const imageUrl =
    "https://images.pexels.com/photos/3764019/pexels-photo-3764019.jpeg?auto=compress&cs=tinysrgb&w=1200";
  const blur =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><rect width='100%' height='100%' fill='%23f7e9e4'/></svg>";

  return (
    <section className="relative mt-8 min-h-[100svh] px-4 md:px-6" aria-label="NEEMON luxury hero">
      <div className="absolute inset-0 pointer-events-none -z-10">
        <SlideBackground />
      </div>

      <div className="relative mx-auto max-w-7xl rounded-[32px] overflow-hidden bg-white/80 dark:bg-black/60 backdrop-blur-sm ring-1 ring-black/5 dark:ring-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.08)] animate-[fadeCard_600ms_ease-out_both]">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-multiply"
          style={{ backgroundImage: `url(${noise})`, backgroundSize: "200px" }}
        />

        <div className="grid md:grid-cols-2">
          <div className="px-6 md:px-10 py-10 lg:py-14 flex items-center">
            <div className="max-w-xl">
              <h1 className="font-serif text-5xl md:text-6xl leading-tight tracking-[0.01em]">
                <span className="block">Where Beauty</span>
                <span className="block">Meets Confidence</span>
              </h1>
              <p className="mt-4 text-sm md:text-base opacity-90">
                Discover skincare, makeup, hair and fragrance curated for every shade, every style,
                and every moment. NEEMON is not just beauty — it’s how you show up to the world.
              </p>
              <div className="mt-8 flex items-center gap-4">
                <Link
                  href="/launch"
                  className="rounded-2xl px-6 py-3 text-sm font-medium bg-[color:var(--champagne-gold)] text-[color:var(--charcoal-black)] shadow-[0_8px_24px_rgba(214,191,164,0.45)] hover:shadow-[0_12px_32px_rgba(214,191,164,0.55)] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--champagne-gold)] focus-visible:ring-offset-2"
                >
                  Launching Soon — Join Us
                </Link>
                <Link
                  href="https://wa.me/254708065140"
                  target="_blank"
                  rel="noopener"
                  className="text-sm underline opacity-90 hover:opacity-100"
                >
                  Chat with us on WhatsApp
                </Link>
              </div>
            </div>
          </div>
          <div className="relative h-[46vh] md:h-auto min-h-[46vh]">
            <Image
              src={imageUrl}
              alt="Editorial beauty — soft cinematic portrait"
              fill
              priority
              quality={55}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
              placeholder="blur"
              blurDataURL={blur}
              className="object-cover animate-[imageZoom_20s_ease_infinite]"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-[color:var(--charcoal-black)]/45 via-[color:var(--charcoal-black)]/20 to-transparent" />
          </div>
        </div>

        

        <style jsx>{`
          @keyframes gradientShift {
            0% { transform: translate3d(-2%, -2%, 0) scale(1.02); }
            50% { transform: translate3d(2%, 2%, 0) scale(1.04); }
            100% { transform: translate3d(-2%, -2%, 0) scale(1.02); }
          }
          @keyframes fadeUp {
            0% { opacity: 0; transform: translate3d(0, 12px, 0); }
            100% { opacity: 1; transform: translate3d(0, 0, 0); }
          }
          @keyframes imageZoom {
            0% { transform: scale(1.05) translate3d(0,0,0); }
            50% { transform: scale(1.08) translate3d(0,0,0); }
            100% { transform: scale(1.05) translate3d(0,0,0); }
          }
          @keyframes fadeCard {
            0% { opacity: 0; transform: translate3d(0, 8px, 0); }
            100% { opacity: 1; transform: translate3d(0, 0, 0); }
          }
        `}</style>
      </div>
    </section>
  );
}

function SlideBackground() {
  return (
    <div className="w-full h-full relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--nude-blush)] via-[color:var(--ivory-white)] to-[color:var(--ivory-white)] animate-[gradientShift_14s_ease_infinite] opacity-80" />
    </div>
  );
}
