import { products } from "@/data/products";
import styles from "./Marquee.module.css";

/** Slow, endless band of color names. Decorative; the list is also in the page as text. */
export function Marquee() {
  const items = products.map((p) => ({ name: p.color.name, hex: p.color.hex }));
  const row = (hidden: boolean) => (
    <ul className={styles.row} aria-hidden={hidden || undefined}>
      {items.map((i) => (
        <li key={i.name}>
          <span className={styles.dot} style={{ background: i.hex }} />
          {i.name}
        </li>
      ))}
    </ul>
  );
  return (
    <div className={styles.marquee} role="region" aria-label="The Crab color palette">
      <div className={styles.track}>
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
