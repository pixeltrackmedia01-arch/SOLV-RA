import Image from "next/image";
import Link from "next/link";
import { articles } from "@/data/journal";
import { ArrowRight } from "@/components/Icons";
import styles from "./Home.module.css";

export function JournalPreview() {
  const [lead, ...rest] = articles;
  return (
    <section className={`container ${styles.section}`} aria-labelledby="journal-title">
      <div className={styles.sectionHead}>
        <div>
          <p className="eyebrow">From the journal</p>
          <h2 id="journal-title" className={styles.h2}>
            Notes on color & everyday rituals.
          </h2>
        </div>
        <Link href="/journal" className="text-link">
          All stories <ArrowRight size={18} />
        </Link>
      </div>
      <div className={styles.journalGrid}>
        <article className={styles.journalLead} data-reveal>
          <div className={styles.journalImage}>
            <Image src={lead.image.src} alt={lead.image.alt} width={lead.image.width} height={lead.image.height} sizes="(max-width: 860px) 100vw, 55vw" />
          </div>
          <p className={styles.journalMeta}>
            {lead.category} · {lead.readingMinutes} min read{lead.isSample && " · Sample article"}
          </p>
          <h3 className={styles.journalTitle}>
            <Link href={`/journal/${lead.slug}`}>{lead.title}</Link>
          </h3>
          <p className={styles.journalDek}>{lead.dek}</p>
        </article>
        <ol className={styles.journalList}>
          {rest.map((a, i) => (
            <li key={a.slug} data-reveal style={{ "--accent": a.accent } as React.CSSProperties}>
              <span className={styles.journalNum} aria-hidden="true">
                {String(i + 2).padStart(2, "0")}
              </span>
              <article>
                <p className={styles.journalMeta}>
                  {a.category} · {a.readingMinutes} min read{a.isSample && " · Sample article"}
                </p>
                <h3 className={styles.journalTitleSm}>
                  <Link href={`/journal/${a.slug}`}>{a.title}</Link>
                </h3>
                <p className={styles.journalDek}>{a.dek}</p>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
