import Image from "next/image";
import Link from "next/link";
import { site } from "@/config/site";
import { ArrowRight } from "@/components/Icons";
import styles from "./Home.module.css";

const principles = [
  {
    title: "Color with a job to do",
    text: "One signature shade per appliance, chosen to look good alone or alongside the rest.",
  },
  {
    title: "Controls you can feel",
    text: "Chunky dials and simple switches you can read at a glance, even before coffee.",
  },
  {
    title: "Built around routines",
    text: "Toast, tea, a weekend bake, a weeknight dinner — the everyday moments come first.",
  },
];

export function BrandStory() {
  return (
    <section className={`container ${styles.section}`} aria-labelledby="brand-title">
      <div className={styles.brandGrid}>
        <div className={styles.brandCopy} data-reveal>
          <p className="eyebrow">Why {site.shortName}</p>
          <h2 id="brand-title" className={styles.brandStatement}>
            The things you use every day should be a <span className="italic">pleasure</span> to look at.
          </h2>
          <p className="lede">
            We borrow the warmth of mid-century kitchens — rounded corners, ribbed sides, chrome trim —
            and pair it with straightforward controls for how people cook today.
          </p>
          <Link href="/about" className="text-link">
            Read our story <ArrowRight size={18} />
          </Link>
        </div>
        <figure className={styles.brandFigure} data-reveal>
          <Image
            src="/images/lifestyle/countertop-collection.webp"
            alt="The full Crab Appliances range in ten colors lined up on a sunlit cream kitchen counter"
            width={1536}
            height={1024}
            sizes="(max-width: 860px) 100vw, 55vw"
          />
          <figcaption>The full range, from Poppy Red to Cobalt Blue.</figcaption>
        </figure>
      </div>
      <ul className={styles.principles}>
        {principles.map((p, i) => (
          <li key={p.title} data-reveal>
            <span className={styles.principleNum} aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3>{p.title}</h3>
            <p>{p.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
