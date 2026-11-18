/**
 * ─────────────────────────────────────────────────────────────
 *  JOURNAL — SAMPLE ARTICLES (editable starter content)
 * ─────────────────────────────────────────────────────────────
 *  These articles are written as placeholder editorial content
 *  for launch. They make no performance, testing or sourcing
 *  claims. Replace, edit or delete freely. `isSample: true`
 *  shows a "Sample article" label on the site.
 */

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string }
  | { type: "list"; items: string[] }
  | { type: "products"; ids: string[]; caption?: string };

export interface Article {
  slug: string;
  title: string;
  dek: string;
  category: string;
  readingMinutes: number;
  image: { src: string; alt: string; width: number; height: number };
  /** Accent color used for the article header. */
  accent: string;
  isSample: boolean;
  body: ArticleBlock[];
}

export const articles: Article[] = [
  {
    slug: "a-colorful-counter-without-the-clutter",
    title: "A colorful counter, without the clutter",
    dek: "How to pick one, two or three appliance colors that work together — and leave room to breathe.",
    category: "Color notes",
    readingMinutes: 4,
    image: {
      src: "/images/lifestyle/reheat-microwave.webp",
      alt: "Warm-cream Crab Reheat microwave on a sunlit counter beside pale wood cabinets",
      width: 1400,
      height: 1400,
    },
    accent: "#F6C445",
    isSample: true,
    body: [
      {
        type: "p",
        text: "A bright appliance can change the mood of a kitchen more quickly than a coat of paint. The trick is deciding where the color goes, and how much of it you want to live with every morning.",
      },
      { type: "h2", text: "Start with the one you use most" },
      {
        type: "p",
        text: "The kettle or toaster you reach for daily is the natural anchor. Choose its color first, then let everything else take its cue. If that piece is Poppy Red, a Warm Cream microwave nearby keeps the look calm instead of loud.",
      },
      { type: "products", ids: ["pop-toaster", "reheat-microwave"], caption: "A strong anchor and a soft neighbor." },
      { type: "h2", text: "Pick a temperature" },
      {
        type: "p",
        text: "Our palette falls loosely into warm brights, cool blues and teals, and soft neutrals. Staying mostly inside one family is an easy way to make different shapes feel like a set.",
      },
      {
        type: "list",
        items: [
          "Warm: Poppy Red, Marigold Yellow, Tangerine, Bubblegum Pink",
          "Cool: Lagoon Teal, Powder Blue, Deep Teal, Cobalt Blue",
          "Soft: Pistachio Green, Warm Cream",
        ],
      },
      { type: "h2", text: "Leave some space" },
      {
        type: "p",
        text: "Color looks best with a little room around it. Two or three appliances on display, with the rest tucked away, usually reads as intentional rather than busy.",
      },
      { type: "quote", text: "Made to earn its counter space — and to share it nicely." },
    ],
  },
  {
    slug: "the-first-ten-minutes",
    title: "The first ten minutes",
    dek: "Notes on slow mornings, small rituals and the appliances that sit at the center of them.",
    category: "Everyday rituals",
    readingMinutes: 3,
    image: {
      src: "/images/lifestyle/sunny-kettle.webp",
      alt: "Marigold-yellow Crab Sunny kettle catching morning sunlight on a kitchen counter",
      width: 1400,
      height: 1400,
    },
    accent: "#79BDE8",
    isSample: true,
    body: [
      {
        type: "p",
        text: "Most mornings follow a pattern before we have really woken up: fill the kettle, drop the bread, wait. Those few minutes are small, but they set the tone for what comes next.",
      },
      { type: "h2", text: "Make the routine pleasant to look at" },
      {
        type: "p",
        text: "We design appliances to be simple to read at a glance — a dial you can turn without thinking, a shape you recognize across the room. A cheerful color is the last piece: something to enjoy while the water heats.",
      },
      { type: "products", ids: ["sunny-kettle", "brew-coffee-maker", "pop-toaster"] },
      { type: "h2", text: "A few ideas for slower starts" },
      {
        type: "list",
        items: [
          "Set out your mug and coffee the night before.",
          "Keep the kettle and toaster within one step of each other.",
          "Give yourself one task that is not on a screen.",
        ],
      },
      {
        type: "p",
        text: "None of this needs new gear. But if something on your counter makes you smile before 8 a.m., that counts for something.",
      },
    ],
  },
  {
    slug: "why-we-design-in-color",
    title: "Why we design in color",
    dek: "Mid-century kitchens, vintage packaging and the case for appliances with personality.",
    category: "Design",
    readingMinutes: 4,
    image: {
      src: "/images/lifestyle/whisk-stand-mixer.webp",
      alt: "Pistachio-green Crab Whisk stand mixer with a stainless-steel bowl in a sunlit kitchen",
      width: 1400,
      height: 1400,
    },
    accent: "#A8BE78",
    isSample: true,
    body: [
      {
        type: "p",
        text: "For a long time, appliances came in a narrow range: white, black, steel. They were made to disappear. We think the things you use every day can do a little more than that.",
      },
      { type: "h2", text: "Borrowing from the past, carefully" },
      {
        type: "p",
        text: "Our shapes take cues from mid-century domestic design — rounded corners, ribbed sides, chrome trim and chunky dials. We keep the parts that feel warm and useful, and leave out the fussiness.",
      },
      { type: "quote", text: "Nostalgic, not dated. Cheerful, not childish." },
      { type: "h2", text: "Color with a job to do" },
      {
        type: "p",
        text: "Every Crab appliance has one signature color, chosen to sit well beside the others. Mix them, match them, or let a single piece carry the room.",
      },
      { type: "products", ids: ["whisk-stand-mixer", "whip-hand-mixer", "splash-blender"] },
      {
        type: "p",
        text: "We would rather make fewer things, in colors people genuinely want to keep out on the counter.",
      },
    ],
  },
];

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}
