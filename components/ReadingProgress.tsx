"use client";

import { useEffect, useRef } from "react";

/** Thin bar along the top of the viewport showing how far through the article you are. */
export function ReadingProgress({ color }: { color: string }) {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = document.querySelector("article");
      if (!el || !bar.current) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 1;
      bar.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return (
    <div
      ref={bar}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        zIndex: 80,
        background: color,
        transformOrigin: "left",
        transform: "scaleX(0)",
        boxShadow: "0 0 0 1px rgb(27 23 20 / 0.08)",
      }}
    />
  );
}
