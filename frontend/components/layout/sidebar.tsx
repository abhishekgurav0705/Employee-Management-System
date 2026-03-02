"use client";
import Link from "next/link";
import { useAuth } from "../../lib/auth";
import { cn } from "../../lib/utils";
import { Users, Building2, CalendarDays, Clock, Activity, Settings, LayoutDashboard, UserCheck, FileCheck } from "lucide-react";

type NavItem = { label: string; href: string; icon: React.ComponentType<{ className?: string }> };

function itemsForRole(role: string): NavItem[] {
  const r = String(role ?? "").toUpperCase();
  if (r === "ADMIN") {
    return [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Employees", href: "/employees", icon: Users },
      { label: "Departments", href: "/departments", icon: Building2 },
      { label: "Leave Requests", href: "/leave/approvals", icon: FileCheck },
      { label: "Attendance", href: "/attendance", icon: Clock },
      { label: "Activity Log", href: "/activity-log", icon: Activity },
      { label: "Settings", href: "/settings", icon: Settings }
    ];
  }
  return [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Profile", href: "/employees", icon: UserCheck },
    { label: "My Leave", href: "/leave", icon: CalendarDays },
    { label: "My Attendance", href: "/attendance", icon: Clock }
  ];
}

export function Sidebar() {
  const { user } = useAuth();
  const items = itemsForRole(user?.role ?? "EMPLOYEE");
  return (
    <aside className="hidden lg:block w-64 border-r border-border bg-background">
      <div className="px-4 py-4">
        <Link href="/dashboard" className="font-semibold tracking-tight">EMS</Link>
        <div className="mt-6 space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted",
                  "text-foreground"
                )}
              >
                <Icon className="h-4 w-4 text-secondary" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
