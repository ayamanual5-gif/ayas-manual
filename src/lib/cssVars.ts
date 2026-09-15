import type { CSSProperties } from "react";

/**
 * Small typed helper for setting CSS custom properties (e.g. `--edge`, `--dot`)
 * via inline `style`, without sprinkling `as CSSProperties` casts everywhere.
 */
export function cssVars(vars: Record<string, string>): CSSProperties {
  return vars as CSSProperties;
}
