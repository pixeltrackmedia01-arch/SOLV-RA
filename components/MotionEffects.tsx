"use client";

/**
 * One small motion engine for the whole site (no libraries):
 *  [data-reveal]          fade/slide in when scrolled into view ("clip" variant wipes images open)
 *  [data-split]           headline words rise in one by one (see SplitText)
 *  [data-stagger]         children with [data-reveal] get an increasing delay
 *  [data-parallax="0.12"] element drifts against the scroll
 *  [data-tilt]            3D tilt following the pointer (mouse only)
 *  [data-magnetic]        nudges toward the pointer (mouse only)
 *  --scroll-skew          root variable driven by scroll velocity (used by the marquee)
 * Everything is progressive: content is visible without JS, and
 * prefers-reduced-motion disables all of it.
 */

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function MotionEffects() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const cleanups: (() => void)[] = [];

    // Stagger indices
    document.querySelectorAll<HTMLElement>("[data-stagger]").forEach((parent) => {
      parent.querySelectorAll<HTMLElement>(":scope > [data-reveal], :scope > * > [data-reveal]").forEach((el, i) => {
        el.style.setProperty("--i", String(i));
      });
    });

    // Reveals
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible), [data-split]:not(.is-visible)"),
    );
    if (reduce || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-visible"));
    } else {
      // A fully clipped element has no visible area, so clip reveals are
      // triggered by their container instead of themselves.
      const proxyFor = new Map<Element, HTMLElement[]>();
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            const linked = proxyFor.get(e.target);
            if (linked) linked.forEach((el) => el.classList.add("is-visible"));
            else e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.06 },
      );
      targets.forEach((el) => {
        if (el.dataset.reveal === "clip" && el.parentElement) {
          const parent = el.parentElement;
          proxyFor.set(parent, [...(proxyFor.get(parent) ?? []), el]);
          io.observe(parent);
        } else io.observe(el);
      });
      cleanups.push(() => io.disconnect());
    }

    if (!reduce) {
      // Parallax + scroll-velocity skew share one rAF loop
      const parallax = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
      const root = document.documentElement;
      let lastY = window.scrollY;
      let skew = 0;
      let raf = 0;
      let running = false;

      const tick = () => {
        const y = window.scrollY;
        const v = y - lastY;
        lastY = y;
        skew += (Math.max(-12, Math.min(12, v * 0.35)) - skew) * 0.18;
        if (Math.abs(skew) < 0.02) skew = 0;
        root.style.setProperty("--scroll-skew", `${skew.toFixed(2)}deg`);

        const vh = window.innerHeight;
        for (const el of parallax) {
          const r = el.getBoundingClientRect();
          if (r.bottom < -200 || r.top > vh + 200) continue;
          const speed = Number(el.dataset.parallax) || 0.1;
          const offset = (r.top + r.height / 2 - vh / 2) * -speed;
          el.style.setProperty("--py", `${offset.toFixed(1)}px`);
        }
        if (skew !== 0) raf = requestAnimationFrame(tick);
        else running = false;
      };
      const onScroll = () => {
        if (!running) {
          running = true;
          raf = requestAnimationFrame(tick);
        }
      };
      tick();
      window.addEventListener("scroll", onScroll, { passive: true });
      cleanups.push(() => {
        window.removeEventListener("scroll", onScroll);
        cancelAnimationFrame(raf);
        root.style.removeProperty("--scroll-skew");
      });
    }

    if (!reduce && fine) {
      // Tilt
      document.querySelectorAll<HTMLElement>("[data-tilt]").forEach((el) => {
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          el.style.setProperty("--rx", `${(-y * 7).toFixed(2)}deg`);
          el.style.setProperty("--ry", `${(x * 9).toFixed(2)}deg`);
          el.style.setProperty("--mx", `${((x + 0.5) * 100).toFixed(1)}%`);
          el.style.setProperty("--my", `${((y + 0.5) * 100).toFixed(1)}%`);
        };
        const leave = () => {
          el.style.setProperty("--rx", "0deg");
          el.style.setProperty("--ry", "0deg");
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        });
      });

      // Magnetic
      document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          el.style.translate = `${(dx * 0.28).toFixed(1)}px ${(dy * 0.28).toFixed(1)}px`;
        };
        const leave = () => {
          el.style.translate = "";
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        });
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, [pathname]);

  return null;
}
