"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { products } from "../../lib/products";
import { MapDeliverySelector } from "../../components/map-delivery-selector";
import { useAuth } from "../../components/auth/auth-provider";
import { getSupabase } from "../../lib/supabase";

type CartItem = { productId: string; qty: number };
type DeliveryLocation = {
  latitude: number;
  longitude: number;
  addressLabel?: string;
  deliveryMethod: "bodaboda" | "courier";
};

export default function CheckoutPage() {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>(() => {
    const cartRaw = typeof window !== "undefined" ? localStorage.getItem("cart") : null;
    return cartRaw ? (JSON.parse(cartRaw) as CartItem[]) : [];
  });
  const [addressText, setAddressText] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"bodaboda" | "courier">("bodaboda");
  const [paymentMode, setPaymentMode] = useState<"mpesa" | "delivery">("mpesa");
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [stkSent, setStkSent] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [mapSelected, setMapSelected] = useState<DeliveryLocation | null>(() => {
    const dlRaw = typeof window !== "undefined" ? localStorage.getItem("deliveryLocation") : null;
    if (dlRaw) {
      try {
        return JSON.parse(dlRaw) as DeliveryLocation;
      } catch {}
    }
    return null;
  });
  const [error, setError] = useState<string | null>(null);
  const [placed, setPlaced] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<{ id: string; label: string; addressText: string }[]>([]);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "cart") {
        const parsed = e.newValue ? (JSON.parse(e.newValue) as CartItem[]) : [];
        setCart(parsed);
      }
      if (e.key === "deliveryLocation" && e.newValue) {
        try {
          setMapSelected(JSON.parse(e.newValue) as DeliveryLocation);
        } catch {}
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    if (!user) {
      setSavedAddresses([]);
      return;
    }
    const raw = localStorage.getItem("neemonAddresses");
    const all = raw ? JSON.parse(raw) : [];
    const mine = all.filter((a: any) => a.userId === user.id);
    setSavedAddresses(mine);
  }, [user]);

  const items = useMemo(() => {
    return cart
      .map((c) => {
        const product = products.find((p) => p.id === c.productId);
        return product ? { product, qty: c.qty } : null;
      })
      .filter(Boolean) as { product: (typeof products)[number]; qty: number }[];
  }, [cart]);

  const total = useMemo(() => {
    return items.reduce((sum, i) => sum + i.product.priceKes * i.qty, 0);
  }, [items]);

  const confirmLocation = (loc: DeliveryLocation) => {
    setMapSelected(loc);
    setShowMap(false);
  };

  const placeOrder = async () => {
    setError(null);
    const hasAddress = addressText.trim().length > 0;
    const hasMap = !!mapSelected;
    if (!hasAddress && !hasMap) {
      setError("Add a text address or select a map location.");
      return;
    }

    if (paymentMode === "mpesa") {
      const phone = mpesaPhone.replace(/\D/g, "");
      if (phone.length !== 9) {
        setError("Please enter a valid M-Pesa phone number (e.g. 712345678)");
        return;
      }
      setIsPaying(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStkSent(true);
      // Simulate user entering PIN
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setIsPaying(false);
    }

    const order = {
      id: `ORD-${crypto.randomUUID()}`,
      total,
      status: paymentMode === "mpesa" ? "Paid" : "Processing",
      items: items.map((i) => ({
        productId: i.product.id,
        qty: i.qty,
      })),
      address_text: hasAddress ? addressText.trim() : null,
      delivery_location: hasMap ? mapSelected : null,
      created_at: new Date().toISOString(),
      payment: paymentMode,
      method: deliveryMethod,
      user_id: user ? user.id : null,
      mpesa_phone: paymentMode === "mpesa" ? mpesaPhone : null,
    };
    const { error: insertError } = await getSupabase().from("orders").insert([order]);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    localStorage.setItem("cart", JSON.stringify([]));
    setPlaced(true);
  };

  if (placed) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="font-serif text-3xl">Order placed</div>
        <div className="mt-3 text-zinc-600 dark:text-zinc-400">
          We are processing your order. You can continue shopping.
        </div>
        <Link href="/" className="mt-6 inline-block rounded-full px-5 py-2 bg-[color:var(--champagne-gold)] text-white">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="font-serif text-3xl">Checkout</div>
      <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Secure M‑Pesa and card payments coming soon.
      </div>

      <div className="mt-8 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-xl border border-black/10 dark:border-white/10 p-6 bg-white dark:bg-black">
            <div className="font-medium">Delivery Details</div>
            <div className="mt-4 space-y-3">
              <label className="block text_sm">Text address</label>
              <input
                value={addressText}
                onChange={(e) => setAddressText(e.target.value)}
                placeholder="e.g. Apartment, street, estate, landmarks"
                className="w-full rounded-lg border px-3 py-2 bg-transparent"
              />
              {savedAddresses.length > 0 && (
                <div className="mt-2">
                  <div className="text-xs text-zinc-500 mb-1">Saved addresses</div>
                  <select
                    onChange={(e) => {
                      const id = e.target.value;
                      const found = savedAddresses.find((a) => a.id === id);
                      if (found) setAddressText(found.addressText);
                    }}
                    className="w-full rounded-lg border px-3 py-2 bg-transparent"
                  >
                    <option value="">Select saved address</option>
                    {savedAddresses.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.label} — {a.addressText.slice(0, 40)}
                        {a.addressText.length > 40 ? "…" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="mt-4">
                <div className="text-sm mb-2">Delivery method</div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      checked={deliveryMethod === "bodaboda"}
                      onChange={() => setDeliveryMethod("bodaboda")}
                    />
                    <span>Bodaboda (Nairobi)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      checked={deliveryMethod === "courier"}
                      onChange={() => setDeliveryMethod("courier")}
                    />
                    <span>Courier (Kenya)</span>
                  </label>
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => setShowMap((v) => !v)}
                  className="rounded-full px-4 py-2 bg-[color:var(--champagne-gold)] text-white"
                >
                  Choose delivery location on map
                </button>
                {mapSelected && (
                  <div className="mt-3 text-sm text-emerald-600">
                    Delivery location selected ✔
                    <button
                      onClick={() => setShowMap(true)}
                      className="ml-3 underline"
                    >
                      Change location
                    </button>
                  </div>
                )}
              </div>
              {showMap && (
                <div className="mt-4">
                  <MapDeliverySelector
                    deliveryMethod={deliveryMethod}
                    value={mapSelected}
                    onChange={(loc) => setMapSelected(loc)}
                    onConfirm={confirmLocation}
                  />
                </div>
              )}
              <div className="mt-3 text-xs text-zinc-600 dark:text-zinc-400">
                If you select Bodaboda, a map location is recommended but not required.
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-black/10 dark:border-white/10 p-6 bg-white dark:bg-black">
            <div className="font-medium">Payment Method</div>
            <div className="mt-4 space-y-3">
              <label className="flex items-center gap-3 p-3 border border-black/5 dark:border-white/5 rounded-lg cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMode === "mpesa"}
                  onChange={() => setPaymentMode("mpesa")}
                  className="accent-[color:var(--champagne-gold)]"
                />
                <div className="flex-1">
                  <div className="font-medium">M-Pesa Express</div>
                  <div className="text-xs text-zinc-500">
                    Fast, secure payment to till number
                  </div>
                </div>
                <div className="font-bold text-green-600 text-sm tracking-wide">
                  M-PESA
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 border border-black/5 dark:border-white/5 rounded-lg cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMode === "delivery"}
                  onChange={() => setPaymentMode("delivery")}
                  className="accent-[color:var(--champagne-gold)]"
                />
                <div className="flex-1">
                  <div className="font-medium">Pay on Delivery</div>
                  <div className="text-xs text-zinc-500">
                    Pay via M-Pesa or Cash upon receipt
                  </div>
                </div>
              </label>
            </div>

            {paymentMode === "mpesa" && (
              <div className="mt-4 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg animate-in fade-in slide-in-from-top-2">
                <label className="block text-sm font-medium mb-2">
                  M-Pesa Phone Number
                </label>
                <div className="flex gap-2">
                  <span className="flex items-center px-3 border border-black/10 dark:border-white/10 rounded-lg bg-white dark:bg-black text-zinc-500 text-sm">
                    +254
                  </span>
                  <input
                    value={mpesaPhone}
                    onChange={(e) =>
                      setMpesaPhone(
                        e.target.value.replace(/\D/g, "").slice(0, 9)
                      )
                    }
                    placeholder="712 345 678"
                    className="flex-1 rounded-lg border border-black/10 dark:border-white/10 px-3 py-2 bg-white dark:bg-black focus:outline-none focus:border-[color:var(--champagne-gold)]"
                  />
                </div>
                <div className="mt-2 text-xs text-zinc-500">
                  You will receive an STK push on your phone to complete the
                  payment.
                </div>
              </div>
            )}
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}
          
          <button
            onClick={placeOrder}
            disabled={isPaying}
            className="w-full sm:w-auto rounded-full px-8 py-3 bg-[color:var(--champagne-gold)] text-white font-medium hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
          >
            {isPaying
              ? stkSent
                ? "Check your phone..."
                : "Sending STK Push..."
              : paymentMode === "mpesa"
              ? "Pay Now"
              : "Place Order"}
          </button>
        </div>

        <div className="rounded-xl border border-black/10 dark:border-white/10 p-6 bg-white dark:bg-black">
          <div className="font-medium">Order Summary</div>
          <div className="mt-4 space-y-3">
            {items.length === 0 && (
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                Your cart is empty.
              </div>
            )}
            {items.map((i) => (
              <div key={i.product.id} className="flex items-center justify-between">
                <div className="text-sm">{i.product.name}</div>
                <div className="text-sm">x{i.qty}</div>
                <div className="text-sm">KES {i.product.priceKes.toLocaleString()}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t pt-4 flex items-center justify-between">
            <div className="font-medium">Total</div>
            <div className="font-semibold">KES {total.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
