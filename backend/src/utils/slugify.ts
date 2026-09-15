/**
 * Turns a category's English name into a URL/JSON-safe key
 * (e.g. "Beach Bags" -> "beach-bags"). Falls back to a generic
 * slug if the input has no latin characters to work with.
 */
export function slugify(input: string): string {
  const slug = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "category";
}
