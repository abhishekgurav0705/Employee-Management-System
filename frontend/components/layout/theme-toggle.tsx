"use client";
import React from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { DropdownMenu, DropdownTrigger, DropdownItem, DropdownContent } from "../ui/dropdown-menu";
import { useTheme } from "../../lib/theme";

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme, cycle } = useTheme();
  if (compact) {
    return (
      <button
        aria-label="Theme"
        onClick={cycle}
        className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
        title={`Theme: ${theme}`}
      >
        {theme === "dark" ? <Moon className="h-5 w-5" /> : theme === "light" ? <Sun className="h-5 w-5" /> : <Monitor className="h-5 w-5" />}
      </button>
    );
  }
  return (
    <DropdownMenu>
      <DropdownTrigger asChild>
        <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted transition-colors">
          {theme === "dark" ? <Moon className="h-4 w-4" /> : theme === "light" ? <Sun className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
          <span>Theme</span>
        </button>
      </DropdownTrigger>
      <DropdownContent align="end" className="w-40">
        <DropdownItem onClick={() => setTheme("light")}>Light</DropdownItem>
        <DropdownItem onClick={() => setTheme("dark")}>Dark</DropdownItem>
        <DropdownItem onClick={() => setTheme("system")}>System</DropdownItem>
      </DropdownContent>
    </DropdownMenu>
  );
}

