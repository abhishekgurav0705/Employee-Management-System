import "./globals.css";
import type { ReactNode } from "react";
import { Inter as FontInter, Manrope as FontManrope } from "next/font/google";
import { AppShell } from "../components/layout/app-shell";
import { ToastProvider, ToastViewport } from "../components/ui/toast";
import { AuthProvider } from "../lib/auth";
import { ThemeProvider } from "../lib/theme";

const inter = FontInter({ subsets: ["latin"], variable: "--font-inter" });
const manrope = FontManrope({ subsets: ["latin"], variable: "--font-manrope" });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <body>
        <AuthProvider>
          <ThemeProvider>
            <ToastProvider>
              <AppShell>
                {children}
              </AppShell>
              <ToastViewport className="fixed top-6 right-6 z-50 w-96 max-w-[calc(100%-3rem)]" />
            </ToastProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
