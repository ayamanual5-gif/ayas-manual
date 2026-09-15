import type { ReactNode } from "react";

import { LangProvider } from "@/context/LangContext";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <LangProvider>
      <CartProvider>
        <Header />
        <main>{children}</main>
        <Footer />
        <CartDrawer />
      </CartProvider>
    </LangProvider>
  );
}
