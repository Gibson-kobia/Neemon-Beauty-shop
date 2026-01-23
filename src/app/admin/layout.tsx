"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = getSupabase();

  const ADMIN_EMAILS = ["virginiagatwiri7@gmail.com"];

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/auth/login?redirect=/admin");
        setLoading(false);
        return;
      }

      const normalizedEmail = (session.user.email ?? "").toLowerCase().trim();
      const isAdmin = ADMIN_EMAILS.map((e) => e.toLowerCase().trim()).includes(normalizedEmail);
      if (!isAdmin) {
        setAccessDenied(true);
        setLoading(false);
        return;
      }

      setAuthenticated(true);
      setLoading(false);
    };

    checkSession();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-xl shadow p-6 text-center">
          <div className="text-2xl font-serif">Access denied</div>
          <p className="mt-2 text-sm text-zinc-600">You do not have admin access for this account.</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={handleLogout}
              className="rounded-lg px-4 py-2 border text-sm hover:bg-black/5"
            >
              Logout
            </button>
            <Link
              href="/auth/login?redirect=/admin"
              className="rounded-lg px-4 py-2 border text-sm hover:bg-black/5"
            >
              Login with a different account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: "📊" },
    { name: "Products", href: "/admin/products", icon: "📦" },
    { name: "Orders", href: "/admin/orders", icon: "📋" },
    { name: "Settings", href: "/admin/settings", icon: "⚙️" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col fixed h-full z-10">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold font-playfair tracking-wide">
            NEEMON <span className="text-sm font-sans font-normal text-gray-500 block">Seller Admin</span>
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <span>🚪</span>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
