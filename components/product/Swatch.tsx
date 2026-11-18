import styles from "./Swatch.module.css";

/** A color chip that always travels with its text label (never color alone). */
export function Swatch({ name, hex, size = "md" }: { name: string; hex: string; size?: "sm" | "md" }) {
  return (
    <span className={`${styles.swatch} ${size === "sm" ? styles.sm : ""}`}>
      <span className={styles.chip} style={{ background: hex }} aria-hidden="true" />
      <span>{name}</span>
    </span>
  );
}
