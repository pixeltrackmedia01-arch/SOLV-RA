import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/config/site";
import { articles } from "@/data/journal";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import styles from "./journal.module.css";

export const metadata: Metadata = {
  title: "Journal",
  description: `Stories from ${site.name} on color, design and everyday kitchen rituals.`,
  alternates: { canonical: "/journal" },
  openGraph: { url: "/journal" },
};

export default function JournalPage() {
  return (
    <div className="container">
      <div className={styles.crumbs}>
        <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Journal", href: "/journal" }]} />
      </div>
      <header className={styles.head}>
        <h1 className={styles.title}>
          The <span className="italic">Journal</span>
        </h1>
        <p className="lede">Notes on color, design and the small rituals that happen around the counter.</p>
        <p className={styles.sampleNote}>
          These are sample articles — editable starter content for launch.
        </p>
      </header>
      <ul className={styles.list}>
        {articles.map((a, i) => (
          <li key={a.slug} className={i === 0 ? styles.lead : styles.item} data-reveal>
            <article className={styles.card} style={{ "--accent": a.accent } as React.CSSProperties}>
              <div className={styles.media}>
                <Image
                  src={a.image.src}
                  alt={a.image.alt}
                  width={a.image.width}
                  height={a.image.height}
                  sizes={i === 0 ? "(max-width: 860px) 100vw, 60vw" : "(max-width: 860px) 100vw, 45vw"}
                  priority={i === 0}
                />
              </div>
              <div className={styles.body}>
                <p className={styles.meta}>
                  <span className={styles.cat}>{a.category}</span> · {a.readingMinutes} min read
                  {a.isSample && <span className={styles.sample}>Sample article</span>}
                </p>
                <h2 className={styles.cardTitle}>
                  <Link href={`/journal/${a.slug}`}>{a.title}</Link>
                </h2>
                <p className={styles.dek}>{a.dek}</p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
