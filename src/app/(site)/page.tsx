import { productService } from "@/server/services/ProductService";
import type { Product } from "@/lib/types";
import Hero from "@/components/Hero";
import ValueStrip from "@/components/ValueStrip";
import HomeFeatured from "@/components/HomeFeatured";
import HomeTeasers from "@/components/HomeTeasers";

// Products come straight from the database — always render fresh so new
// items or edits from the admin panel show up without a redeploy.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  let products: Product[] = [];

  try {
    products = await productService.getAll();
  } catch {
    // The featured strip just hides itself when there's nothing to show
  }

  return (
    <>
      <Hero products={products} />
      <ValueStrip />
      <HomeFeatured products={products} />
      <HomeTeasers />
    </>
  );
}
