import Image from "next/image";
import Link from "next/link";
import { cutout, products } from "@/data/products";
import styles from "./D2C.module.css";

export function ShopByColor() {
  return (
    <section className={`container ${styles.section}`} aria-labelledby="color-title">
      <div className={styles.head}>
        <h2 id="color-title" className={styles.h2}>
          Shop by color
        </h2>
      </div>
      <ul className={styles.colors} data-stagger>
        {products.map((p) => (
          <li key={p.id} data-reveal>
            <Link href={`/shop/${p.slug}`} className={styles.color}>
              <span className={styles.colorDisc} style={{ background: p.color.hex }}>
                <Image src={cutout(p).src} alt="" width={240} height={240} sizes="120px" />
              </span>
              <span className={styles.colorName}>{p.color.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
