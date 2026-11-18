"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { brandName } from "@/config/site";
import { categories, cutout, products } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { useModalDialog } from "@/lib/useModalDialog";
import { CloseIcon, MenuIcon } from "@/components/Icons";
import { Wordmark } from "@/components/Wordmark";
import styles from "./Header.module.css";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const ref = useModalDialog(open, () => setOpen(false));
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        className={`${styles.iconBtn} ${styles.menuBtn}`}
        aria-label="Open menu"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <MenuIcon />
      </button>
      <dialog ref={ref} className={styles.mobileNav} aria-label="Site menu">
        <div className={styles.mobileTop}>
          <Wordmark />
          <button type="button" className={styles.iconBtn} onClick={close} aria-label="Close menu">
            <CloseIcon />
          </button>
        </div>
        <nav aria-label="Mobile">
          <p className={styles.mobileHeading}>Shop</p>
          <Link href="/shop" onClick={close} className={styles.mobileAll}>
            All {products.length} appliances
          </Link>
          {categories.map((c) => (
            <details key={c.slug} className={styles.mobileGroup}>
              <summary>{c.name}</summary>
              <ul className={styles.mobileItems}>
                {products
                  .filter((p) => p.category === c.slug)
                  .map((p) => (
                    <li key={p.id}>
                      <Link href={`/shop/${p.slug}`} onClick={close}>
                        <span className={styles.megaThumb} style={{ background: p.color.hex }}>
                          <Image src={cutout(p).src} alt="" width={48} height={48} sizes="48px" />
                        </span>
                        <span className={styles.megaText}>
                          <span className={styles.megaName}>{brandName(p.name)}</span>
                          <span className={styles.megaType}>
                            {p.type} · {formatPrice(p.price)}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </details>
          ))}
          <ul className={`${styles.mobileList} ${styles.mobileListMain}`}>
            <li>
              <Link href="/about" onClick={close}>
                About
              </Link>
            </li>
            <li>
              <Link href="/journal" onClick={close}>
                Journal
              </Link>
            </li>
            <li>
              <Link href="/wishlist" onClick={close}>
                Wishlist
              </Link>
            </li>
            <li>
              <Link href="/faq" onClick={close}>
                FAQ
              </Link>
            </li>
          </ul>
        </nav>
      </dialog>
    </>
  );
}
