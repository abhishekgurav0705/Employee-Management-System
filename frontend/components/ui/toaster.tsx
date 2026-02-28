"use client";
import * as React from "react";
import { ToastProvider, ToastViewport } from "./toast";

export function Toaster() {
  return (
    <ToastProvider>
      <ToastViewport className="fixed top-6 right-6 z-50 w-96 max-w-[calc(100%-3rem)]" />
    </ToastProvider>
  );
}
