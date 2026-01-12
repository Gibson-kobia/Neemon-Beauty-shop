"use client";
import { useState } from "react";
import { useAuth } from "./auth/auth-provider";

export function ReviewButton({ productId }: { productId: string }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [text, setText] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setStatus(null);
    if (!user) {
      window.location.href = "/auth/login";
      return;
    }
    if (rating < 1 || rating > 5 || !text.trim()) {
      setStatus("Please provide a rating and review text.");
      return;
    }
    setLoading(true);
    const raw = localStorage.getItem("neemonReviews");
    const all = raw ? JSON.parse(raw) : [];
    const review = {
      id: crypto.randomUUID(),
      userId: user.id,
      productId,
      rating,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };
    const next = [...all, review];
    localStorage.setItem("neemonReviews", JSON.stringify(next));
    setLoading(false);
    setStatus("Thank you for your review.");
    setText("");
    setRating(5);
    setTimeout(() => setOpen(false), 800);
  };

  if (!user) {
    return (
      <a
        href="/auth/login"
        className="inline-block rounded-full px-4 py-2 border text-sm"
      >
        Log in to review
      </a>
    );
  }

  return (
    <div className="inline-block">
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-full px-4 py-2 border text-sm"
      >
        {open ? "Close review" : "Review Product"}
      </button>
      {open && (
        <div className="mt-3 rounded-xl border border-black/10 dark:border-white/10 p-4 bg-white dark:bg-black w-[min(100%,420px)]">
          <div className="text-sm font-medium mb-2">Your review</div>
          <div className="flex items-center gap-3 mb-3">
            <label className="text-sm">Rating</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="rounded-lg border px-3 py-2 bg-transparent"
            >
              {[1, 2, 3, 4, 5].map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder="Share your experience with this product"
            className="w-full rounded-lg border px-3 py-2 bg-transparent text-sm"
          />
          {status && (
            <div className="mt-2 text-xs text-emerald-600">{status}</div>
          )}
          <div className="mt-3 flex gap-2">
            <button
              onClick={submit}
              disabled={loading}
              className="rounded-full px-4 py-2 bg-[color:var(--champagne-gold)] text-white text-sm disabled:opacity-70"
            >
              {loading ? "Submitting..." : "Submit review"}
            </button>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full px-4 py-2 border text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
