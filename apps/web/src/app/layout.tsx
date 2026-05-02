import "./globals.css";
import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import type { ReactNode } from "react";
import { AuthProvider } from "../lib/auth/auth-context";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"]
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700", "800"]
});

export const metadata: Metadata = {
  title: "İL & AY — POS sistemi",
  description: "İL & AY cehizlik mağazası üçün POS, anbar və idarəetmə sistemi"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="az" className={`${display.variable} ${body.variable}`}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}