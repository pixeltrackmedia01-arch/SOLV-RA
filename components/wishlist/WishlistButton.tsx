"use client";

import Link from "next/link";
import { HeartIcon } from "@/components/Icons";
import { useWishlist } from "./WishlistContext";
import styles from "@/components/cart/CartButton.module.css";

export function WishlistButton() {
  const { ids, hydrated } = useWishlist();
  const n = hydrated ? ids.length : 0;
  return (
    <Link href="/wishlist" className={`${styles.button} ${styles.hideSm}`} aria-label={`Wishlist, ${n} ${n === 1 ? "item" : "items"}`}>
      <HeartIcon />
      {n > 0 && (
        <span className={styles.badge} aria-hidden="true">
          {n}
        </span>
      )}
    </Link>
  );
}
