"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { brandName } from "@/config/site";
import { categories, cutout, getProduct, lifestyle, products } from "@/data/products";
import { formatPrice } from "@/lib/format";
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
        <div className={styles.mega}>
          {categories.map((c) => {
            const items = products.filter((p) => p.category === c.slug);
            return (
              <div key={c.slug} className={styles.megaCol}>
                <Link href={`/shop?category=${c.slug}`} className={styles.megaHead}>
                  {c.name} <span className={styles.megaCount}>{items.length}</span>
                </Link>
                <ul className={styles.megaList}>
                  {items.map((p) => (
                    <li key={p.id}>
                      <Link href={`/shop/${p.slug}`} className={styles.megaItem}>
                        <span className={styles.megaThumb} style={{ background: p.color.hex }}>
                          <Image src={cutout(p).src} alt="" width={56} height={56} sizes="56px" />
                        </span>
                        <span className={styles.megaText}>
                          <span className={styles.megaName}>{brandName(p.name)}</span>
                          <span className={styles.megaType}>
                            {p.type} · {p.color.name}
                          </span>
                        </span>
                        <span className={styles.megaPrice}>{formatPrice(p.price)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
          <FeaturedTile />
        </div>
        <div className={styles.megaFoot}>
          <Link href="/shop" className="text-link">
            Shop all {products.length} appliances
          </Link>
          <Link href="/wishlist" className="text-link">
            Your wishlist
          </Link>
        </div>
      </div>
    </div>
  );
}

function FeaturedTile() {
  const p = getProduct("blue-kettle")!;
  const img = lifestyle(p);
  return (
    <Link href={`/shop/${p.slug}`} className={styles.megaFeature}>
      <span className={styles.megaFeatureImg}>
        <Image src={img.src} alt="" width={400} height={400} sizes="240px" />
      </span>
      <span className={styles.megaFeatureTag}>{p.badge ?? "Featured"}</span>
      <span className={styles.megaName}>{brandName(p.name)}</span>
      <span className={styles.megaType}>{p.type}</span>
    </Link>
  );
}
