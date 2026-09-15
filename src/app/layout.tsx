import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Aref_Ruqaa, Cairo, Fraunces, Jost } from "next/font/google";
import "./globals.css";

import { ToastProvider } from "@/context/ToastContext";
import Toast from "@/components/Toast";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-cairo",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jost",
  display: "swap",
});

const arefRuqaa = Aref_Ruqaa({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-aref-ruqaa",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aya's Manual",
  description: "معمول بحب في كل غرزة — Handmade crochet, made in Egypt.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`lang-ar antialiased ${cairo.variable} ${jost.variable} ${arefRuqaa.variable} ${fraunces.variable}`}
      >
        <ToastProvider>
          {children}
          <Toast />
        </ToastProvider>
      </body>
    </html>
  );
}
