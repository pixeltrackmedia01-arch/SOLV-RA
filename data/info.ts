/**
 * Help & legal pages.
 * ⚠ PLACEHOLDER CONTENT — these pages describe what each policy will
 * cover but intentionally make no delivery, returns or legal promises.
 * Replace with your real, reviewed policies before launch.
 */

export interface InfoPage {
  slug: string;
  title: string;
  group: "help" | "legal" | "contact";
  description: string;
  body: string[];
}

export const infoPages: InfoPage[] = [
  {
    slug: "shipping",
    title: "Shipping",
    group: "help",
    description: "Shipping information for Crab Appliances orders.",
    body: [
      "Our shipping policy is being finalized ahead of launch.",
      "This page will cover delivery regions, timeframes, costs and order tracking once they are confirmed. Until then, no delivery times or shipping prices are being offered.",
    ],
  },
  {
    slug: "returns",
    title: "Returns",
    group: "help",
    description: "Returns and exchanges for Crab Appliances products.",
    body: [
      "Our returns policy is being finalized ahead of launch.",
      "This page will explain return windows, eligible condition, how to start a return and how refunds are issued once those terms are confirmed.",
    ],
  },
  {
    slug: "contact",
    title: "Contact",
    group: "contact",
    description: "How to get in touch with Crab Appliances.",
    body: [
      "Customer support channels are being set up ahead of launch.",
      "In the meantime, you can browse the shop or read the journal. Contact details will be published here once they are live.",
    ],
  },
  {
    slug: "privacy",
    title: "Privacy",
    group: "legal",
    description: "Crab Appliances privacy policy.",
    body: [
      "Our privacy policy is being prepared ahead of launch.",
      "This demo storefront does not create accounts, process payments or send newsletter sign-ups to any service. Your cart is saved only in your own browser's local storage and can be cleared at any time by emptying the cart or clearing site data.",
    ],
  },
  {
    slug: "terms",
    title: "Terms",
    group: "legal",
    description: "Crab Appliances terms of use.",
    body: [
      "Our terms of use are being prepared ahead of launch.",
      "This site is currently a demonstration storefront. Product details and prices are provisional, and no orders can be placed.",
    ],
  },
];

export function getInfoPage(slug: string) {
  return infoPages.find((p) => p.slug === slug);
}
