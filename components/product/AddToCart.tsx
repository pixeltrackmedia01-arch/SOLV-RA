"use client";

import { useState } from "react";
import { useShopActions } from "@/lib/useShopActions";
import { QuantitySelector } from "./QuantitySelector";
import styles from "./AddToCart.module.css";

type Props = {
  productId: string;
  title: string;
  available: boolean;
  color: string;
  ink: string;
};

export function AddToCart({ productId, title, available, color, ink }: Props) {
  const { addToCart } = useShopActions();
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");

  return (
    <div className={styles.wrap}>
      <div className={styles.row}>
        <QuantitySelector id={`qty-${productId}`} label={title} value={qty} onChange={setQty} />
        <button
          type="button"
          className={`btn ${styles.add}`}
          style={{ "--btn-bg": color, "--btn-fg": ink, "--btn-border": "var(--ink)" } as React.CSSProperties}
          onClick={() => {
            if (!available) return setError(`${title} is not available to add right now.`);
            setError("");
            addToCart(productId, qty);
            setQty(1);
          }}
          disabled={!available}
        >
          {available ? "Add to cart" : "Unavailable"}
        </button>
      </div>
      {error && (
        <p className={`${styles.status} ${styles.error}`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
