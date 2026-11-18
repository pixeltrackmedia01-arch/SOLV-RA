import { absoluteUrl, brandName, site } from "@/config/site";
import type { Product } from "@/data/products";

export type Crumb = { name: string; href: string };

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: site.name,
    url: site.url,
    logo: absoluteUrl("/icon.svg"),
    description: site.description,
    // Social profiles are intentionally omitted until real URLs replace the placeholders.
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: site.name,
    url: site.url,
    publisher: { "@id": absoluteUrl("/#organization") },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${absoluteUrl("/shop")}?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.href),
    })),
  };
}

const availabilityMap: Record<Product["availability"], string> = {
  available: "https://schema.org/InStock",
  preorder: "https://schema.org/PreOrder",
  "sold-out": "https://schema.org/OutOfStock",
};

export function productLd(p: Product) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": absoluteUrl(`/shop/${p.slug}#product`),
    name: brandName(p.name),
    description: p.description,
    sku: p.id,
    category: p.type,
    color: p.color.name,
    image: p.images.map((i) => absoluteUrl(i.src)),
    url: absoluteUrl(`/shop/${p.slug}`),
    brand: { "@type": "Brand", name: site.name },
  };
  // Offers are only emitted once prices are confirmed (see config/site.ts).
  // No ratings or reviews are emitted: none exist.
  if (site.commerce.pricesConfirmed && p.price != null) {
    data.offers = {
      "@type": "Offer",
      price: p.price.toFixed(2),
      priceCurrency: site.commerce.currency,
      availability: availabilityMap[p.availability],
      url: absoluteUrl(`/shop/${p.slug}`),
    };
  }
  return data;
}
