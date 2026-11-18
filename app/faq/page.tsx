import type { Metadata } from "next";
import Link from "next/link";
import { brandName, site } from "@/config/site";
import { getProduct, products } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { SplitText } from "@/components/SplitText";
import styles from "./faq.module.css";

export const metadata: Metadata = {
  title: "FAQ",
  description: `Answers to common questions about ${site.name} — colors, prices, orders, delivery and more.`,
  alternates: { canonical: "/faq" },
};

const sunny = getProduct("sunny-kettle")!;
const blue = getProduct("blue-kettle")!;

/* Answers only state what the site and catalog data support. Edit as policies are confirmed. */
const faqs: { q: string; a: string; group: string }[] = [
  {
    group: "The range",
    q: `What makes ${site.name} different?`,
    a: "Every appliance comes in one signature color, with retro-inspired shapes — rounded corners, ribbed sides, chrome trim — and simple dial controls designed to be read at a glance.",
  },
  {
    group: "The range",
    q: "How many colors are there?",
    a: `There are ten: ${products.map((p) => p.color.name).join(", ")}. Each appliance is made in one of them.`,
  },
  {
    group: "The range",
    q: `What is the difference between ${brandName(sunny.name)} and ${brandName(blue.name)}?`,
    a: `Both are 1.7 L cordless kettles on a 360° base. ${brandName(blue.name)} is a special edition in ${blue.color.name} and adds a temperature dial; ${brandName(sunny.name)} comes in ${sunny.color.name}. Suggested prices are ${formatPrice(sunny.price)} and ${formatPrice(blue.price)}.`,
  },
  {
    group: "Ordering",
    q: "Can I place an order today?",
    a: "Not yet. This site is a pre-launch preview: you can browse, build a cart and save a wishlist, but checkout and payments aren't connected, so no order can be placed.",
  },
  {
    group: "Ordering",
    q: "Are the prices final?",
    a: "No. Prices shown are suggested launch prices and may change before release.",
  },
  {
    group: "Ordering",
    q: "Where are my cart and wishlist saved?",
    a: "Only in your browser on this device. Nothing is sent to a server, and clearing your browser's site data removes them.",
  },
  {
    group: "Delivery & care",
    q: "Do you deliver, and how do returns work?",
    a: "Delivery regions, timeframes and returns terms are being finalized ahead of launch. The shipping and returns pages will be updated once they're confirmed.",
  },
  {
    group: "Delivery & care",
    q: "What warranty do the appliances have?",
    a: "Warranty terms are being confirmed with the manufacturer and will be published on each product page before launch.",
  },
];

export default function FaqPage() {
  const groups = [...new Set(faqs.map((f) => f.group))];
  return (
    <div className={`container ${styles.wrap}`}>
      <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "FAQ", href: "/faq" }]} />
      <header className={styles.head}>
        <h1 className={styles.title} data-split>
          <SplitText>
            Questions, <span className="italic">answered.</span>
          </SplitText>
        </h1>
        <p className="lede">Everything you might want to know before choosing your color.</p>
      </header>

      <div className={styles.layout}>
        <nav className={styles.toc} aria-label="FAQ topics">
          <ul>
            {groups.map((g) => (
              <li key={g}>
                <a href={`#${g.toLowerCase().replace(/[^a-z]+/g, "-")}`}>{g}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          {groups.map((g) => (
            <section key={g} id={g.toLowerCase().replace(/[^a-z]+/g, "-")} className={styles.group} aria-label={g}>
              <h2 className={styles.groupTitle}>{g}</h2>
              {faqs
                .filter((f) => f.group === g)
                .map((f) => (
                  <details key={f.q} className={styles.item} data-reveal>
                    <summary>{f.q}</summary>
                    <p>{f.a}</p>
                  </details>
                ))}
            </section>
          ))}
          <div className={styles.more}>
            <p>Still curious?</p>
            <Link href="/info/contact" className="btn btn--ghost">
              Contact us
            </Link>
          </div>
        </div>
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
    </div>
  );
}
