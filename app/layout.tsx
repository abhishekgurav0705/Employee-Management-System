import "./globals.css";
import type { ReactNode } from "react";
import { Inter as FontInter, Manrope as FontManrope } from "next/font/google";
import { AppShell } from "../components/layout/app-shell";
// import { Toaster } from "../components/ui/toaster";

const inter = FontInter({ subsets: ["latin"], variable: "--font-inter" });
const manrope = FontManrope({ subsets: ["latin"], variable: "--font-manrope" });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <body>
        <AppShell>
          {children}
        </AppShell>
        {/* <Toaster /> */}
      </body>
    </html>
  );
}
