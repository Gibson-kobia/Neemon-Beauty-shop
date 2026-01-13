"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getSupabase } from "../../lib/supabase";
import type { User } from "@supabase/supabase-js";

type PublicUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

type AuthContextValue = {
  user: PublicUser | null;
  signup: (name: string, email: string, phone: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  resetPassword: (email: string, newPassword: string) => Promise<{ ok: boolean; error?: string }>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function toPublicFromSupabase(u: User): PublicUser {
  return {
    id: u.id,
    name: (u.user_metadata?.name as string) || "",
    email: u.email || "",
    phone: (u.user_metadata?.phone as string) || "",
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);

  useEffect(() => {
    let mounted = true;
    getSupabase().auth.getUser().then((res) => {
      const u = res.data.user;
      if (mounted) setUser(u ? toPublicFromSupabase(u) : null);
    });
    const { data: sub } = getSupabase().auth.onAuthStateChange((_event, session) => {
      const u = session?.user || null;
      setUser(u ? toPublicFromSupabase(u) : null);
    });
    return () => {
      mounted = false;
      sub?.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    return {
      user,
      signup: async (name, email, phone, password) => {
        const { data, error } = await getSupabase().auth.signUp({
          email,
          password,
          options: { data: { name, phone } },
        });
        if (error) return { ok: false, error: error.message };
        if (data.user) setUser(toPublicFromSupabase(data.user));
        return { ok: true };
      },
      login: async (email, password) => {
        const { data, error } = await getSupabase().auth.signInWithPassword({ email, password });
        if (error) return { ok: false, error: error.message };
        if (data.user) setUser(toPublicFromSupabase(data.user));
        return { ok: true };
      },
      logout: () => {
        getSupabase().auth.signOut();
        setUser(null);
      },
      resetPassword: async (email, _newPassword) => {
        const { error } = await getSupabase().auth.resetPasswordForEmail(email);
        if (error) return { ok: false, error: error.message };
        return { ok: true };
      },
    };
  }, [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("AuthContext missing");
  return ctx;
}
