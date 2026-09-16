"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLang } from "@/context/LangContext";
import TeaserProductCard from "./TeaserProductCard";
import Reveal from "./motion/Reveal";
import { StaggerContainer } from "./motion/Stagger";
import { EASE } from "./motion/variants";
import type { Product } from "@/lib/types";

export default function HomeFeatured({ products }: { products: Product[] }) {
  const { t } = useLang();
  const featured = products.slice(0, 4);

  if (featured.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-xl">
          <span className="eyebrow" style={{ color: "var(--rose)" }}>
            {t("home.shopTeaserEyebrow")}
          </span>
          <h2 className="font-display mt-2 text-3xl sm:text-4xl" style={{ color: "var(--teal)" }}>
            {t("home.shopTeaserTitle")}
          </h2>
        </div>
        <Link href="/shop" className="btn btn-outline px-6 py-3 whitespace-nowrap hidden sm:inline-flex">
          {t("home.shopTeaserCta")}
        </Link>
      </Reveal>

      <StaggerContainer className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {featured.map((product) => (
          <TeaserProductCard key={product.id} product={product} />
        ))}
      </StaggerContainer>

      <Reveal delay={0.1} className="mt-12 sm:mt-14 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: EASE }}
          className="card px-6 py-10 sm:py-12"
        >
          <h3 className="font-display text-2xl sm:text-3xl" style={{ color: "var(--teal)" }}>
            {t("home.shopMoreTitle")}
          </h3>
          <p className="mt-2 max-w-md mx-auto" style={{ color: "var(--ink-soft)" }}>
            {t("home.shopMoreBody")}
          </p>
          <motion.div className="mt-6 inline-block" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} transition={{ duration: 0.18, ease: EASE }}>
            <Link href="/shop" className="btn btn-primary px-8 py-3.5 inline-flex">
              {t("home.shopMoreCta")}
            </Link>
          </motion.div>
        </motion.div>
      </Reveal>
    </section>
  );
}
