"use client";
import { useEffect, useRef, useState } from "react";
import { products } from "../lib/products";
import { ProductCard } from "../components/product-card";
import Link from "next/link";

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
  const [index, setIndex] = useState(0);
  const timerRef = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef<number>(0);
  const mountedRef = useRef(false);

  const go = (to: number) => {
    setIndex(((to % 3) + 3) % 3);
    if (mountedRef.current) {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = window.setInterval(() => {
        setIndex((i) => (i + 1) % 3);
      }, 7000);
    }
  };
  const next = () => go(index + 1);
  const prev = () => go(index - 1);

  useEffect(() => {
    const start = () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = window.setInterval(() => {
        setIndex((i) => (i + 1) % 3);
      }, 7000);
    };
    start();
    mountedRef.current = true;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setIndex((i) => ((i - 1 + 3) % 3));
        if (timerRef.current) {
          window.clearInterval(timerRef.current);
          timerRef.current = window.setInterval(() => {
            setIndex((i) => (i + 1) % 3);
          }, 7000);
        }
      }
      if (e.key === "ArrowRight") {
        setIndex((i) => ((i + 1) % 3));
        if (timerRef.current) {
          window.clearInterval(timerRef.current);
          timerRef.current = window.setInterval(() => {
            setIndex((i) => (i + 1) % 3);
          }, 7000);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current !== null) {
      touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
    }
  };
  const onTouchEnd = () => {
    const threshold = 40;
    if (touchDeltaX.current > threshold) {
      prev();
    } else if (touchDeltaX.current < -threshold) {
      next();
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
  };

  return (
    <section
      className="relative overflow-hidden rounded-3xl mt-8 min-h-[100svh]"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
      aria-label="NEEMON luxury brand slider"
    >
      <div className="absolute inset-0 pointer-events-none z-0">
        <SlideBackground idx={index} />
      </div>
      <div className="relative h-full z-10">
        <div className="absolute inset-0">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-700 ease-out z-10 ${
                index === i ? "opacity-100" : "opacity-0"
              }`}
            >
              <div
                className={`flex items-center justify-center px-6 md:px-12 h-full transition-transform duration-[800ms] ${
                  index === i ? "scale-100" : "scale-[1.03]"
                }`}
              >
                <div className="text-center max-w-3xl relative">
                  <div aria-hidden className="pointer-events-none absolute -top-24 -left-24 w-64 h-64 rounded-full bg-[color:var(--champagne-gold)]/20 blur-3xl" />
                  <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-[color:var(--nude-blush)]/20 blur-3xl" />
                  {i === 0 && (
                    <>
                      <div className="font-serif text-5xl md:text-6xl tracking-[0.02em] bg-gradient-to-r from-[color:var(--champagne-gold)] to-[color:var(--ivory-white)] bg-clip-text text-transparent animate-[textSheen_2200ms_ease-in-out_infinite]">NEEMON</div>
                      <div className="mt-3 text-lg md:text-xl opacity-95">Luxury Beauty. Signature Experience.</div>
                      <div className="mt-8 flex gap-3 justify-center">
                        <Link href="/" className="rounded-xl px-6 py-3 bg-[color:var(--champagne-gold)] text-white">
                          Enter NEEMON World
                        </Link>
                        <Link href="https://wa.me/254708065140" target="_blank" rel="noopener" className="rounded-xl px-6 py-3 border">
                          WhatsApp VIP
                        </Link>
                      </div>
                    </>
                  )}
                  {i === 1 && (
                    <>
                      <div className="font-serif text-4xl md:text-5xl tracking-[0.02em] animate-[fadeUp_800ms_ease-out_both]">Coming Soon ✨</div>
                      <div className="mt-3 text-lg md:text-xl">Premium Beauty. Delivered to Your Door.</div>
                      <div className="mt-2 text-sm md:text-base text-zinc-700 dark:text-zinc-300">
                        Skincare • Makeup • Hair • Fragrance • Tools
                      </div>
                      <div className="mt-8 flex gap-3 justify-center">
                        <Link href="/launch" className="rounded-xl px-6 py-3 border">
                          Get Launch Alerts
                        </Link>
                        <Link href="https://wa.me/254708065140" target="_blank" rel="noopener" className="rounded-xl px-6 py-3 border">
                          WhatsApp VIP
                        </Link>
                      </div>
                    </>
                  )}
                  {i === 2 && (
                    <>
                      <div className="font-serif text-4xl md:text-5xl tracking-[0.02em] bg-gradient-to-r from-[color:var(--champagne-gold)] to-[color:var(--ivory-white)] bg-clip-text text-transparent">Every Shade. Every Story. Every You.</div>
                      <div className="mt-3 text-lg md:text-xl text-white">Inclusive luxury crafted for confidence.</div>
                      <div className="mt-2 text-sm md:text-base text-white/80">Where Kenyan beauty meets modern luxury.</div>
                      <div className="mt-8">
                        <Link href="/about" className="rounded-xl px-6 py-3 border border-white text-white">
                          Explore the NEEMON Experience
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          aria-label="Previous slide"
          onClick={prev}
          className="hidden md:inline-flex absolute left-4 top-1/2 -translate-y-1/2 rounded-full w-10 h-10 border bg-white/60 dark:bg-black/50 backdrop-blur text-center"
        >
          ‹
        </button>
        <button
          aria-label="Next slide"
          onClick={next}
          className="hidden md:inline-flex absolute right-4 top-1/2 -translate-y-1/2 rounded-full w-10 h-10 border bg-white/60 dark:bg-black/50 backdrop-blur text-center"
        >
          ›
        </button>

        <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => go(i)}
              className={`w-2.5 h-2.5 rounded-full ${index === i ? "bg-[color:var(--champagne-gold)]" : "bg-black/20 dark:bg-white/20"}`}
            />
          ))}
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
        @keyframes textSheen {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </section>
  );
}

function SlideBackground({ idx }: { idx: number }) {
  return (
    <>
      {idx === 0 && (
        <div className="w-full h-full relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-[color:var(--nude-blush)] via-[color:var(--champagne-gold)] to-[color:var(--ivory-white)] animate-[gradientShift_12s_ease_infinite]" />
          <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(1px 1px at 10% 20%, rgba(0,0,0,0.6), transparent 1px), radial-gradient(1px 1px at 80% 70%, rgba(0,0,0,0.6), transparent 1px)" }} />
        </div>
      )}
      {idx === 1 && (
        <div className="w-full h-full relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--nude-blush)] via-[color:var(--champagne-gold)] to-[color:var(--ivory-white)] animate-[gradientShift_12s_ease_infinite] opacity-90" />
          <div aria-hidden className="absolute -top-24 -left-24 w-[520px] h-[520px] rounded-full bg-[color:var(--champagne-gold)]/20 blur-3xl animate-[gradientShift_16s_linear_infinite]" />
          <div aria-hidden className="absolute -bottom-20 -right-16 w-[460px] h-[460px] rounded-full bg-[color:var(--nude-blush)]/25 blur-3xl animate-[gradientShift_18s_linear_infinite]" />
        </div>
      )}
      {idx === 2 && (
        <div className="w-full h-full relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--charcoal-black)] via-black to-[color:var(--deep-plum)]" />
          <div aria-hidden className="absolute -top-32 -left-16 w-[560px] h-[560px] rounded-full bg-[color:var(--champagne-gold)]/12 blur-3xl animate-[gradientShift_14s_linear_infinite]" />
          <div aria-hidden className="absolute -bottom-24 -right-24 w-[520px] h-[520px] rounded-full bg-[color:var(--champagne-gold)]/10 blur-3xl animate-[gradientShift_20s_linear_infinite]" />
        </div>
      )}
    </>
  );
}
