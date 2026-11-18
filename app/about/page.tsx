import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { brandName, site } from "@/config/site";
import { cutout, products } from "@/data/products";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ArrowRight } from "@/components/Icons";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About",
  description: `Why ${site.name} makes everyday kitchen appliances in cheerful, retro-inspired colors.`,
  alternates: { canonical: "/about" },
  openGraph: { url: "/about" },
};

const values = [
  {
    title: "Make it cheerful",
    text: "Color is the point, not an afterthought. Each appliance gets one signature shade that looks good on its own and alongside the rest of the family.",
  },
  {
    title: "Keep it simple",
    text: "Dials you can turn without reading a manual. Clear markings. Shapes you recognize across the room.",
  },
  {
    title: "Design for the everyday",
    text: "We start with ordinary routines — the morning toast, the weekend bake, the weeknight rice — and design around them.",
  },
  {
    title: "Earn the counter space",
    text: "If it lives out on the counter, it should be something you enjoy looking at. That is the bar for everything we make.",
  },
];

export default function AboutPage() {
  return (
    <>
      <div className="container">
        <div className={styles.crumbs}>
          <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "About", href: "/about" }]} />
        </div>
        <header className={styles.hero}>
          <p className="eyebrow">Our story</p>
          <h1 className={styles.title}>
            Useful things, made <span className="italic">cheerful.</span>
          </h1>
          <p className="lede">
            {site.name} makes everyday kitchen appliances that feel expressive and worth keeping on the
            counter. We combine the warmth of mid-century domestic design with simple, modern controls.
          </p>
        </header>
      </div>

      <figure className={styles.wide}>
        <Image
          src="/images/lifestyle/countertop-collection.webp"
          alt="The Crab Appliances range lined up across a sunny kitchen counter"
          width={1536}
          height={1024}
          sizes="100vw"
          priority
        />
      </figure>

      <div className="container">
        <section className={styles.split} aria-labelledby="pov">
          <h2 id="pov" className={styles.h2}>
            A point of view, not a product line.
          </h2>
          <div className={styles.prose}>
            <p>
              For a long time, kitchen appliances were designed to disappear. We think the toaster you
              use every morning and the kettle you fill a few times a day can do more than that — they
              can make the room feel a little brighter.
            </p>
            <p>
              Our shapes borrow from vintage kitchens and packaging: rounded corners, ribbed sides,
              chrome trim and chunky dials. We keep the details that feel warm and useful, and leave out
              the fuss.
            </p>
            <p>
              The result is a small family of ten appliances in ten colors, from Poppy Red to Cobalt
              Blue, designed to be mixed, matched and kept out on show.
            </p>
          </div>
        </section>

        <section aria-labelledby="values" className={styles.valuesSection}>
          <h2 id="values" className={styles.h2}>
            What guides us
          </h2>
          <ol className={styles.values}>
            {values.map((v, i) => (
              <li key={v.title} data-reveal>
                <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="palette" className={styles.paletteSection}>
          <h2 id="palette" className={styles.h2}>
            The palette
          </h2>
          <ul className={styles.palette}>
            {products.map((p) => (
              <li key={p.id} style={{ background: p.color.hex, color: p.color.ink }}>
                <Link href={`/shop/${p.slug}`}>
                  <Image src={cutout(p).src} alt="" width={300} height={300} sizes="(max-width: 600px) 40vw, 18vw" />
                  <span className={styles.paletteName}>{p.color.name}</span>
                  <span className={styles.paletteMeta}>
                    {brandName(p.name)} · {p.color.hex}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.cta}>
          <h2 className={styles.h2}>Find your color.</h2>
          <Link href="/shop" className="btn">
            Shop all appliances <ArrowRight size={18} />
          </Link>
        </section>
      </div>
    </>
  );
}
