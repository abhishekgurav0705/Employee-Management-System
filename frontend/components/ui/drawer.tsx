"use client";
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "../../lib/utils";

export const Drawer = DialogPrimitive.Root;
export const DrawerTrigger = DialogPrimitive.Trigger;
export const DrawerClose = DialogPrimitive.Close;

export function DrawerContent({ className, side = "right", ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { side?: "left" | "right" }) {
  const sideClass = side === "right" ? "right-0" : "left-0";
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black/40" />
      <DialogPrimitive.Content
        className={cn(
          "fixed top-0 z-50 h-full w-full max-w-xl border border-border bg-card p-4 shadow-soft",
          sideClass,
          className
        )}
        {...props}
      />
    </DialogPrimitive.Portal>
  );
}
