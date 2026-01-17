"use client";
import { useState } from "react";
import Link from "next/link";

export function LaunchCard() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const notify = () => {
    const v = email.trim();
    if (!v || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) {
      setStatus("Please enter a valid email.");
      return;
    }
    try {
      const raw = localStorage.getItem("neemonNotifyEmails");
      const all = raw ? (JSON.parse(raw) as string[]) : [];
      const next = Array.from(new Set([...all, v]));
      localStorage.setItem("neemonNotifyEmails", JSON.stringify(next));
      setStatus("You're on the list. We'll notify you at launch.");
      setEmail("");
    } catch {
      setStatus("Saved locally.");
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="relative rounded-3xl border bg-white dark:bg-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--nude-blush)] via-[color:var(--champagne-gold)] to-[color:var(--ivory-white)] opacity-25" />
        <div
          aria-hidden
          className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-[color:var(--champagne-gold)]/20 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-[color:var(--nude-blush)]/20 blur-3xl"
        />
        <div className="relative p-8 md:p-12 text-center">
          <div className="font-serif text-2xl md:text-3xl">
            NEEMON Beauty is Almost Here
          </div>
          <div className="mt-3 text-sm md:text-base text-zinc-700 dark:text-zinc-300">
            We’re curating Kenya’s best beauty brands — makeup, skincare, hair & fragrance — for a luxury shopping experience like no other.
          </div>
          <div className="mt-6 grid sm:grid-cols-2 gap-2 text-sm text-zinc-700 dark:text-zinc-300">
            <div className="flex items-center gap-2 justify-center">
              <span>✔</span> <span>Authentic brands only</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <span>✔</span> <span>Same-day Nairobi delivery</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <span>✔</span> <span>M-Pesa & Card payments</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <span>✔</span> <span>Influencer-level glam experience</span>
            </div>
          </div>
          <div className="mt-8 grid sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 flex gap-2">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 rounded-xl border px-4 py-2 bg-transparent"
              />
              <button
                onClick={notify}
                className="rounded-xl px-4 py-2 bg-[color:var(--champagne-gold)] text-white"
              >
                Notify Me
              </button>
            </div>
            <a
              href="https://wa.me/254708065140?text=Hi%20NEEMON%20Beauty,%20I%20want%20to%20be%20notified%20when%20shopping%20goes%20live."
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl px-4 py-2 border text-sm text-center"
            >
              WhatsApp
            </a>
          </div>
          {status && (
            <div className="mt-2 text-xs text-emerald-600">{status}</div>
          )}
          <div className="mt-6">
            <Link href="/" className="rounded-full px-4 py-2 border text-sm">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
