"use client";

import { site } from "@/config/site";
import { MinusIcon, PlusIcon } from "@/components/Icons";
import styles from "./QuantitySelector.module.css";

type Props = {
  value: number;
  onChange: (qty: number) => void;
  /** Used to build accessible names, e.g. "Crab Pop". */
  label: string;
  id: string;
  size?: "md" | "sm";
};

export function QuantitySelector({ value, onChange, label, id, size = "md" }: Props) {
  const max = site.commerce.maxQuantity;
  const set = (n: number) => onChange(Math.max(1, Math.min(max, n)));

  return (
    <div className={`${styles.qty} ${size === "sm" ? styles.sm : ""}`} role="group" aria-labelledby={`${id}-label`}>
      <span id={`${id}-label`} className="visually-hidden">
        Quantity for {label}
      </span>
      <button
        type="button"
        className={styles.step}
        onClick={() => set(value - 1)}
        disabled={value <= 1}
        aria-label={`Decrease quantity of ${label}`}
      >
        <MinusIcon size={18} />
      </button>
      <input
        id={id}
        className={styles.input}
        type="number"
        inputMode="numeric"
        min={1}
        max={max}
        value={value}
        aria-label={`Quantity for ${label}`}
        onChange={(e) => {
          const n = Number.parseInt(e.target.value, 10);
          if (!Number.isNaN(n)) set(n);
        }}
      />
      <button
        type="button"
        className={styles.step}
        onClick={() => set(value + 1)}
        disabled={value >= max}
        aria-label={`Increase quantity of ${label}`}
      >
        <PlusIcon size={18} />
      </button>
    </div>
  );
}
