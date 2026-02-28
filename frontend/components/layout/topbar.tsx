use client;
import Image from "next/image";
import { currentUser } from "../../lib/mock";
import { DropdownMenu, DropdownTrigger, DropdownItem, DropdownContent } from "../ui/dropdown-menu";
import { Bell } from "lucide-react";

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-fluid h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-secondary">Employee Management System</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative rounded-md p-2 hover:bg-muted" aria-label="Notifications">
            <Bell className="h-5 w-5 text-secondary" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
          </button>
          <DropdownMenu>
            <DropdownTrigger asChild>
              <button className="flex items-center gap-3 rounded-md p-1 hover:bg-muted">
                <div className="h-8 w-8 rounded-full bg-muted overflow-hidden">
                  <Image src="/avatar.svg" alt={currentUser.name} width={32} height={32} />
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-sm">{currentUser.name}</div>
                  <div className="text-xs text-secondary">{currentUser.role.toUpperCase()}</div>
                </div>
              </button>
            </DropdownTrigger>
            <DropdownContent>
              <DropdownItem>My Profile</DropdownItem>
              <DropdownItem>Settings</DropdownItem>
              <DropdownItem>Sign out</DropdownItem>
            </DropdownContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
