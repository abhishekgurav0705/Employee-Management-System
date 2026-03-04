"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark" | "system";
type ThemeCtx = { theme: Theme; setTheme: (t: Theme) => void; cycle: () => void };

const Ctx = createContext<ThemeCtx | null>(null);

function apply(theme: Theme, setState?: (t: Theme) => void) {
  const root = typeof document !== "undefined" ? document.documentElement : null;
  if (!root) return;
  const sysDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const next = theme === "system" ? (sysDark ? "dark" : "light") : theme;
  if (next === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
  try { localStorage.setItem("ems_theme", theme); } catch {}
  if (setState) setState(theme);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setState] = useState<Theme>("system");
  useEffect(() => {
    let cached: Theme = "system";
    try { cached = (localStorage.getItem("ems_theme") as Theme) || "system"; } catch {}
    apply(cached, setState);
    const m = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
    const onChange = () => {
      const cur = cached;
      if (cur === "system") apply("system");
    };
    if (m) {
      m.addEventListener ? m.addEventListener("change", onChange) : m.addListener(onChange);
      return () => {
        m.removeEventListener ? m.removeEventListener("change", onChange) : m.removeListener(onChange);
      };
    }
  }, []);
  const setTheme = (t: Theme) => apply(t, setState);
  const cycle = () => {
    const order: Theme[] = ["light", "dark", "system"];
    const idx = order.indexOf(theme);
    setTheme(order[(idx + 1) % order.length]);
  };
  const value = useMemo(() => ({ theme, setTheme, cycle }), [theme]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("ThemeProvider missing");
  return ctx;
}

