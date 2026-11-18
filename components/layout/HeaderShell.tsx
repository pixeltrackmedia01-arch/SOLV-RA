"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

/**
 * On the homepage the header floats transparently over the full-bleed hero
 * and takes the hero's ink color; it turns solid once the hero scrolls away.
 */
export function HeaderShell({ className, children }: { className: string; children: ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [overlay, setOverlay] = useState(isHome);

  useEffect(() => {
    if (!isHome) {
      setOverlay(false);
      return;
    }
    let raf = 0;
    const check = () => {
      raf = 0;
      setOverlay(window.scrollY < window.innerHeight * 0.75);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isHome]);

  return (
    <header className={className} data-overlay={overlay ? "true" : undefined}>
      {children}
    </header>
  );
}
