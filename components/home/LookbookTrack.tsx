"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "@/components/Icons";
import styles from "./Lookbook.module.css";

export type LookItem = {
  id: string;
  href: string;
  name: string;
  type: string;
  color: string;
  hex: string;
  price: string | null;
  img: { src: string; alt: string };
};

/** Horizontal gallery: native scroll + snap, mouse drag, cursor-follow label, progress bar. */
export function LookbookTrack({ items }: { items: LookItem[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const drag = useRef({ down: false, x: 0, left: 0, moved: false });

  useEffect(() => {
    const t = trackRef.current;
    if (!t) return;
    const onScroll = () => {
      const max = t.scrollWidth - t.clientWidth;
      setProgress(max > 0 ? t.scrollLeft / max : 0);
    };
    onScroll();
    t.addEventListener("scroll", onScroll, { passive: true });
    return () => t.removeEventListener("scroll", onScroll);
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    const t = trackRef.current;
    if (!t) return;
    const card = t.querySelector("li");
    t.scrollBy({ left: dir * ((card?.clientWidth ?? 300) + 20), behavior: "smooth" });
  };

  return (
    <div className={styles.wrap}>
      <ul
        ref={trackRef}
        className={styles.track}
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse") return;
          drag.current = { down: true, x: e.clientX, left: trackRef.current!.scrollLeft, moved: false };
        }}
        onPointerMove={(e) => {
          const c = cursorRef.current;
          if (c) c.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
          const d = drag.current;
          if (!d.down) return;
          const dx = e.clientX - d.x;
          if (Math.abs(dx) > 4) d.moved = true;
          trackRef.current!.scrollLeft = d.left - dx;
          trackRef.current!.classList.add(styles.dragging);
        }}
        onPointerUp={() => {
          drag.current.down = false;
          trackRef.current?.classList.remove(styles.dragging);
        }}
        onPointerLeave={() => {
          drag.current.down = false;
          trackRef.current?.classList.remove(styles.dragging);
        }}
        onClickCapture={(e) => {
          if (drag.current.moved) {
            e.preventDefault();
            e.stopPropagation();
            drag.current.moved = false;
          }
        }}
      >
        {items.map((it, i) => (
          <li key={it.id} className={styles.card} style={{ "--hex": it.hex } as React.CSSProperties}>
            <Link href={it.href} className={styles.link} draggable={false}>
              <span className={styles.media}>
                <Image src={it.img.src} alt={it.img.alt} width={1122} height={1402} sizes="(max-width: 700px) 75vw, 28vw" draggable={false} />
                <span className={styles.tag}>
                  <span className={styles.tagDot} aria-hidden="true" />
                  {it.color}
                </span>
              </span>
              <span className={styles.meta}>
                <span className={styles.num} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={styles.name}>{it.name}</span>
                <span className={styles.type}>
                  {it.type}
                  {it.price && ` · ${it.price}`}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className={`container ${styles.controls}`}>
        <div className={styles.progress} aria-hidden="true">
          <span style={{ transform: `scaleX(${0.12 + progress * 0.88})` }} />
        </div>
        <div className={styles.arrows}>
          <button type="button" onClick={() => scrollBy(-1)} aria-label="Scroll gallery left" data-magnetic>
            <ArrowRight size={20} style={{ transform: "rotate(180deg)" }} />
          </button>
          <button type="button" onClick={() => scrollBy(1)} aria-label="Scroll gallery right" data-magnetic>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>

      <div ref={cursorRef} className={styles.cursor} aria-hidden="true">
        <span>View</span>
      </div>
    </div>
  );
}
