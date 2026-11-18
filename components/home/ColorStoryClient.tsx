"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "@/components/Icons";
import styles from "./ColorStory.module.css";

export type Chapter = {
  id: string;
  slug: string;
  title: string;
  type: string;
  colorName: string;
  hex: string;
  ink: string;
  line: string;
  image: { src: string; alt: string; width: number; height: number };
};

/**
 * Scroll-linked color story. Normal page scrolling is untouched: an
 * IntersectionObserver only tracks which chapter is centered and swaps
 * the sticky stage. Every chapter carries its own text and (on small
 * screens) its own image, so nothing depends on the animation.
 */
export function ColorStoryClient({ chapters }: { chapters: Chapter[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const i = Number((e.target as HTMLElement).dataset.index);
            if (!Number.isNaN(i)) setActive(i);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const current = chapters[active];

  return (
    <section
      className={styles.story}
      aria-labelledby="story-title"
      style={{ "--active": current.hex, "--active-ink": current.ink } as React.CSSProperties}
    >
      <div className={`container ${styles.intro}`}>
        <p className="eyebrow">The palette</p>
        <h2 id="story-title" className={styles.title}>
          Five more shades, each with a <span className="italic">personality.</span>
        </h2>
        <p className="lede">
          Each appliance is made in one signature shade, so you can match a set or mix a counter that
          feels like yours.
        </p>
      </div>

      <div className={`container ${styles.grid}`}>
        <div className={styles.stageWrap} aria-hidden="true">
          <div className={styles.stage}>
            <div className={styles.stageRing} />
            {chapters.map((c, i) => (
              <Image
                key={c.id}
                src={c.image.src}
                alt=""
                width={c.image.width}
                height={c.image.height}
                sizes="40vw"
                className={`${styles.stageImg} ${i === active ? styles.stageImgActive : ""}`}
                loading="lazy"
              />
            ))}
            <p className={styles.stageLabel}>
              <span>{current.colorName}</span>
              <span className={styles.hex}>{current.hex}</span>
            </p>
          </div>
        </div>

        <ol className={styles.chapters}>
          {chapters.map((c, i) => (
            <li
              key={c.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              data-index={i}
              className={`${styles.chapter} ${i === active ? styles.chapterActive : ""}`}
              style={{ "--c": c.hex, "--c-ink": c.ink } as React.CSSProperties}
            >
              <div className={styles.inlineMedia}>
                <Image
                  src={c.image.src}
                  alt={c.image.alt}
                  width={c.image.width}
                  height={c.image.height}
                  sizes="80vw"
                  loading="lazy"
                />
              </div>
              <p className={styles.chapterNum} aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className={styles.chapterColor}>
                <span className={styles.chip} aria-hidden="true" />
                {c.colorName}
              </h3>
              <p className={styles.chapterLine}>{c.line}</p>
              <Link href={`/shop/${c.slug}`} className="text-link">
                {c.title} {c.type.toLowerCase()} <ArrowRight size={18} />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
