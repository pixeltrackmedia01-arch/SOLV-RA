"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { categories, cutout, getProduct } from "@/data/products";
import { ChevronDown } from "@/components/Icons";
import styles from "./Header.module.css";

/** Disclosure-pattern navigation menu for shop categories. */
export function ShopMenu() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <div
      ref={wrapRef}
      className={styles.menuWrap}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        className={styles.navLink}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
      >
        Shop <ChevronDown size={16} className={styles.chev} />
      </button>
      <div id={panelId} className={styles.menuPanel} hidden={!open}>
        <ul className={styles.menuList}>
          {categories.map((c) => {
            const p = getProduct(c.heroProductId)!;
            const img = cutout(p);
            return (
              <li key={c.slug}>
                <Link href={`/shop?category=${c.slug}`} className={styles.menuItem}>
                  <span className={styles.menuThumb} style={{ background: p.color.hex }}>
                    <Image src={img.src} alt="" width={64} height={64} sizes="64px" />
                  </span>
                  <span>
                    <span className={styles.menuName}>{c.name}</span>
                    <span className={styles.menuBlurb}>{c.blurb}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <Link href="/shop" className={`text-link ${styles.menuAll}`}>
          Shop all appliances
        </Link>
      </div>
    </div>
  );
}
