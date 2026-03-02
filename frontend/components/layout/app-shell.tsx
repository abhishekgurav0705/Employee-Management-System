"use client";
import * as React from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { usePathname } from "next/navigation";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/" || pathname === "/login";
  return (
    <div className="min-h-screen">
      {isAuthPage ? (
        <main className="container-fluid py-6">{children}</main>
      ) : (
        <div className="flex">
          <Sidebar />
          <div className="flex-1">
            <Topbar />
            <main className="container-fluid py-6">{children}</main>
          </div>
        </div>
      )}
    </div>
  );
}
