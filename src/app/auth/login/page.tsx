"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../../components/auth/auth-provider";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }
    setLoading(true);
    const res = await login(email.trim(), password);
    setLoading(false);
    if (!res.ok) {
      setError(res.error || "Invalid credentials");
      return;
    }
    window.location.href = "/account";
  };

  return (
    <div className="mx-auto max-w-md px-6 py-10">
      <h1 className="font-serif text-3xl mb-2">Log in</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
        Welcome back to NEEMON.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-black/10 dark:border-white/10 px-3 py-2 bg-white dark:bg-black"
          />
        </div>
        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-black/10 dark:border-white/10 px-3 py-2 bg-white dark:bg_black"
          />
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full px-4 py-2 bg-[color:var(--champagne-gold)] text_white text-sm font-medium hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>
      <div className="mt-4 text-xs text-zinc-600 dark:text-zinc-400">
        <Link href="/auth/reset" className="underline">
          Forgot password?
        </Link>
      </div>
      <div className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
        New to NEEMON?{" "}
        <Link href="/auth/signup" className="underline">
          Create account
        </Link>
      </div>
    </div>
  );
}
