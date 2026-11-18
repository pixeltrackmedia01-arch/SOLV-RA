"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/config/site";
import styles from "./Header.module.css";

/** Rotating announcement messages. Pauses on hover/focus; static with reduced motion. */
export function AnnouncementBar() {
  const msgs = site.announcement.messages;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || msgs.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % msgs.length), 4500);
    return () => window.clearInterval(id);
  }, [paused, msgs.length]);

  if (!site.announcement.enabled) return null;
  const m = msgs[i];
  return (
    <div
      className={styles.announcement}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <Link key={i} href={m.href} className={styles.announceMsg}>
        {m.text} <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
