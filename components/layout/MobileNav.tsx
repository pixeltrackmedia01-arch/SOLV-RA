"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { categories } from "@/data/products";
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
          <ul className={styles.mobileList}>
            <li>
              <Link href="/shop" onClick={close}>
                All appliances
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/shop?category=${c.slug}`} onClick={close}>
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
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
          </ul>
        </nav>
      </dialog>
    </>
  );
}
