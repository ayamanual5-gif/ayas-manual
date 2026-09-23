import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";

import { LangProvider } from "@/context/LangContext";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import PageTransition from "@/components/motion/PageTransition";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LangProvider>
        <AuthProvider>
          <CartProvider>
            <Header />
            <main>
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
            <CartDrawer />
          </CartProvider>
        </AuthProvider>
      </LangProvider>
    </MotionConfig>
  );
}
