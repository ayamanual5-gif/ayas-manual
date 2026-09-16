// Shared Framer Motion variants for the storefront. Every animation here only
// touches transform/opacity so it stays GPU-friendly and never triggers layout.
export const EASE = [0.22, 1, 0.36, 1] as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5, ease: EASE } },
};

export const staggerContainer = (stagger = 0.1, delayChildren = 0.04) => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});
