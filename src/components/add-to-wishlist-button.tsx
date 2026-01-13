"use client";

import { useEffect, useState } from "react";

export function AddToWishlistButton({
  productId,
  className,
}: {
  productId: string;
  className?: string;
}) {
  const [added, setAdded] = useState<boolean>(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem("wishlist") : null;
    if (!raw) return false;
    try {
      const ids = JSON.parse(raw) as string[];
      return ids.includes(productId);
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "wishlist" && e.newValue) {
        const ids = JSON.parse(e.newValue) as string[];
        setAdded(ids.includes(productId));
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [productId]);

  const toggle = () => {
    const raw = localStorage.getItem("wishlist");
    const ids = raw ? (JSON.parse(raw) as string[]) : [];
    let next: string[];

    if (ids.includes(productId)) {
      next = ids.filter((id) => id !== productId);
    } else {
      next = [...ids, productId];
    }

    localStorage.setItem("wishlist", JSON.stringify(next));
    setAdded(!added);
    // Dispatch event for same-window updates
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "wishlist",
        newValue: JSON.stringify(next),
      })
    );
  };

  return (
    <button
      className={className || "text-sm underline"}
      onClick={toggle}
    >
      {added ? "Remove from wishlist" : "Add to wishlist"}
    </button>
  );
}
