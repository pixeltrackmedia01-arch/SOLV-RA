import type { Product } from "@/data/products";
import { categories } from "@/data/products";
import { brandName } from "@/config/site";

/** Lightweight client-side product search across name, type, color and category. */
export function searchProducts(list: Product[], query: string) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return list;
  return list.filter((p) => {
    const cat = categories.find((c) => c.slug === p.category)?.name ?? "";
    const haystack = [brandName(p.name), p.type, p.tagline, p.color.name, p.color.family, cat, p.shortDescription, p.badge ?? ""]
      .join(" ")
      .toLowerCase();
    return terms.every((t) => haystack.includes(t));
  });
}
