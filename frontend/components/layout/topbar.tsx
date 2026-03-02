"use client";
import { useAuth } from "../../lib/auth";
import { DropdownMenu, DropdownTrigger, DropdownItem, DropdownContent } from "../ui/dropdown-menu";
import { Bell, User, Settings, LogOut, Search, Menu } from "lucide-react";
import { Input } from "../ui/input";
import Link from "next/link";

export function Topbar() {
  const { user, logout } = useAuth();
  
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <button className="lg:hidden p-2 -ml-2 hover:bg-muted rounded-md" aria-label="Toggle Menu">
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="hidden md:flex relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search anything..." 
              className="pl-9 bg-muted/50 border-none focus-visible:ring-1 h-9"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button className="relative h-9 w-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors" aria-label="Notifications">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive border-2 border-background" />
          </button>
          
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
