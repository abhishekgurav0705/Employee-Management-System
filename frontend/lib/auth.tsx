"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { api } from "./api";

type User = { id: string; email: string; role: string; name?: string };
type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const t = typeof window !== "undefined" ? localStorage.getItem("ems_token") : null;
    if (t) {
      setToken(t);
      api.auth.me().then((u: any) => {
        setUser(u.user ?? u);
      }).catch(() => {
        localStorage.removeItem("ems_token");
        setToken(null);
        setUser(null);
        if (pathname !== "/" && pathname !== "/login") router.replace("/login");
      });
    } else {
      if (pathname !== "/" && pathname !== "/login") router.replace("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const login = async (email: string, password: string) => {
    const res = await api.auth.login(email, password);
    localStorage.setItem("ems_token", res.token);
    setToken(res.token);
    const me = await api.auth.me();
    const u = me.user ?? me;
    setUser(u);
    const role = String(u.role ?? "").toUpperCase();
    router.replace("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("ems_token");
    setToken(null);
    setUser(null);
    router.replace("/login");
  };

  const value = useMemo(() => ({ user, token, login, logout }), [user, token]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("AuthProvider missing");
  return ctx;
}
