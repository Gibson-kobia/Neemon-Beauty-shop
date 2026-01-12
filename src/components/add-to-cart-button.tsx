"use client";
import { useEffect, useState } from "react";
import { useCart } from "./cart/cart-provider";

export function AddToCartButton({
  productId,
  className,
}: {
  productId: string;
  className?: string;
}) {
  const { addItem, openDrawer } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const t = window.setTimeout(() => setAdded(false), 1200);
    return () => window.clearTimeout(t);
  }, [added]);

  return (
    <button
      onClick={() => {
        addItem(productId, 1);
        setAdded(true);
        window.setTimeout(() => openDrawer(), 120);
      }}
      className={
        className ||
        "relative rounded-full px-4 py-2 bg-[color:var(--champagne-gold)] text-white hover:opacity-90 transition-transform active:scale-[0.98]"
      }
    >
      <span className={`inline-flex items-center gap-2 transition-opacity ${added ? "opacity-0" : "opacity-100"}`}>
        Add to Cart
      </span>
      <span
        className={`absolute inset-0 grid place-items-center transition-all ${
          added ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <span className="inline-flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-white" />
          Added
        </span>
      </span>
    </button>
  );
}

