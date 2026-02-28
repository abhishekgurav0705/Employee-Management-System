use client;
import * as React from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Topbar />
          <main className="container-fluid py-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
