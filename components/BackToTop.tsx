"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "./Icons";
import styles from "./BackToTop.module.css";

export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setShow(window.scrollY > window.innerHeight * 1.5);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button
      type="button"
      className={`${styles.btn} ${show ? styles.show : ""}`}
      onClick={() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
        document.getElementById("main")?.focus({ preventScroll: true });
      }}
      aria-label="Back to top"
      data-magnetic
      tabIndex={show ? 0 : -1}
      aria-hidden={!show}
    >
      <ArrowUp size={20} />
    </button>
  );
}
