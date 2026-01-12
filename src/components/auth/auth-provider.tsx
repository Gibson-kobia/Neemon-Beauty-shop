"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type StoredUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  salt: string;
};

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

async function hashPassword(salt: string, password: string) {
  const enc = new TextEncoder();
  const data = enc.encode(salt + password);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const bytes = Array.from(new Uint8Array(digest));
  return bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function getUsers(): StoredUser[] {
  const raw = typeof window !== "undefined" ? localStorage.getItem("neemonUsers") : null;
  return raw ? (JSON.parse(raw) as StoredUser[]) : [];
}

function setUsers(users: StoredUser[]) {
  localStorage.setItem("neemonUsers", JSON.stringify(users));
}

function toPublic(u: StoredUser): PublicUser {
  return { id: u.id, name: u.name, email: u.email, phone: u.phone };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(() => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("neemonUser");
    return raw ? (JSON.parse(raw) as PublicUser) : null;
  });

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "neemonUser" && e.newValue) {
        setUser(JSON.parse(e.newValue));
      }
      if (e.key === "neemonUser" && e.newValue === null) {
        setUser(null);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    return {
      user,
      signup: async (name, email, phone, password) => {
        const users = getUsers();
        if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
          return { ok: false, error: "Email already registered" };
        }
        const saltBytes = new Uint8Array(16);
        crypto.getRandomValues(saltBytes);
        const salt = Array.from(saltBytes).map((b) => b.toString(16).padStart(2, "0")).join("");
        const passwordHash = await hashPassword(salt, password);
        const id = crypto.randomUUID();
        const stored: StoredUser = { id, name, email, phone, passwordHash, salt };
        setUsers([...users, stored]);
        const pub = toPublic(stored);
        localStorage.setItem("neemonUser", JSON.stringify(pub));
        localStorage.setItem("neemonSession", JSON.stringify({ token: crypto.randomUUID(), userId: id }));
        setUser(pub);
        return { ok: true };
      },
      login: async (email, password) => {
        const users = getUsers();
        const u = users.find((x) => x.email.toLowerCase() === email.toLowerCase());
        if (!u) return { ok: false, error: "Invalid credentials" };
        const computed = await hashPassword(u.salt, password);
        if (computed !== u.passwordHash) return { ok: false, error: "Invalid credentials" };
        const pub = toPublic(u);
        localStorage.setItem("neemonUser", JSON.stringify(pub));
        localStorage.setItem("neemonSession", JSON.stringify({ token: crypto.randomUUID(), userId: u.id }));
        setUser(pub);
        return { ok: true };
      },
      logout: () => {
        localStorage.removeItem("neemonUser");
        localStorage.removeItem("neemonSession");
        setUser(null);
      },
      resetPassword: async (email, newPassword) => {
        const users = getUsers();
        const idx = users.findIndex((x) => x.email.toLowerCase() === email.toLowerCase());
        if (idx === -1) return { ok: false, error: "Email not found" };
        const saltBytes = new Uint8Array(16);
        crypto.getRandomValues(saltBytes);
        const salt = Array.from(saltBytes).map((b) => b.toString(16).padStart(2, "0")).join("");
        const passwordHash = await hashPassword(salt, newPassword);
        users[idx] = { ...users[idx], salt, passwordHash };
        setUsers(users);
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
