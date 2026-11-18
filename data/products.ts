/**
 * ─────────────────────────────────────────────────────────────
 *  PRODUCT CATALOG — editable source of truth for the shop.
 * ─────────────────────────────────────────────────────────────
 *  Copy, highlights, specs and prices come from the supplied
 *  "draft product-page set" for Crab Appliances.
 *
 *  ⚠ That draft states the prices are invented starting points
 *  and that specs, features, box contents and warranty terms are
 *  PROPOSED and must be confirmed with the manufacturer before
 *  publishing. Treat every value below as editable sample data.
 *
 *  Prices are stored in whole rupees (INR).
 *
 *  Images live in /public/images:
 *    products/<file>.webp   transparent cut-out (1100 × 1100)
 *    lifestyle/<file>.webp  countertop scene    (1400 × 1400)
 *  To replace a photo, overwrite the file with the same name and
 *  dimensions, or point `images` at a new path.
 */

import { readableInk } from "@/lib/color";

export type CategorySlug = "morning" | "mix-blend" | "cook-heat";
export type ColorFamily = "warm" | "cool" | "soft";
export type Availability = "available" | "preorder" | "sold-out";

export interface ProductImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** "cutout" = transparent product shot; "lifestyle" = in-scene photo. */
  kind: "cutout" | "lifestyle";
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  /** Model name without the brand prefix. Display with brandName(). */
  name: string;
  /** Product type, e.g. "Two-slice toaster". */
  type: string;
  category: CategorySlug;
  /** One-line benefit headline. */
  tagline: string;
  shortDescription: string;
  description: string;
  color: {
    name: string;
    hex: string;
    family: ColorFamily;
    /** Readable text color on top of `hex` (computed). */
    ink: string;
  };
  /** Price in whole INR. Suggested launch price — see note above. */
  price: number | null;
  compareAtPrice?: number | null;
  images: ProductImage[];
  features: string[];
  specs?: ProductSpec[];
  inTheBox?: string[];
  /**
   * Proposed warranty from the draft copy. Intentionally NOT rendered
   * on the site until confirmed by the manufacturer.
   */
  proposedWarranty?: string;
  availability: Availability;
  badge?: string;
  /** Short note explaining a variant relationship, shown on the product page. */
  variantNote?: { text: string; productId: string };
  relatedIds: string[];
}

const C = 1100; // cut-out size
const L = 1400; // lifestyle size

function imgs(file: string, product: string, color: string, lifestyleAlt: string): ProductImage[] {
  return [
    {
      src: `/images/products/${file}.webp`,
      alt: `${product} in ${color}, shown on its own`,
      width: C,
      height: C,
      kind: "cutout",
    },
    {
      src: `/images/lifestyle/${file}.webp`,
      alt: lifestyleAlt,
      width: L,
      height: L,
      kind: "lifestyle",
    },
  ];
}

type RawProduct = Omit<Product, "color"> & { color: Omit<Product["color"], "ink"> };

const raw: RawProduct[] = [
  {
    id: "pop-toaster",
    slug: "crab-pop-toaster",
    name: "Pop",
    type: "Two-slice toaster",
    category: "morning",
    tagline: "A brighter start to the day.",
    shortDescription:
      "A glossy poppy-red two-slice toaster with chrome details and a tactile browning dial.",
    description:
      "Crab Pop brings a little retro character to breakfast, with a glossy poppy-red body, chrome details and a tactile browning dial. Toast one or two slices just the way you like them, then lift them out without reaching into the slots.",
    color: { name: "Poppy Red", hex: "#E94B35", family: "warm" },
    price: 3499,
    images: imgs(
      "pop-toaster",
      "Crab Pop two-slice toaster",
      "Poppy Red",
      "Poppy-red Crab Pop toaster with chrome trim on a sunlit cream countertop",
    ),
    features: [
      "Toasts 2 slices at a time",
      "6 browning settings",
      "Cancel and auto pop-up functions",
      "Removable crumb tray for easier cleaning",
      "Cool-touch sides and non-slip feet",
    ],
    specs: [
      { label: "Power", value: "800 W" },
      { label: "Dimensions", value: "Approx. 28 × 17 × 20 cm (W × D × H)" },
    ],
    inTheBox: ["Toaster", "Instruction manual"],
    proposedWarranty: "2 years",
    availability: "available",
    relatedIds: ["sunny-kettle", "brew-coffee-maker", "blue-kettle"],
  },
  {
    id: "sunny-kettle",
    slug: "crab-sunny-electric-kettle",
    name: "Sunny",
    type: "Electric kettle",
    category: "morning",
    tagline: "A kettle with a sunny disposition.",
    shortDescription:
      "A marigold-yellow cordless kettle with a curved spout, easy-grip handle and 360° base.",
    description:
      "Crab Sunny combines a marigold-yellow finish with a curved spout and easy-grip handle. Its cordless 360° base makes it easy to lift, pour and return to the counter. Use it for tea, coffee and other everyday hot-water needs.",
    color: { name: "Marigold Yellow", hex: "#F6C445", family: "warm" },
    price: 2799,
    images: imgs(
      "sunny-kettle",
      "Crab Sunny electric kettle",
      "Marigold Yellow",
      "Marigold-yellow Crab Sunny kettle with a wood-effect handle in warm morning light",
    ),
    features: [
      "1.7 L capacity",
      "Automatic shut-off when water boils",
      "Boil-dry protection",
      "Cordless 360° power base",
      "Concealed heating element for easier cleaning",
    ],
    specs: [
      { label: "Capacity", value: "1.7 L" },
      { label: "Power", value: "1,500–1,800 W" },
      { label: "Dimensions", value: "Approx. 22 × 16 × 25 cm" },
    ],
    inTheBox: ["Kettle", "Powered base", "Instruction manual"],
    proposedWarranty: "2 years",
    availability: "available",
    variantNote: {
      text: "Prefer a bolder blue with a temperature dial? Meet the special-edition Crab Blue.",
      productId: "blue-kettle",
    },
    relatedIds: ["blue-kettle", "pop-toaster", "brew-coffee-maker"],
  },
  {
    id: "splash-blender",
    slug: "crab-splash-countertop-blender",
    name: "Splash",
    type: "Countertop blender",
    category: "mix-blend",
    tagline: "Blend something fresh.",
    shortDescription:
      "A lagoon-teal blender with a clear 1.5 L glass jar and a simple tactile control dial.",
    description:
      "With its lagoon-teal base and clear glass jar, Crab Splash is made for smoothies, shakes, sauces and everyday blending. A tactile control dial keeps operation simple, while the removable blade assembly makes cleanup easier.",
    color: { name: "Lagoon Teal", hex: "#36AFA6", family: "cool" },
    price: 4999,
    images: imgs(
      "splash-blender",
      "Crab Splash countertop blender",
      "Lagoon Teal",
      "Lagoon-teal Crab Splash blender with a glass jar on a kitchen counter",
    ),
    features: [
      "1.5 L glass jar",
      "Multiple speed settings and pulse function",
      "Stainless-steel blade assembly",
      "Easy-grip jar handle and fitted lid",
      "Non-slip feet for stability on the counter",
    ],
    specs: [
      { label: "Jar capacity", value: "1.5 L" },
      { label: "Power", value: "600–750 W" },
      { label: "Dimensions", value: "Approx. 20 × 18 × 40 cm" },
    ],
    inTheBox: ["Blender base", "Glass jar", "Lid", "Blade assembly", "Instruction manual"],
    proposedWarranty: "2 years",
    availability: "available",
    relatedIds: ["whisk-stand-mixer", "whip-hand-mixer", "brew-coffee-maker"],
  },
  {
    id: "whisk-stand-mixer",
    slug: "crab-whisk-stand-mixer",
    name: "Whisk",
    type: "Stand mixer",
    category: "mix-blend",
    tagline: "Ready when the baking mood strikes.",
    shortDescription:
      "A pistachio-green tilt-head stand mixer with a 4.5 L stainless-steel bowl.",
    description:
      "Crab Whisk pairs a pistachio-green finish with a stainless-steel bowl and a tilt-head design for easy access. Use it to whisk, beat and mix; its countertop form looks at home even when it is not in use.",
    color: { name: "Pistachio Green", hex: "#A8BE78", family: "soft" },
    price: 12999,
    images: imgs(
      "whisk-stand-mixer",
      "Crab Whisk stand mixer",
      "Pistachio Green",
      "Pistachio-green Crab Whisk stand mixer with a stainless-steel bowl and whisk attachment",
    ),
    features: [
      "4.5 L stainless-steel bowl",
      "Tilt-head design for bowl and attachment access",
      "Multiple speed settings",
      "Whisk and beater attachments",
      "Stable base for countertop use",
    ],
    specs: [
      { label: "Bowl capacity", value: "4.5 L" },
      { label: "Power", value: "800 W" },
      { label: "Dimensions", value: "Approx. 36 × 22 × 34 cm" },
    ],
    inTheBox: ["Mixer", "Bowl", "Whisk", "Beater", "Instruction manual"],
    proposedWarranty: "2 years",
    availability: "available",
    relatedIds: ["whip-hand-mixer", "splash-blender", "crisp-air-fryer"],
  },
  {
    id: "brew-coffee-maker",
    slug: "crab-brew-drip-coffee-maker",
    name: "Brew",
    type: "Drip coffee maker",
    category: "morning",
    tagline: "Make room for a slower morning.",
    shortDescription:
      "A powder-blue drip coffee maker with a glass carafe and warming plate.",
    description:
      "Crab Brew makes a fresh pot in a powder-blue retro-inspired design. The glass carafe sits on a warming plate, so coffee stays ready to pour while you ease into the day.",
    color: { name: "Powder Blue", hex: "#79BDE8", family: "cool" },
    price: 4499,
    images: imgs(
      "brew-coffee-maker",
      "Crab Brew drip coffee maker",
      "Powder Blue",
      "Powder-blue Crab Brew coffee maker with a glass carafe of fresh coffee",
    ),
    features: [
      "Approx. 1.25 L / 10-cup capacity",
      "Warming plate to help keep brewed coffee warm",
      "Removable filter basket",
      "Water-level markings",
      "Anti-drip pause for pouring mid-brew",
    ],
    specs: [
      { label: "Capacity", value: "Approx. 1.25 L / 10 cups" },
      { label: "Power", value: "750–900 W" },
      { label: "Dimensions", value: "Approx. 24 × 18 × 32 cm" },
    ],
    inTheBox: ["Coffee maker", "Glass carafe", "Filter basket", "Instruction manual"],
    proposedWarranty: "2 years",
    availability: "available",
    relatedIds: ["sunny-kettle", "pop-toaster", "blue-kettle"],
  },
  {
    id: "crisp-air-fryer",
    slug: "crab-crisp-air-fryer",
    name: "Crisp",
    type: "Air fryer",
    category: "cook-heat",
    tagline: "A countertop favorite in deep teal.",
    shortDescription:
      "A deep-teal air fryer with a pull-out basket and straightforward dial controls.",
    description:
      "Crab Crisp brings a pop of color to everyday cooking, with a pull-out basket and straightforward dial controls. Set the temperature and timer, then slide out the basket to check or serve your food.",
    color: { name: "Deep Teal", hex: "#1F6663", family: "cool" },
    price: 7999,
    images: imgs(
      "crisp-air-fryer",
      "Crab Crisp air fryer",
      "Deep Teal",
      "Deep-teal Crab Crisp air fryer with dial controls and a wood-effect drawer handle",
    ),
    features: [
      "4–4.5 L basket capacity",
      "Adjustable temperature and timer",
      "Removable non-stick basket",
      "Overheat protection",
      "Pull-out drawer for serving and cleaning",
    ],
    specs: [
      { label: "Basket capacity", value: "4–4.5 L" },
      { label: "Power", value: "1,400–1,500 W" },
      { label: "Dimensions", value: "Approx. 30 × 33 × 34 cm" },
    ],
    inTheBox: ["Air fryer", "Basket", "Instruction manual"],
    proposedWarranty: "2 years",
    availability: "available",
    relatedIds: ["rice-cooker", "reheat-microwave", "whisk-stand-mixer"],
  },
  {
    id: "whip-hand-mixer",
    slug: "crab-whip-hand-mixer",
    name: "Whip",
    type: "Hand mixer with cradle",
    category: "mix-blend",
    tagline: "A little help for your baking days.",
    shortDescription:
      "A lightweight bubblegum-pink hand mixer with stainless-steel beaters and a matching cradle.",
    description:
      "Crab Whip is a lightweight hand mixer for batters, cream and quick mixing jobs. It comes with stainless-steel beaters and a matching pink cradle that keeps the mixer supported on the counter between uses.",
    color: { name: "Bubblegum Pink", hex: "#E889A8", family: "warm" },
    price: 2499,
    images: imgs(
      "whip-hand-mixer",
      "Crab Whip hand mixer",
      "Bubblegum Pink",
      "Bubblegum-pink Crab Whip hand mixer resting in its matching countertop cradle",
    ),
    features: [
      "Multiple speed settings",
      "2 stainless-steel beaters",
      "Eject button for removing attachments",
      "Matching countertop storage cradle",
      "Compact design for easy storage",
    ],
    specs: [
      { label: "Power", value: "250–300 W" },
      { label: "Dimensions", value: "Mixer approx. 20 × 9 × 16 cm" },
    ],
    inTheBox: ["Hand mixer", "2 beaters", "Cradle", "Instruction manual"],
    proposedWarranty: "2 years",
    availability: "available",
    relatedIds: ["whisk-stand-mixer", "splash-blender", "pop-toaster"],
  },
  {
    id: "reheat-microwave",
    slug: "crab-reheat-countertop-microwave",
    name: "Reheat",
    type: "Countertop microwave",
    category: "cook-heat",
    tagline: "Everyday convenience, with a softer side.",
    shortDescription:
      "A warm-cream 20 L microwave with a dark glass door and tactile dial controls.",
    description:
      "Crab Reheat gives reheating and simple cooking a retro refresh. Its warm-cream cabinet, dark glass door and tactile controls bring a considered look to the countertop.",
    color: { name: "Warm Cream", hex: "#F5EBDD", family: "soft" },
    price: 8999,
    images: imgs(
      "reheat-microwave",
      "Crab Reheat countertop microwave",
      "Warm Cream",
      "Warm-cream Crab Reheat microwave with chrome handle and two dials on a sunny counter",
    ),
    features: [
      "20 L capacity",
      "Multiple power levels",
      "Timer control",
      "Glass turntable",
      "Child lock",
    ],
    specs: [
      { label: "Capacity", value: "20 L" },
      { label: "Input power", value: "Approx. 1,050–1,200 W" },
      { label: "Microwave output", value: "700–800 W" },
      { label: "Dimensions", value: "Approx. 44 × 34 × 26 cm" },
    ],
    inTheBox: ["Microwave", "Glass turntable", "Roller ring", "Instruction manual"],
    proposedWarranty:
      "1 year on product; additional magnetron coverage only if confirmed by the manufacturer",
    availability: "available",
    relatedIds: ["crisp-air-fryer", "rice-cooker", "brew-coffee-maker"],
  },
  {
    id: "rice-cooker",
    slug: "crab-rice-electric-rice-cooker",
    name: "Rice",
    type: "Electric rice cooker",
    category: "cook-heat",
    tagline: "Made for the everyday meal.",
    shortDescription:
      "A tangerine rice cooker with one-touch cook/warm control and a removable inner pot.",
    description:
      "Crab Rice keeps cooking simple with a one-touch cook/warm control and a removable inner pot. Its tangerine finish and stainless-steel lid make a bright companion for everyday rice and one-pot meals.",
    color: { name: "Tangerine", hex: "#F47A38", family: "warm" },
    price: 3999,
    images: imgs(
      "rice-cooker",
      "Crab Rice electric rice cooker",
      "Tangerine",
      "Tangerine Crab Rice cooker with a stainless-steel lid and wooden knob",
    ),
    features: [
      "1.8 L uncooked capacity",
      "Automatic keep-warm function",
      "Removable inner pot",
      "Simple cook and warm control",
      "Indicator light for cooking status",
    ],
    specs: [
      { label: "Capacity", value: "1.8 L uncooked (cooked yield to be confirmed)" },
      { label: "Power", value: "700 W" },
      { label: "Dimensions", value: "Approx. 28 × 28 × 27 cm" },
    ],
    inTheBox: [
      "Rice cooker",
      "Inner pot",
      "Lid",
      "Measuring cup",
      "Serving spatula",
      "Instruction manual",
    ],
    proposedWarranty: "2 years",
    availability: "available",
    relatedIds: ["crisp-air-fryer", "reheat-microwave", "sunny-kettle"],
  },
  {
    id: "blue-kettle",
    slug: "crab-blue-special-edition-kettle",
    name: "Blue",
    type: "Special-edition electric kettle",
    category: "morning",
    tagline: "The classic kettle, in a bolder color.",
    shortDescription:
      "A special-edition cobalt kettle with chrome accents and a temperature dial.",
    description:
      "Crab Blue gives the everyday kettle a cobalt finish, chrome accents and a temperature dial. The powered base keeps the kettle cordless when it is time to pour.",
    color: { name: "Cobalt Blue", hex: "#3158A5", family: "cool" },
    price: 3299,
    images: imgs(
      "blue-kettle",
      "Crab Blue special-edition kettle",
      "Cobalt Blue",
      "Cobalt-blue Crab Blue kettle with a wood-effect handle on a warm countertop",
    ),
    features: [
      "1.7 L capacity",
      "Temperature dial",
      "Automatic shut-off and boil-dry protection",
      "Cordless 360° power base",
      "Concealed heating element",
    ],
    specs: [
      { label: "Capacity", value: "1.7 L" },
      { label: "Power", value: "1,500–1,800 W" },
      { label: "Dimensions", value: "Approx. 22 × 16 × 25 cm" },
    ],
    inTheBox: ["Kettle", "Powered base", "Instruction manual"],
    proposedWarranty: "2 years",
    availability: "available",
    badge: "Special edition",
    variantNote: {
      text: "A special edition of our everyday kettle. Looking for the original? See Crab Sunny in Marigold Yellow.",
      productId: "sunny-kettle",
    },
    relatedIds: ["sunny-kettle", "brew-coffee-maker", "pop-toaster"],
  },
];

export const products: Product[] = raw.map((p) => ({
  ...p,
  color: { ...p.color, ink: readableInk(p.color.hex) },
}));

export const categories: {
  slug: CategorySlug;
  name: string;
  blurb: string;
  /** Product used as the visual anchor for the category. */
  heroProductId: string;
}[] = [
  {
    slug: "morning",
    name: "Morning",
    blurb: "Toast, tea and a fresh pot — the first hour of the day.",
    heroProductId: "sunny-kettle",
  },
  {
    slug: "mix-blend",
    name: "Mix & Blend",
    blurb: "Mixers and a blender for baking days and fresh blends.",
    heroProductId: "whisk-stand-mixer",
  },
  {
    slug: "cook-heat",
    name: "Cook & Heat",
    blurb: "Air frying, rice and reheating for everyday meals.",
    heroProductId: "crisp-air-fryer",
  },
];

export const colorFamilies: { slug: ColorFamily; name: string; swatches: string[] }[] = [
  { slug: "warm", name: "Warm brights", swatches: ["#E94B35", "#F6C445", "#F47A38"] },
  { slug: "cool", name: "Cool blues & teals", swatches: ["#36AFA6", "#79BDE8", "#3158A5"] },
  { slug: "soft", name: "Soft & neutral", swatches: ["#A8BE78", "#F5EBDD"] },
];

/** Order used when sorting by "Featured". */
export const featuredIds = ["pop-toaster", "sunny-kettle", "whisk-stand-mixer", "blue-kettle"];

export function getProduct(idOrSlug: string) {
  return products.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
}

export function getProducts(ids: string[]) {
  return ids.map((id) => getProduct(id)).filter((p): p is Product => Boolean(p));
}

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function cutout(p: Product) {
  return p.images.find((i) => i.kind === "cutout") ?? p.images[0];
}

export function lifestyle(p: Product) {
  return p.images.find((i) => i.kind === "lifestyle") ?? p.images[0];
}
