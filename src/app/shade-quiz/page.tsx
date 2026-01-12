"use client";
import { useState } from "react";
import Link from "next/link";

export default function ShadeQuizPage() {
  const [tone, setTone] = useState("medium");
  const [undertone, setUndertone] = useState("neutral");

  return (
    <div className="mx-auto max-w-xl px-6 py-10">
      <h1 className="font-serif text-3xl mb-4">Find Your Shade</h1>
      <div className="space-y-4">
        <div>
          <div className="text-sm mb-2">Skin tone</div>
          <select
            className="w-full border rounded px-3 py-2 bg-white dark:bg-black"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          >
            <option value="light">Light</option>
            <option value="medium">Medium</option>
            <option value="tan">Tan</option>
            <option value="deep">Deep</option>
          </select>
        </div>
        <div>
          <div className="text-sm mb-2">Undertone</div>
          <select
            className="w-full border rounded px-3 py-2 bg-white dark:bg-black"
            value={undertone}
            onChange={(e) => setUndertone(e.target.value)}
          >
            <option value="warm">Warm</option>
            <option value="cool">Cool</option>
            <option value="neutral">Neutral</option>
          </select>
        </div>
        <div className="rounded-xl border p-4 bg-white dark:bg-black">
          <div className="text-sm">
            Recommended: medium coverage, oil‑control foundations for Nairobi
            weather. Explore Makeup category and filter by brand.
          </div>
          <Link
            href="/category/makeup"
            className="mt-3 inline-block rounded-full px-4 py-2 border"
          >
            Shop Makeup
          </Link>
        </div>
      </div>
    </div>
  );
}
