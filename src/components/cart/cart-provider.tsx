"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = { productId: string; qty: number };

type CartContextValue = {
  items: CartItem[];
  count: number;
  addItem: (productId: string, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function parseCart(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const normalized: CartItem[] = [];
    for (const entry of parsed) {
      if (!entry || typeof entry !== "object") continue;
      const productId = (entry as { productId?: unknown }).productId;
      const qty = (entry as { qty?: unknown }).qty;
      if (typeof productId !== "string") continue;
      const n = typeof qty === "number" ? qty : Number(qty);
      if (!Number.isFinite(n) || n <= 0) continue;
      const existing = normalized.find((i) => i.productId === productId);
      if (existing) {
        existing.qty += Math.floor(n);
      } else {
        normalized.push({ productId, qty: Math.floor(n) });
      }
    }
    return normalized;
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    return parseCart(localStorage.getItem("cart"));
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== "cart") return;
      setItems(parseCart(e.newValue));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, i) => sum + i.qty, 0);

    const addItem = (productId: string, qty = 1) => {
      const addQty = Math.max(1, Math.floor(qty));
      setItems((prev) => {
        const idx = prev.findIndex((p) => p.productId === productId);
        if (idx >= 0) {
          const next = prev.slice();
          next[idx] = { ...next[idx], qty: next[idx].qty + addQty };
          return next;
        }
        return [...prev, { productId, qty: addQty }];
      });
    };

    const setQty = (productId: string, qty: number) => {
      const nextQty = Math.floor(qty);
      setItems((prev) => {
        if (nextQty <= 0) return prev.filter((p) => p.productId !== productId);
        const idx = prev.findIndex((p) => p.productId === productId);
        if (idx < 0) return prev;
        const next = prev.slice();
        next[idx] = { ...next[idx], qty: nextQty };
        return next;
      });
    };

    const removeItem = (productId: string) => {
      setItems((prev) => prev.filter((p) => p.productId !== productId));
    };

    const clear = () => setItems([]);

    const openDrawer = () => setIsDrawerOpen(true);
    const closeDrawer = () => setIsDrawerOpen(false);

    return {
      items,
      count,
      addItem,
      setQty,
      removeItem,
      clear,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
    };
  }, [items, isDrawerOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
