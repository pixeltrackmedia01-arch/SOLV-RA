/**
 * ─────────────────────────────────────────────────────────────
 *  BRAND & SITE CONFIGURATION — edit this file first.
 * ─────────────────────────────────────────────────────────────
 *  Everything brand-specific (name, URL, announcement, social
 *  links, contact details, commerce flags) lives here so the
 *  rest of the codebase never hard-codes it.
 *
 *  Items marked PLACEHOLDER are not real business facts and
 *  must be replaced before launch.
 */

export const site = {
  /** Full brand name, used in titles, metadata and the footer. */
  name: "Crab Appliances",
  /** Short name used as the product-name prefix ("Crab Pop") and in the wordmark. */
  shortName: "Crab",
  /** Second line of the wordmark. */
  wordmarkSub: "Appliances",
  tagline: "A little color for your everyday.",
  description:
    "Crab Appliances makes cheerful, retro-inspired kitchen appliances — toasters, kettles, blenders, mixers and more — in ten counter-worthy colors.",

  /**
   * Canonical site URL. Set NEXT_PUBLIC_SITE_URL in your hosting
   * environment (e.g. https://www.crabappliances.com). The fallback
   * uses the reserved `.example` TLD so it can never point at a
   * real third-party site.
   */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.crabappliances.example").replace(/\/$/, ""),

  locale: "en_IN",

  /** Slim bar above the header. Set `enabled: false` to hide it. */
  announcement: {
    enabled: true,
    text: "Ten colors, one cheerful counter. Meet the full palette",
    href: "/shop",
  },

  /** Default social-sharing image (1200 × 630). */
  ogImage: "/og.jpg",

  /**
   * PLACEHOLDER social destinations. These point at platform home
   * pages, not at any account. Replace with your real profile URLs.
   */
  social: [
    { label: "Instagram", href: "https://www.instagram.com/" },
    { label: "Pinterest", href: "https://www.pinterest.com/" },
    { label: "YouTube", href: "https://www.youtube.com/" },
  ],

  /**
   * PLACEHOLDER contact details. `example.com` is a reserved domain,
   * so this address cannot reach anyone. Replace before launch.
   * Leave `email` empty to hide it entirely.
   */
  contact: {
    email: "hello@example.com",
    isPlaceholder: true,
  },

  commerce: {
    currency: "INR",
    currencyLocale: "en-IN",
    /**
     * Prices in data/products.ts are suggested launch prices, not
     * confirmed retail prices. While this is false, prices are
     * shown on the site but are NOT emitted in Product structured
     * data (search engines should only receive factual offers).
     */
    pricesConfirmed: false,
    /** Cart quantity bounds per line item. */
    maxQuantity: 10,
  },

  /**
   * Shown on product pages while specs and prices are provisional.
   * Set to an empty string once details are confirmed by the manufacturer.
   */
  prelaunchNotice:
    "Pre-launch details: prices and specifications are provisional and may change before release.",

  /** Newsletter: no provider is connected — see components/newsletter/NewsletterForm.tsx. */
  newsletter: {
    providerConnected: false,
  },
} as const;

export type Site = typeof site;

/** Brand-prefixed display name, e.g. "Crab Pop". */
export function brandName(productName: string) {
  return `${site.shortName} ${productName}`;
}

export function absoluteUrl(path = "/") {
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}
