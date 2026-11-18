"use client";

/**
 * Product gallery with the hero's color-flood slider effect.
 * Slide 1: product color, giant name behind the product, companions floating at depth.
 * Further slides: countertop and in-use photos. Changing slide plays the measured panel wipe.
 */

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { runWipe } from "@/lib/wipe";
import { Sparkle } from "@/components/home/Sunburst";
import styles from "./ProductSlider.module.css";

export type SliderImage = { src: string; alt: string; width: number; height: number; kind: "cutout" | "lifestyle" | "inuse" };
type Companion = { src: string };

type Props = {
  images: SliderImage[];
  word: string;
  color: string;
  ink: string;
  name: string;
  companions: Companion[];
};

const LABEL: Record<SliderImage["kind"], string> = { cutout: "Product", lifestyle: "On the counter", inuse: "In use" };
/* word, shadow, product, float, corner */
const FACTORS = [0.4, 0.3, 0.15, 0.55, 0.75];

function rand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

export function ProductSlider({ images, word, color, ink, name, companions }: Props) {
  const [active, setActive] = useState(0);
  const current = useRef(0);
  const busy = useRef(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const layerRefs = useRef<(HTMLDivElement | null)[][]>(images.map(() => []));

  const go = useCallback(
    (target: number, dir: 1 | -1) => {
      if (busy.current || target === current.current) return;
      const from = current.current;
      const A = slideRefs.current[from];
      const B = slideRefs.current[target];
      if (!A || !B) return;
      setActive(target);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        B.style.visibility = "visible";
        B.style.zIndex = "2";
        A.style.visibility = "hidden";
        A.style.zIndex = "0";
        current.current = target;
        return;
      }
      busy.current = true;
      runWipe({
        from: A,
        to: B,
        fromLayers: layerRefs.current[from],
        toLayers: layerRefs.current[target],
        factors: FACTORS,
        dir,
        width: stageRef.current?.offsetWidth ?? 600,
        onDone: () => {
          current.current = target;
          busy.current = false;
        },
      });
    },
    [],
  );

  const next = useCallback(() => go((current.current + 1) % images.length, 1), [go, images.length]);
  const prev = useCallback(() => go((current.current - 1 + images.length) % images.length, -1), [go, images.length]);

  /* Intro: first slide's layers glide in with parallax */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const W = stageRef.current?.offsetWidth ?? 600;
    layerRefs.current[0].forEach((l, i) =>
      l?.animate([{ transform: `translate3d(${FACTORS[i] * W * 0.6}px,0,0)` }, { transform: "translate3d(0,0,0)" }], {
        duration: 900,
        easing: "cubic-bezier(0.22, 0.8, 0.3, 1)",
        fill: "backwards",
      }),
    );
  }, []);

  /* Swipe / drag */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let sx = 0;
    let sy = 0;
    let tracking = false;
    const down = (e: PointerEvent) => {
      tracking = true;
      sx = e.clientX;
      sy = e.clientY;
    };
    const up = (e: PointerEvent) => {
      if (!tracking) return;
      tracking = false;
      const dx = e.clientX - sx;
      const dy = e.clientY - sy;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) (dx < 0 ? next : prev)();
    };
    stage.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      stage.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, [next, prev]);

  const fontSize = `min(46cqw, calc(96cqw / ${Math.max(2, word.length * 0.64)}))`;

  return (
    <div
      className={styles.wrap}
      role="region"
      aria-roledescription="carousel"
      aria-label={`${name} images`}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") next();
        if (e.key === "ArrowLeft") prev();
      }}
      style={{ "--c": color, "--c-ink": ink } as React.CSSProperties}
    >
      <div ref={stageRef} className={styles.stage}>
        {images.map((img, i) => (
          <div
            key={img.src}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            className={styles.slide}
            style={{ visibility: i === 0 ? "visible" : "hidden", zIndex: i === 0 ? 2 : 0 }}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${images.length}: ${LABEL[img.kind]}`}
            aria-hidden={i !== active}
          >
            {img.kind === "cutout" ? (
              <>
                <div className={styles.layer} ref={(el) => void (layerRefs.current[i][0] = el)} aria-hidden="true">
                  <span className={styles.word} style={{ fontSize }}>
                    {word}
                  </span>
                </div>
                <div className={styles.layer} ref={(el) => void (layerRefs.current[i][1] = el)} aria-hidden="true">
                  <span className={styles.shadow} />
                </div>
                <div className={styles.layer} ref={(el) => void (layerRefs.current[i][2] = el)}>
                  <Image src={img.src} alt={img.alt} width={img.width} height={img.height} priority sizes="(max-width: 860px) 90vw, 50vw" className={styles.product} draggable={false} />
                </div>
                <div className={styles.layer} ref={(el) => void (layerRefs.current[i][3] = el)} aria-hidden="true">
                  {companions.slice(0, 2).map((c, ci) => (
                    <div key={c.src} className={`${styles.float} ${ci === 0 ? styles.floatA : styles.floatB}`}>
                      <div
                        className={styles.bob}
                        style={{ animationDuration: `${(3.4 + rand(ci + 3) * 1.6).toFixed(2)}s`, animationDelay: `${(-rand(ci + 9) * 4).toFixed(2)}s`, "--rot": ci === 0 ? "-8deg" : "9deg" } as React.CSSProperties}
                      >
                        <Image src={c.src} alt="" width={1100} height={1100} sizes="14vw" draggable={false} />
                      </div>
                    </div>
                  ))}
                  <Sparkle className={`${styles.sparkle} ${styles.sparkleA}`} />
                  <Sparkle className={`${styles.sparkle} ${styles.sparkleB}`} />
                </div>
                <div className={styles.layer} ref={(el) => void (layerRefs.current[i][4] = el)} aria-hidden="true">
                  {companions[2] && (
                    <div className={`${styles.float} ${styles.corner}`}>
                      <Image src={companions[2].src} alt="" width={1100} height={1100} sizes="20vw" draggable={false} />
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className={styles.layer} ref={(el) => void (layerRefs.current[i][0] = el)} />
                <div className={styles.layer} ref={(el) => void (layerRefs.current[i][1] = el)} />
                <div className={styles.layer} ref={(el) => void (layerRefs.current[i][2] = el)}>
                  <Image src={img.src} alt={img.alt} width={img.width} height={img.height} loading="lazy" sizes="(max-width: 860px) 100vw, 55vw" className={styles.photo} draggable={false} />
                </div>
                <div className={styles.layer} ref={(el) => void (layerRefs.current[i][3] = el)} aria-hidden="true">
                  <span className={styles.chip}>{LABEL[img.kind]}</span>
                </div>
              </>
            )}
          </div>
        ))}

        <div className={styles.ui}>
          <p className={styles.counter} aria-hidden="true">
            {String(active + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
          </p>
          <button type="button" className={`${styles.arrow} ${styles.prev}`} onClick={prev} aria-label="Previous image" data-magnetic>
            <svg viewBox="0 0 28 28" aria-hidden="true">
              <path d="M24 14H4M12 6l-8 8 8 8" />
            </svg>
          </button>
          <button type="button" className={`${styles.arrow} ${styles.next}`} onClick={next} aria-label="Next image" data-magnetic>
            <svg viewBox="0 0 28 28" aria-hidden="true">
              <path d="M4 14h20M16 6l8 8-8 8" />
            </svg>
          </button>
        </div>
      </div>

      <ul className={styles.thumbs} aria-label="Choose image">
        {images.map((img, i) => (
          <li key={img.src}>
            <button
              type="button"
              className={styles.thumb}
              aria-pressed={i === active}
              onClick={() => go(i, i > current.current ? 1 : -1)}
            >
              <Image src={img.src} alt="" width={120} height={120} sizes="88px" />
              <span className={styles.thumbLabel}>{LABEL[img.kind]}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
