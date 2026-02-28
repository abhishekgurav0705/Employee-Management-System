use client;
import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cn } from "../../lib/utils";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return <ToastPrimitives.Provider duration={2500}>{children}</ToastPrimitives.Provider>;
}

export function ToastRoot({ className, ...props }: React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root>) {
  return (
    <ToastPrimitives.Root
      className={cn(
        "grid grid-flow-row gap-1 rounded-lg border border-border bg-card px-4 py-3 shadow-soft",
        className
      )}
      {...props}
    />
  );
}

export const ToastTitle = ToastPrimitives.Title;
export const ToastDescription = ToastPrimitives.Description;
export const ToastViewport = ToastPrimitives.Viewport;
