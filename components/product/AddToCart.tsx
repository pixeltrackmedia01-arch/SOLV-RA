"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/CartContext";
import { CheckIcon } from "@/components/Icons";
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
  const { add, openCart, announce } = useCart();
  const [qty, setQty] = useState(1);
  const [status, setStatus] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  const handleAdd = () => {
    if (!available) {
      setStatus({ kind: "error", text: `${title} is not available to add right now.` });
      return;
    }
    try {
      add(productId, qty);
      const text = `Added ${qty} × ${title} to your cart.`;
      setStatus({ kind: "ok", text });
      announce(text);
    } catch {
      setStatus({ kind: "error", text: "Something went wrong adding this item. Please try again." });
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.row}>
        <QuantitySelector id={`qty-${productId}`} label={title} value={qty} onChange={setQty} />
        <button
          type="button"
          className={`btn ${styles.add}`}
          style={{ "--btn-bg": color, "--btn-fg": ink, "--btn-border": "var(--ink)" } as React.CSSProperties}
          onClick={handleAdd}
          disabled={!available}
        >
          {available ? "Add to cart" : "Unavailable"}
        </button>
      </div>
      {status && (
        <div className={`${styles.status} ${status.kind === "error" ? styles.error : ""}`}>
          {status.kind === "ok" && <CheckIcon size={18} />}
          <p>{status.text}</p>
          {status.kind === "ok" && (
            <button type="button" className={styles.view} onClick={openCart}>
              View cart
            </button>
          )}
        </div>
      )}
    </div>
  );
}
