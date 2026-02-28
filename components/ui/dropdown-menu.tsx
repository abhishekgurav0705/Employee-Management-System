import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "../../lib/utils";

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  return <DropdownMenuPrimitive.Root>{children}</DropdownMenuPrimitive.Root>;
}

export const DropdownTrigger = DropdownMenuPrimitive.Trigger;

export function DropdownContent({ className, ...props }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Content
      className={cn(
        "z-50 min-w-[12rem] rounded-lg border border-border bg-card p-2 shadow-soft",
        className
      )}
      sideOffset={8}
      {...props}
    />
  );
}

export function DropdownItem({ className, ...props }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>) {
  return (
    <DropdownMenuPrimitive.Item
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-md px-2 py-2 text-sm outline-none hover:bg-muted",
        className
      )}
      {...props}
    />
  );
}
