import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";
import { products } from "@/data/products";
import { articles } from "@/data/journal";
import { infoPages } from "@/data/info";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["/", "/shop", "/about", "/journal", "/faq"].map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1 : 0.8,
  }));
  return [
    ...staticRoutes,
    ...products.map((p) => ({
      url: absoluteUrl(`/shop/${p.slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.9,
      images: p.images.map((i) => absoluteUrl(i.src)),
    })),
    ...articles.map((a) => ({
      url: absoluteUrl(`/journal/${a.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...infoPages.map((p) => ({
      url: absoluteUrl(`/info/${p.slug}`),
      changeFrequency: "yearly" as const,
      priority: 0.2,
    })),
  ];
}
