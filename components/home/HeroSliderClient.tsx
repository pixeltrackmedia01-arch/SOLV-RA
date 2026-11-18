"use client";

/**
 * Full-viewport color-flood product slider.
 *
 * Transition (970 ms): the outgoing slide is clipped from its leading edge
 * along a measured coverage curve while its layers drift away; the incoming
 * slide's layers glide in with per-layer parallax (pieces travel farther
 * than the word). All per-frame work is done on refs — React state only
 * tracks the active index for the tabs, caption and header color.
 */

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight } from "@/components/Icons";
import { Sparkle } from "./Sunburst";
import { useShopActions } from "@/lib/useShopActions";
import styles from "./HeroSlider.module.css";

export type HeroPiece = {
  kind: "product" | "sparkle";
  src?: string;
  x: number;
  y: number;
  w: number;
  rot: number;
  layer: "fruit" | "corner";
};

export type HeroSlide = {
  id: string;
  word: string;
  bg: string;
  ink: string;
  colorName: string;
  href: string;
  title: string;
  type: string;
  price: string | null;
  main: { src: string; alt: string };
  pieces: HeroPiece[];
};

/* ── Timeline constants ─────────────────────────────────────── */
const DURATION = 970;
const AUTOPLAY_MS = 4800;
const IDLE_AFTER_INTERACTION = 6000;
const LAYERS = ["word", "shadow", "product", "fruit", "corner"] as const;
const PARALLAX = [0.4, 0.3, 0.15, 0.55, 0.75];
const COVER_T = [0, 0.031, 0.134, 0.206, 0.278, 0.34, 0.412, 0.485, 0.546, 0.583, 0.62, 0.69, 0.79, 0.85, 0.93, 1];
const COVER_C = [0, 0.006, 0.012, 0.023, 0.047, 0.07, 0.105, 0.158, 0.246, 0.55, 0.825, 0.9, 0.94, 0.956, 0.975, 1];
const INTRO_EASE = "cubic-bezier(0.22, 0.8, 0.3, 1)";

/* Floor shadows, shared by every slide: cx, cy, w, h */
const SHADOWS: [number, number, number, number][] = [
  [720, 712, 400, 34],
  [312, 655, 175, 22],
];

/* Main product box in the design frame */
const MAIN = { x: 450, y: 148, w: 540 };
const CAP_CENTER_Y = 430;

function cover(t: number) {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  let i = 0;
  while (i < COVER_T.length - 2 && t > COVER_T[i + 1]) i++;
  const k = (t - COVER_T[i]) / (COVER_T[i + 1] - COVER_T[i]);
  const s = 3 * k * k - 2 * k * k * k;
  return COVER_C[i] + (COVER_C[i + 1] - COVER_C[i]) * s;
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const easeOutQuad = (k: number) => 1 - (1 - k) * (1 - k);

/** Deterministic pseudo-random so server and client markup match. */
function rand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

const u = (n: number) => `calc(var(--u) * ${n})`;

export function HeroSliderClient({ slides }: { slides: HeroSlide[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [announce, setAnnounce] = useState("");
  const { addToCart } = useShopActions();

  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const layerRefs = useRef<(HTMLDivElement | null)[][]>(slides.map(() => []));
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const probeRef = useRef<HTMLSpanElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const barRef = useRef<HTMLSpanElement>(null);

  const current = useRef(0);
  const busy = useRef(false);
  const lastInteraction = useRef(0);
  const inView = useRef(true);
  const pausedRef = useRef(false);
  pausedRef.current = paused;

  const reduced = () =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const frameWidth = () => {
    const el = slideRefs.current[current.current]?.firstElementChild as HTMLElement | null;
    return el?.offsetWidth ?? window.innerWidth;
  };

  /* ── Word fitting: cap-line centred, long words tighten & shrink ── */
  const layoutWords = useCallback(() => {
    const stage = stageRef.current;
    const probe = probeRef.current;
    const frame = slideRefs.current[0]?.firstElementChild as HTMLElement | null;
    if (!stage || !probe || !frame) return;
    const unit = frame.offsetWidth / 1440;
    if (!unit) return;
    const mobile = stage.clientWidth <= 820 || stage.clientHeight > stage.clientWidth;
    const visible = mobile ? Math.min(1440, stage.clientWidth / unit) * 0.9 : 1400;
    const limit = mobile ? visible : 1330;
    const DEFAULT_F = 430;

    const ctx = document.createElement("canvas").getContext("2d");
    const family = getComputedStyle(probe).fontFamily;
    let capH = 0.71;
    let baseline = 0.9;
    if (ctx) {
      ctx.font = `800 100px ${family}`;
      const m = ctx.measureText("H");
      if (m.actualBoundingBoxAscent) capH = m.actualBoundingBoxAscent / 100;
      if (m.fontBoundingBoxAscent && m.fontBoundingBoxDescent) {
        const a = m.fontBoundingBoxAscent / 100;
        const d = m.fontBoundingBoxDescent / 100;
        baseline = (1 - (a + d)) / 2 + a;
      }
    }

    slides.forEach((s, i) => {
      const el = wordRefs.current[i];
      if (!el) return;
      probe.textContent = s.word;
      probe.style.letterSpacing = "0.005em";
      let ls = "0.005em";
      let F = DEFAULT_F;
      const w100 = probe.getBoundingClientRect().width;
      if ((w100 * DEFAULT_F) / 100 > limit) {
        ls = "-0.035em";
        probe.style.letterSpacing = ls;
        const t100 = probe.getBoundingClientRect().width;
        F = Math.min(DEFAULT_F, (visible / t100) * 100);
      }
      const top = CAP_CENTER_Y + (capH * F) / 2 - baseline * F;
      el.style.setProperty("--wf", F.toFixed(2));
      el.style.setProperty("--wt", top.toFixed(2));
      el.style.letterSpacing = ls;
    });
  }, [slides]);

  /* ── Underline follows the active tab ── */
  const placeBar = useCallback((i: number) => {
    const tab = tabRefs.current[i];
    const bar = barRef.current;
    if (!tab || !bar) return;
    bar.style.width = `${tab.offsetWidth}px`;
    bar.style.transform = `translateX(${tab.offsetLeft}px)`;
  }, []);

  useEffect(() => placeBar(active), [active, placeBar]);

  /* Header and page chrome pick up the active slide's ink color */
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--hero-ink", slides[active].ink);
    root.style.setProperty("--hero-bg", slides[active].bg);
  }, [active, slides]);

  useEffect(
    () => () => {
      document.documentElement.style.removeProperty("--hero-ink");
      document.documentElement.style.removeProperty("--hero-bg");
    },
    [],
  );

  /* ── Slide change ── */
  const go = useCallback(
    (target: number, dir: 1 | -1, manual: boolean) => {
      if (busy.current || target === current.current) return;
      const from = current.current;
      const A = slideRefs.current[from];
      const B = slideRefs.current[target];
      if (!A || !B) return;
      if (manual) {
        setAnnounce(`${slides[target].title}, ${slides[target].type}. Slide ${target + 1} of ${slides.length}.`);
      }
      setActive(target);

      const aLayers = layerRefs.current[from];
      const bLayers = layerRefs.current[target];

      if (reduced()) {
        B.style.visibility = "visible";
        B.style.zIndex = "2";
        A.style.visibility = "hidden";
        A.style.zIndex = "0";
        current.current = target;
        return;
      }

      busy.current = true;
      const W = frameWidth();
      bLayers.forEach((l, i) => {
        if (l) l.style.transform = `translate3d(${dir * PARALLAX[i] * W}px,0,0)`;
      });
      B.style.zIndex = "1";
      B.style.visibility = "visible";
      A.style.zIndex = "2";

      const start = performance.now();
      const step = (now: number) => {
        const t = (now - start) / DURATION;
        const c = cover(t);
        A.style.clipPath = dir > 0 ? `inset(0 ${c * 100}% 0 0)` : `inset(0 0 0 ${c * 100}%)`;
        aLayers.forEach((l) => {
          if (l) l.style.transform = `translate3d(${-dir * c * 0.14 * W}px,0,0)`;
        });
        const k = easeOutQuad(clamp01((t - 0.5) / 0.42));
        bLayers.forEach((l, i) => {
          if (l) l.style.transform = k >= 1 ? "" : `translate3d(${dir * (1 - k) * PARALLAX[i] * W}px,0,0)`;
        });
        if (t < 1 || k < 1) {
          requestAnimationFrame(step);
          return;
        }
        A.style.clipPath = "";
        A.style.visibility = "hidden";
        A.style.zIndex = "0";
        aLayers.forEach((l) => l && (l.style.transform = ""));
        B.style.zIndex = "2";
        current.current = target;
        busy.current = false;
      };
      requestAnimationFrame(step);
    },
    [slides],
  );

  const userGo = useCallback(
    (target: number, dir: 1 | -1) => {
      lastInteraction.current = Date.now();
      go(target, dir, true);
    },
    [go],
  );

  const next = useCallback(() => userGo((current.current + 1) % slides.length, 1), [userGo, slides.length]);
  const prev = useCallback(
    () => userGo((current.current - 1 + slides.length) % slides.length, -1),
    [userGo, slides.length],
  );

  /* ── Opening sequence + layout ── */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      root.removeAttribute("data-intro");
    };

    const run = () => {
      layoutWords();
      placeBar(current.current);
      if (reduced()) return finish();
      const W = frameWidth();
      layerRefs.current[0].forEach((l, i) => {
        l?.animate([{ transform: `translate3d(${PARALLAX[i] * W}px,0,0)` }, { transform: "translate3d(0,0,0)" }], {
          duration: 900,
          easing: INTRO_EASE,
          fill: "backwards",
        });
      });
      root.querySelectorAll<HTMLElement>("[data-rise]").forEach((el) => {
        const i = Number(el.dataset.rise);
        el.animate(
          [
            { opacity: 0, translate: "0 14px" },
            { opacity: 1, translate: "0 0" },
          ],
          { duration: 1000, delay: 250 + i * 80, easing: INTRO_EASE, fill: "backwards" },
        );
      });
      finish();
    };

    const failsafe = window.setTimeout(finish, 3000);
    if (document.fonts?.ready) document.fonts.ready.then(run, run);
    else run();

    const onResize = () => {
      layoutWords();
      placeBar(current.current);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.clearTimeout(failsafe);
      window.removeEventListener("resize", onResize);
    };
  }, [layoutWords, placeBar]);

  /* ── Autoplay ── */
  useEffect(() => {
    const id = window.setInterval(() => {
      if (pausedRef.current || document.hidden || !inView.current) return;
      if (Date.now() - lastInteraction.current < IDLE_AFTER_INTERACTION) return;
      if (rootRef.current?.contains(document.activeElement)) return;
      go((current.current + 1) % slides.length, 1, false);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [go, slides.length]);

  /* Pause when scrolled out of view */
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => (inView.current = e.isIntersecting), { threshold: 0.25 });
    io.observe(root);
    return () => io.disconnect();
  }, []);

  /* ── Keyboard (only while the hero is on screen) ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      if (!inView.current || document.querySelector("dialog[open]")) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      e.preventDefault();
      if (e.key === "ArrowRight") next();
      else prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  /* ── Swipe / drag ── */
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
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) next();
        else prev();
      }
    };
    stage.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      stage.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, [next, prev]);

  const s = slides[active];

  return (
    <section
      ref={rootRef}
      className={styles.hero}
      data-intro="pending"
      aria-roledescription="carousel"
      aria-label="Featured appliances"
      style={{ "--ink-c": s.ink, background: s.bg } as React.CSSProperties}
    >
      <h1 className="visually-hidden">Crab Appliances — retro-inspired kitchen appliances in ten colors</h1>

      <div ref={stageRef} className={styles.stage}>
        <span ref={probeRef} className={`${styles.word} ${styles.probe}`} aria-hidden="true" />
        {slides.map((slide, i) => (
          <section
            key={slide.id}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            className={styles.slide}
            style={{ background: slide.bg, visibility: i === 0 ? "visible" : "hidden", zIndex: i === 0 ? 2 : 0 }}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}: ${slide.title}`}
            aria-hidden={i !== active}
            inert={i !== active}
          >
            <div className={styles.frame}>
              {/* word */}
              <div className={styles.layer} ref={(el) => void (layerRefs.current[i][0] = el)} aria-hidden="true">
                <span
                  ref={(el) => {
                    wordRefs.current[i] = el;
                  }}
                  className={styles.word}
                >
                  {slide.word}
                </span>
              </div>
              {/* shadow */}
              <div className={styles.layer} ref={(el) => void (layerRefs.current[i][1] = el)} aria-hidden="true">
                {SHADOWS.map(([cx, cy, w, h]) => (
                  <span
                    key={`${cx}-${cy}`}
                    className={styles.shadow}
                    style={{ left: u(cx - w / 2), top: u(cy - h / 2), width: u(w), height: u(h) }}
                  />
                ))}
              </div>
              {/* product */}
              <div className={styles.layer} ref={(el) => void (layerRefs.current[i][2] = el)}>
                <div className={styles.main} style={{ left: u(MAIN.x), top: u(MAIN.y), width: u(MAIN.w), height: u(MAIN.w) }}>
                  <Image
                    src={slide.main.src}
                    alt={slide.main.alt}
                    width={1100}
                    height={1100}
                    sizes="(max-width: 820px) 80vw, 40vw"
                    priority={i === 0}
                    loading={i === 0 ? undefined : "lazy"}
                    draggable={false}
                  />
                </div>
              </div>
              {/* fruit + corner */}
              {(["fruit", "corner"] as const).map((layer, li) => (
                <div
                  key={layer}
                  className={`${styles.layer} ${layer === "corner" ? styles.cornerLayer : ""}`}
                  ref={(el) => void (layerRefs.current[i][3 + li] = el)}
                  aria-hidden="true"
                >
                  {slide.pieces
                    .filter((p) => p.layer === layer)
                    .map((p, pi) => {
                      const seed = i * 10 + li * 5 + pi + 1;
                      const dur = 3.2 + rand(seed) * 1.8;
                      const delay = -rand(seed + 50) * 4;
                      return (
                        <div
                          key={pi}
                          className={styles.piece}
                          style={{ left: u(p.x), top: u(p.y), width: u(p.w), height: u(p.w) }}
                        >
                          <div
                            className={styles.bob}
                            style={
                              {
                                "--rot": `${p.rot}deg`,
                                animationDuration: `${dur.toFixed(2)}s`,
                                animationDelay: `${delay.toFixed(2)}s`,
                              } as React.CSSProperties
                            }
                          >
                            {p.kind === "sparkle" ? (
                              <Sparkle className={styles.sparkle} />
                            ) : (
                              <Image
                                src={p.src!}
                                alt=""
                                width={1100}
                                height={1100}
                                sizes={layer === "corner" ? "22vw" : "14vw"}
                                loading="lazy"
                                draggable={false}
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* ── Overlay UI ── */}
      <div className={styles.ui}>
        <div className={styles.tabsWrap} data-rise="0">
          <div className={styles.tabs} role="group" aria-label="Choose a featured appliance">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                className={styles.tab}
                aria-current={i === active ? "true" : undefined}
                onClick={() => {
                  if (i === current.current) return;
                  userGo(i, i > current.current ? 1 : -1);
                }}
              >
                {slide.word}
              </button>
            ))}
            <span ref={barRef} className={styles.bar} aria-hidden="true" />
          </div>
        </div>

        <div className={styles.caption} data-rise="2">
          <p className={styles.counter}>
            <span>{String(active + 1).padStart(2, "0")}</span>
            <span className={styles.counterLine} aria-hidden="true" />
            <span>{String(slides.length).padStart(2, "0")}</span>
          </p>
          <p className={styles.name}>{s.title}</p>
          <p className={styles.meta}>
            {s.type}
            {s.price && <span className={styles.metaPrice}>{s.price}</span>}
          </p>
          <div className={styles.ctas}>
            <Link href={s.href} className={styles.shop}>
              Shop now <ArrowRight size={16} />
            </Link>
            <button type="button" className={`${styles.shop} ${styles.shopSolid}`} onClick={() => addToCart(s.id, 1)}>
              Add to cart
            </button>
          </div>
        </div>

        <button type="button" className={`${styles.arrow} ${styles.prev}`} onClick={prev} aria-label="Previous appliance" data-rise="1" data-magnetic>
          <svg viewBox="0 0 28 28" aria-hidden="true">
            <path d="M24 14H4M12 6l-8 8 8 8" />
          </svg>
        </button>
        <div className={styles.rightControls} data-rise="3">
          <button
            type="button"
            className={styles.pause}
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "Play slideshow" : "Pause slideshow"}
          >
            {paused ? (
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M4 2.5v11l9-5.5z" fill="currentColor" stroke="none" />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M5 3v10M11 3v10" />
              </svg>
            )}
          </button>
          <button type="button" className={styles.arrow} onClick={next} aria-label="Next appliance" data-magnetic>
            <svg viewBox="0 0 28 28" aria-hidden="true">
              <path d="M4 14h20M16 6l8 8-8 8" />
            </svg>
          </button>
        </div>
      </div>

      <p className="visually-hidden" role="status" aria-live="polite">
        {announce}
      </p>
    </section>
  );
}
