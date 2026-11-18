"use client";

import { BagIcon } from "@/components/Icons";
import { useCart } from "./CartContext";
import styles from "./CartButton.module.css";

export function CartButton() {
  const { count, hydrated, openCart } = useCart();
  const label = hydrated ? `Cart, ${count} ${count === 1 ? "item" : "items"}` : "Cart";
  return (
    <button type="button" className={styles.button} onClick={openCart} aria-label={label} aria-haspopup="dialog">
      <BagIcon />
      {hydrated && count > 0 && (
        <span className={styles.badge} aria-hidden="true">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}
