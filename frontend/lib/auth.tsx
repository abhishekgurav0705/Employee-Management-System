"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { api, type ApiUser } from "./api";

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
    const isPublicPage = pathname === "/" || pathname === "/login";

    if (t) {
      setToken(t);
      api.auth.me().then((res) => {
        const u = (res as any).user ?? (res as any);
        const userObj = u as ApiUser;
        setUser(userObj);

        // RBAC: Protect Admin routes
        const adminRoutes = ["/employees", "/departments", "/leave/approvals", "/activity-log", "/settings"];
        const isEmployee = String(userObj.role ?? "").toUpperCase() === "EMPLOYEE";
        
        if (isEmployee && adminRoutes.some(route => pathname.startsWith(route))) {
          // Special case for My Profile which is /employees/[id]
          const isMyProfile = pathname.startsWith("/employees/") && !pathname.endsWith("/edit") && !pathname.endsWith("/new");
          if (!isMyProfile) {
            router.replace("/dashboard");
          }
        }
      }).catch(() => {
        localStorage.removeItem("ems_token");
        setToken(null);
        setUser(null);
        if (!isPublicPage) router.replace("/login");
      });
    } else {
      if (!isPublicPage) router.replace("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const login = async (email: string, password: string) => {
    const res = await api.auth.login(email, password);
    localStorage.setItem("ems_token", res.token);
    setToken(res.token);
    const me = await api.auth.me();
    const u = (me as any).user ?? (me as any);
    setUser(u as ApiUser);
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
