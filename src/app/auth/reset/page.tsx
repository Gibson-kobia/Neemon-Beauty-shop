"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../../components/auth/auth-provider";

export default function ResetPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatus(null);
    if (!email.trim() || !newPassword) {
      setError("Enter your email and a new password.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }
    setLoading(true);
    const res = await resetPassword(email.trim(), newPassword);
    setLoading(false);
    if (!res.ok) {
      setError(res.error || "Unable to reset password.");
      return;
    }
    setStatus("Password updated. You can now log in.");
  };

  return (
    <div className="mx-auto max-w-md px-6 py-10">
      <h1 className="font-serif text-3xl mb-2">Reset password</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
        Enter your email and a new password.
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
          <label className="block mb-1">New password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-lg border border-black/10 dark:border-white/10 px-3 py-2 bg-white dark:bg-black"
          />
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        {status && <div className="text-sm text-emerald-600">{status}</div>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full px-4 py-2 bg-[color:var(--champagne-gold)] text-white text-sm font-medium hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Updating..." : "Reset password"}
        </button>
      </form>
      <div className="mt-4 text-xs text-zinc-600 dark:text-zinc-400">
        <Link href="/auth/login" className="underline">
          Back to login
        </Link>
      </div>
    </div>
  );
}
