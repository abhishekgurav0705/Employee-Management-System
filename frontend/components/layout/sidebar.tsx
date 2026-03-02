"use client";
import Link from "next/link";
import { useAuth } from "../../lib/auth";
import { cn } from "../../lib/utils";
import { 
  Users, 
  Building2, 
  CalendarDays, 
  Clock, 
  Activity, 
  Settings, 
  LayoutDashboard, 
  UserCheck, 
  FileCheck,
  Building,
  Menu,
  ChevronRight
} from "lucide-react";
import { usePathname } from "next/navigation";

type NavItem = { label: string; href: string; icon: React.ComponentType<{ className?: string }>; adminOnly?: boolean };

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Employees", href: "/employees", icon: Users, adminOnly: true },
  { label: "Departments", href: "/departments", icon: Building2, adminOnly: true },
  { label: "Leave Requests", href: "/leave/approvals", icon: FileCheck, adminOnly: true },
  { label: "My Leave", href: "/leave", icon: CalendarDays },
  { label: "Attendance", href: "/attendance", icon: Clock },
  { label: "Activity Log", href: "/activity-log", icon: Activity, adminOnly: true },
  { label: "Settings", href: "/settings", icon: Settings }
];

export function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const role = String(user?.role ?? "EMPLOYEE").toUpperCase();
  const isAdmin = role === "ADMIN";

  const visibleItems = navItems.filter(item => !item.adminOnly || isAdmin);

  return (
    <aside className="hidden lg:flex w-72 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center px-6 border-b border-border/50">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
            <Building className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-foreground">EMS Pro</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary leading-none">Enterprise</span>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
        <div className="space-y-1">
          <p className="px-4 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-4">
            Main Menu
          </p>
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center justify-between gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/10" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn(
                    "h-5 w-5 transition-colors",
                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"
                  )} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="h-4 w-4 opacity-50" />}
              </Link>
            );
          })}
        </div>

        {!isAdmin && (
           <div className="space-y-1 pt-4 border-t border-border/50">
           <p className="px-4 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-4">
             Personal
           </p>
           <Link
             href="/employees/me"
             className={cn(
               "group flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200",
               pathname === "/employees/me" 
                 ? "bg-primary text-primary-foreground shadow-md shadow-primary/10" 
                 : "text-muted-foreground hover:bg-muted hover:text-foreground"
             )}
           >
             <UserCheck className={cn(
               "h-5 w-5",
               pathname === "/employees/me" ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"
             )} />
             <span>My Profile</span>
           </Link>
         </div>
        )}
      </div>

      <div className="p-4 border-t border-border/50">
        <div className="rounded-xl bg-muted/50 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold truncate text-foreground">{user?.name || "User"}</span>
              <span className="text-[10px] font-medium text-muted-foreground truncate uppercase">{user?.role || "Employee"}</span>
            </div>
          </div>
          <div className="flex gap-2">
             <div className="h-1.5 flex-1 rounded-full bg-border overflow-hidden">
               <div className="h-full bg-primary w-2/3" />
             </div>
             <span className="text-[10px] font-bold text-primary">65%</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">Profile completion</p>
        </div>
      </div>
    </aside>
  );
}
