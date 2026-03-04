"use client";
import { useAuth } from "../../lib/auth";
import { DropdownMenu, DropdownTrigger, DropdownItem, DropdownContent } from "../ui/dropdown-menu";
import { Bell, User, Settings, LogOut, Search, Menu, LayoutDashboard, Users, Building2, CalendarDays, Clock, Activity, FileCheck, UserCheck } from "lucide-react";
import { Input } from "../ui/input";
import Link from "next/link";
import React from "react";
import { api } from "../../lib/api";
import { formatDate } from "../../lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { Drawer, DrawerTrigger, DrawerContent, DrawerClose } from "../ui/drawer";

export function Topbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [items, setItems] = React.useState<Array<{ id: string; action: string; createdAt?: string; timestamp?: string; target?: string }>>([]);
  const role = String(user?.role ?? "EMPLOYEE").toUpperCase();
  const canView = role === "ADMIN" || role === "HR";

  React.useEffect(() => {
    if (!open || !canView) return;
    let cancelled = false;
    setLoading(true);
    api.activityLogs
      .list()
      .then((res: any) => {
        if (cancelled) return;
        const logs = Array.isArray(res) ? res : res.logs || [];
        if (logs.length > 0) {
          setItems(logs.slice(0, 8));
        } else {
          return api.leaves
            .pending()
            .then((p: any) => {
              if (cancelled) return;
              const reqs = (p?.requests || []).map((r: any) => ({
                id: r.id,
                action: `Leave request from ${r?.employee?.name || "Employee"} (${r.type})`,
                createdAt: r.createdAt,
                target: r.employee?.email || ""
              }));
              setItems(reqs.slice(0, 8));
            })
            .catch(() => {
              if (!cancelled) setItems([]);
            });
        }
      })
      .catch(() => {
        if (cancelled) return;
        setItems([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, canView]);
  
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <Drawer>
            <DrawerTrigger asChild>
              <button className="lg:hidden p-2 -ml-2 hover:bg-muted rounded-md" aria-label="Toggle Menu">
                <Menu className="h-5 w-5" />
              </button>
            </DrawerTrigger>
            <DrawerContent side="left" className="w-80">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                    <LayoutDashboard className="h-4 w-4" />
                  </div>
                  <span className="font-bold">EMS Pro</span>
                </div>
                <ThemeToggle compact />
              </div>
              <nav className="py-3 space-y-1">
                <MobileLink href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
                {String(user?.role ?? "").toUpperCase() !== "EMPLOYEE" ? (
                  <>
                    <MobileLink href="/employees" icon={Users} label="Employees" />
                    <MobileLink href="/departments" icon={Building2} label="Departments" />
                    <MobileLink href="/leave/approvals" icon={FileCheck} label="Leave Requests" />
                    <MobileLink href="/activity-log" icon={Activity} label="Activity Log" />
                  </>
                ) : (
                  <MobileLink href="/employees/me" icon={UserCheck} label="My Profile" />
                )}
                <MobileLink href="/leave" icon={CalendarDays} label="My Leave" />
                <MobileLink href="/attendance" icon={Clock} label="Attendance" />
                <MobileLink href="/settings" icon={Settings} label="Settings" />
              </nav>
              <div className="pt-3 border-t border-border">
                <button onClick={logout} className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-muted text-destructive">
                  <LogOut className="h-4 w-4" />
                  <span>Sign out</span>
                </button>
              </div>
            </DrawerContent>
          </Drawer>
          
          <div className="hidden md:flex relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search anything..." 
              className="pl-9 bg-muted/50 border-none focus-visible:ring-1 h-9"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle compact />
          <DropdownMenu>
            <DropdownTrigger asChild>
              <button
                onClick={() => setOpen((o) => !o)}
                className="relative h-9 w-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5 text-muted-foreground" />
                {canView && items.length > 0 && (
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive border-2 border-background" />
                )}
              </button>
            </DropdownTrigger>
            <DropdownContent align="end" className="w-80 p-0">
              <div className="px-3 py-2 border-b">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Notifications</p>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {!canView ? (
                  <div className="p-3 text-sm text-muted-foreground">Notifications are not available for your role.</div>
                ) : loading ? (
                  <div className="p-3 text-sm text-muted-foreground">Loading…</div>
                ) : items.length === 0 ? (
                  <div className="p-3 text-sm text-muted-foreground">No recent activity.</div>
                ) : (
                  items.map((n) => (
                    <div key={n.id} className="px-3 py-2 hover:bg-muted/60">
                      <div className="text-sm">{n.action || "Activity"}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {n.target ? `Target: ${n.target} • ` : ""}
                        {(n.createdAt || n.timestamp) ? formatDate(String(n.createdAt || n.timestamp)) : ""}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </DropdownContent>
          </DropdownMenu>
          
          <div className="h-6 w-px bg-border mx-1 hidden sm:block" />

          <DropdownMenu>
            <DropdownTrigger asChild>
              <button className="flex items-center gap-2 rounded-full pl-1 pr-1 sm:pr-2 py-1 hover:bg-muted transition-colors group">
                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm border border-primary/20">
                  {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium leading-none group-hover:text-primary transition-colors">
                    {user?.name || "User"}
                  </div>
                  <div className="text-[10px] text-muted-foreground font-medium uppercase mt-1 tracking-wider">
                    {user?.role || "Employee"}
                  </div>
                </div>
              </button>
            </DropdownTrigger>
            <DropdownContent align="end" className="w-56">
              <div className="px-2 py-1.5 border-b mb-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Account</p>
              </div>
              <Link href={user?.role === "ADMIN" ? "/employees" : "/employees/me"}>
                <DropdownItem className="gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>My Profile</span>
                </DropdownItem>
              </Link>
              <Link href="/settings">
                <DropdownItem className="gap-2">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <span>Settings</span>
                </DropdownItem>
              </Link>
              <div className="h-px bg-border my-1" />
              <DropdownItem onClick={logout} className="gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive">
                <LogOut className="h-4 w-4" />
                <span>Sign out</span>
              </DropdownItem>
            </DropdownContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

function MobileLink({ href, icon: Icon, label }: { href: string; icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted text-sm">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span>{label}</span>
    </Link>
  );
}
