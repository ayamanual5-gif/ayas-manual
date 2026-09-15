import { fetchCategories, fetchProducts } from "@/lib/api";
import type { Category, Product } from "@/lib/types";
import { cssVars } from "@/lib/cssVars";
import Hero from "@/components/Hero";
import ValueStrip from "@/components/ValueStrip";
import ShopSection from "@/components/ShopSection";
import AboutSection from "@/components/AboutSection";
import CustomOrderSection from "@/components/CustomOrderSection";
import NewsletterSection from "@/components/NewsletterSection";

const fallbackCategories: Category[] = [{ key: "all", ar: "الكل", en: "All" }];

export default async function HomePage() {
  let products: Product[] = [];
  let categories: Category[] = fallbackCategories;
  let loadError = false;

  try {
    [products, categories] = await Promise.all([fetchProducts(), fetchCategories()]);
  } catch {
    loadError = true;
  }

  return (
    <>
      <Hero />
      <ValueStrip />
      <ShopSection products={products} categories={categories} loadError={loadError} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="stitch-rule" style={cssVars({ "--dot": "var(--olive)" })} />
      </div>
      <AboutSection />
      <div className="scallop scallop-up" style={cssVars({ "--edge": "var(--olive)" })} />
      <CustomOrderSection categories={categories} />
      <NewsletterSection />
    </>
  );
}
