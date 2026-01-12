"use client";
import { useEffect, useMemo, useState } from "react";
import { products } from "../../lib/products";
import { useAuth } from "../../components/auth/auth-provider";

type User = {
  name: string;
  email: string;
  phone: string;
};

type Order = {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  items: { productId: string; qty: number }[];
};

type Address = {
  id: string;
  userId: string;
  label: string;
  addressText: string;
};

type Review = {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  text: string;
  createdAt: string;
};

export default function AccountPage() {
  const { user, logout } = useAuth();
  const [section, setSection] = useState<"profile" | "addresses" | "orders" | "wishlist" | "reviews">("profile");
  const [orders, setOrders] = useState<Order[]>(() => {
    if (typeof window === "undefined") return [];
    const ordersRaw = localStorage.getItem("neemonOrders");
    return ordersRaw ? JSON.parse(ordersRaw) : [];
  });
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    const wishlistRaw = localStorage.getItem("wishlist");
    return wishlistRaw ? JSON.parse(wishlistRaw) : [];
  });

  const [addresses, setAddresses] = useState<Address[]>(() => {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem("neemonAddresses");
    const all = raw ? (JSON.parse(raw) as Address[]) : [];
    return user ? all.filter((a) => a.userId === user.id) : [];
  });
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileDraft, setProfileDraft] = useState<User | null>(user);
  const [reviews, setReviews] = useState<Review[]>(() => {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem("neemonReviews");
    const all = raw ? (JSON.parse(raw) as Review[]) : [];
    return user ? all.filter((r) => r.userId === user.id) : [];
  });
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "neemonOrders" && e.newValue) {
        setOrders(JSON.parse(e.newValue));
      }
      if (e.key === "wishlist" && e.newValue) {
        setWishlistIds(JSON.parse(e.newValue));
      }
      if (e.key === "neemonAddresses" && e.newValue) {
        const all = JSON.parse(e.newValue) as Address[];
        setAddresses(user ? all.filter((a) => a.userId === user.id) : []);
      }
      if (e.key === "neemonReviews" && e.newValue) {
        const all = JSON.parse(e.newValue) as Review[];
        setReviews(user ? all.filter((r) => r.userId === user.id) : []);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [user]);

  useEffect(() => {
    setProfileDraft(user);
    const rawAddr = localStorage.getItem("neemonAddresses");
    const allAddr = rawAddr ? (JSON.parse(rawAddr) as Address[]) : [];
    setAddresses(user ? allAddr.filter((a) => a.userId === user.id) : []);
    const rawRev = localStorage.getItem("neemonReviews");
    const allRev = rawRev ? (JSON.parse(rawRev) as Review[]) : [];
    setReviews(user ? allRev.filter((r) => r.userId === user.id) : []);
  }, [user]);

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-6 py-10">
        <h1 className="font-serif text-3xl mb-4">Account</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Log in to view your profile, orders, and wishlist.
        </p>
        <div className="mt-4 flex gap-3">
          <a
            href="/auth/login"
            className="rounded-full px-4 py-2 border inline-block"
          >
            Log in
          </a>
          <a
            href="/auth/signup"
            className="rounded-full px-4 py-2 border inline-block"
          >
            Create account
          </a>
        </div>
      </div>
    );
  }

  const wishlistProducts = products.filter((p) =>
    wishlistIds.includes(p.id)
  );

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl">Welcome, {user.name}</h1>
        <button
          onClick={logout}
          className="text-sm rounded-full px-4 py-2 border"
        >
          Log out
        </button>
      </div>
      <div className="flex gap-3 text-sm mb-6">
        <button
          onClick={() => setSection("profile")}
          className={`px-4 py-2 rounded_full border ${
            section === "profile"
              ? "bg-[color:var(--champagne-gold)] text-white"
              : ""
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setSection("addresses")}
          className={`px-4 py-2 rounded-full border ${
            section === "addresses"
              ? "bg-[color:var(--champagne-gold)] text-white"
              : ""
          }`}
        >
          Addresses
        </button>
        <button
          onClick={() => setSection("orders")}
          className={`px-4 py-2 rounded-full border ${
            section === "orders"
              ? "bg-[color:var(--champagne-gold)] text-white"
              : ""
          }`}
        >
          Orders
        </button>
        <button
          onClick={() => setSection("wishlist")}
          className={`px-4 py-2 rounded-full border ${
            section === "wishlist"
              ? "bg-[color:var(--champagne-gold)] text-white"
              : ""
          }`}
        >
          Wishlist
        </button>
        <button
          onClick={() => setSection("reviews")}
          className={`px-4 py-2 rounded-full border ${
            section === "reviews"
              ? "bg-[color:var(--champagne-gold)] text-white"
              : ""
          }`}
        >
          Reviews
        </button>
      </div>

      {section === "profile" && (
        <div className="border rounded-xl p-4 bg-white dark:bg-black text-sm space-y-3">
          {!editingProfile ? (
            <>
              <div className="flex items-center justify-between">
                <div className="font-medium">Profile</div>
                <button
                  onClick={() => setEditingProfile(true)}
                  className="rounded-full px-3 py-1 border"
                >
                  Edit
                </button>
              </div>
              <div>Name: {user.name}</div>
              <div>Email: {user.email}</div>
              <div>Phone: {user.phone}</div>
            </>
          ) : (
            <>
              <div className="font-medium">Edit Profile</div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Full name</label>
                  <input
                    value={profileDraft?.name || ""}
                    onChange={(e) =>
                      setProfileDraft((p) => (p ? { ...p, name: e.target.value } : p))
                    }
                    className="w-full rounded-lg border px-3 py-2 bg-transparent"
                  />
                </div>
                <div>
                  <label className="block mb-1">Phone</label>
                  <input
                    value={profileDraft?.phone || ""}
                    onChange={(e) =>
                      setProfileDraft((p) => (p ? { ...p, phone: e.target.value } : p))
                    }
                    className="w-full rounded-lg border px-3 py-2 bg-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingProfile(false)}
                  className="rounded-full px-4 py-2 border"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const raw = localStorage.getItem("neemonUsers");
                    const users = raw ? JSON.parse(raw) : [];
                    const idx = users.findIndex((u: any) => u.id === user.id);
                    if (idx >= 0 && profileDraft) {
                      users[idx] = { ...users[idx], name: profileDraft.name, phone: profileDraft.phone };
                      localStorage.setItem("neemonUsers", JSON.stringify(users));
                      localStorage.setItem(
                        "neemonUser",
                        JSON.stringify({ ...user, name: profileDraft.name, phone: profileDraft.phone })
                      );
                    }
                    setEditingProfile(false);
                  }}
                  className="rounded-full px-4 py-2 bg-[color:var(--champagne-gold)] text-white"
                >
                  Save
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {section === "addresses" && (
        <div className="border rounded-xl p-4 bg-white dark:bg-black text-sm space-y-3">
          <div className="font-medium">Addresses</div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block mb-1">Label</label>
              <input
                id="addr_label"
                className="w-full rounded-lg border px-3 py-2 bg-transparent"
              />
            </div>
            <div>
              <label className="block mb-1">Address</label>
              <input
                id="addr_text"
                className="w-full rounded-lg border px-3 py-2 bg-transparent"
              />
            </div>
          </div>
          <button
            onClick={() => {
              const label = (document.getElementById("addr_label") as HTMLInputElement)?.value.trim();
              const text = (document.getElementById("addr_text") as HTMLInputElement)?.value.trim();
              if (!label || !text || !user) return;
              const raw = localStorage.getItem("neemonAddresses");
              const all = raw ? (JSON.parse(raw) as Address[]) : [];
              const entry: Address = {
                id: crypto.randomUUID(),
                userId: user.id,
                label,
                addressText: text,
              };
              const next = [...all, entry];
              localStorage.setItem("neemonAddresses", JSON.stringify(next));
              const mine = next.filter((a) => a.userId === user.id);
              setAddresses(mine);
              (document.getElementById("addr_label") as HTMLInputElement).value = "";
              (document.getElementById("addr_text") as HTMLInputElement).value = "";
            }}
            className="rounded-full px-4 py-2 bg-[color:var(--champagne-gold)] text-white"
          >
            Add address
          </button>
          <div className="space-y-2">
            {addresses.length === 0 ? (
              <div className="text-zinc-600 dark:text-zinc-400">No saved addresses.</div>
            ) : (
              addresses.map((a) => (
                <div key={a.id} className="flex items-center justify_between border rounded-lg px-3 py-2">
                  <div>
                    <div className="font-medium">{a.label}</div>
                    <div className="text-xs text-zinc-500">{a.addressText}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="text-sm underline"
                      onClick={() => {
                        const raw = localStorage.getItem("neemonAddresses");
                        const all = raw ? (JSON.parse(raw) as Address[]) : [];
                        const next = all.filter((x) => x.id !== a.id);
                        localStorage.setItem("neemonAddresses", JSON.stringify(next));
                        setAddresses(next.filter((x) => x.userId === user!.id));
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {section === "orders" && (
        <div className="border rounded-xl p-4 bg-white dark:bg-black text-sm space-y-3">
          {orders.length === 0 ? (
            <div className="text-zinc-600 dark:text-zinc-400">
              You have no orders yet.
            </div>
          ) : (
            orders.map((o) => {
              const lines = o.items
                .map((it) => {
                  const p = products.find((pp) => pp.id === it.productId);
                  return p ? { product: p, qty: it.qty } : null;
                })
                .filter(Boolean) as { product: (typeof products)[number]; qty: number }[];
              const open = selectedOrder === o.id;
              return (
                <div key={o.id} className="border rounded-lg">
                  <div className="flex items-center justify-between px-3 py-2">
                    <div>
                      <div className="font-medium">{o.id}</div>
                      <div className="text-xs text-zinc-500">
                        {new Date(o.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">KES {o.total.toLocaleString()}</div>
                      <div className="text-xs text-zinc-500">{o.status}</div>
                      <button
                        onClick={() => setSelectedOrder(open ? null : o.id)}
                        className="ml-3 text-xs underline"
                      >
                        {open ? "Hide details" : "View details"}
                      </button>
                    </div>
                  </div>
                  {open && (
                    <div className="px-3 pb-3 space-y-2">
                      {lines.map((l) => (
                        <div key={l.product.id} className="flex items-center justify-between">
                          <div className="text-sm">{l.product.name}</div>
                          <div className="text-sm">x{l.qty}</div>
                          <div className="text_sm">KES {l.product.priceKes.toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {section === "wishlist" && (
        <div className="border rounded-xl p-4 bg-white dark:bg-black text-sm space-y-3">
          {wishlistProducts.length === 0 ? (
            <div className="text-zinc-600 dark:text-zinc-400">Your wishlist is empty.</div>
          ) : (
            wishlistProducts.map((p) => (
              <div key={p.id} className="flex items-center justify-between border rounded-lg px-3 py-2">
                <div>
                  <div className="text-xs text-zinc-500">{p.brand}</div>
                  <div className="font_medium">{p.name}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="font-semibold">KES {p.priceKes.toLocaleString()}</div>
                  <button
                    className="text-sm underline"
                    onClick={() => {
                      const raw = localStorage.getItem("cart");
                      const cart = raw ? (JSON.parse(raw) as { productId: string; qty: number }[]) : [];
                      const idx = cart.findIndex((c) => c.productId === p.id);
                      if (idx >= 0) cart[idx].qty += 1;
                      else cart.push({ productId: p.id, qty: 1 });
                      localStorage.setItem("cart", JSON.stringify(cart));
                    }}
                  >
                    Add to cart
                  </button>
                  <button
                    className="text-sm text-red-600"
                    onClick={() => {
                      const raw = localStorage.getItem("wishlist");
                      const ids = raw ? (JSON.parse(raw) as string[]) : [];
                      const next = ids.filter((id) => id !== p.id);
                      localStorage.setItem("wishlist", JSON.stringify(next));
                      setWishlistIds(next);
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {section === "reviews" && (
        <div className="border rounded-xl p-4 bg_white dark:bg-black text-sm space-y-3">
          <div className="font-medium">Your Reviews</div>
          {reviews.length === 0 ? (
            <div className="text-zinc-600 dark:text-zinc-400">You have not submitted any reviews yet.</div>
          ) : (
            reviews.map((r) => {
              const p = products.find((pp) => pp.id === r.productId);
              return (
                <div key={r.id} className="border rounded-lg px-3 py-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{p?.name || r.productId}</div>
                    <div className="text-xs">Rating: {r.rating} ★</div>
                  </div>
                  <div className="text-sm mt-1">{r.text}</div>
                  <div className="mt-2 text-xs text-zinc-500">{new Date(r.createdAt).toLocaleString()}</div>
                  <div className="mt-2 flex gap-2">
                    <button
                      className="text-xs underline"
                      onClick={() => {
                        const next = reviews.map((x) =>
                          x.id === r.id ? { ...x, text: prompt("Edit review text", r.text) || r.text } : x
                        );
                        const raw = localStorage.getItem("neemonReviews");
                        const all = raw ? (JSON.parse(raw) as Review[]) : [];
                        const merged = all.map((x) =>
                          x.id === r.id ? { ...x, text: next.find((n) => n.id === x.id)?.text || x.text } : x
                        );
                        localStorage.setItem("neemonReviews", JSON.stringify(merged));
                        setReviews(next);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-xs text-red-600"
                      onClick={() => {
                        const raw = localStorage.getItem("neemonReviews");
                        const all = raw ? (JSON.parse(raw) as Review[]) : [];
                        const merged = all.filter((x) => x.id !== r.id);
                        localStorage.setItem("neemonReviews", JSON.stringify(merged));
                        setReviews(merged.filter((x) => x.userId === user!.id));
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
