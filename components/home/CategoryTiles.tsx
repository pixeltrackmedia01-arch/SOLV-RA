import Image from "next/image";
import Link from "next/link";
import { categories, getProduct, inUse, products } from "@/data/products";
import { ArrowRight } from "@/components/Icons";
import { SplitText } from "@/components/SplitText";
import styles from "./D2C.module.css";

const PHOTO: Record<string, string> = {
  morning: "pop-toaster",
  "mix-blend": "whisk-stand-mixer",
  "cook-heat": "crisp-air-fryer",
};

export function CategoryTiles() {
  return (
    <section className={`container ${styles.section}`} aria-labelledby="cats-title">
      <div className={styles.head}>
        <h2 id="cats-title" className={styles.h2} data-split>
          <SplitText>Shop by category</SplitText>
        </h2>
        <Link href="/shop" className="text-link">
          View all <ArrowRight size={16} />
        </Link>
      </div>
      <ul className={styles.tiles} data-stagger>
        {categories.map((c) => {
          const img = inUse(getProduct(PHOTO[c.slug])!);
          const count = products.filter((p) => p.category === c.slug).length;
          return (
            <li key={c.slug} data-reveal>
              <Link href={`/shop?category=${c.slug}`} className={styles.tile}>
                <Image src={img.src} alt={img.alt} width={img.width} height={img.height} sizes="(max-width: 700px) 85vw, 33vw" />
                <span className={styles.tileShade} aria-hidden="true" />
                <span className={styles.tileText}>
                  <span className={styles.tileCount}>{count} products</span>
                  <span className={styles.tileName}>{c.name}</span>
                  <span className={styles.tileCta}>
                    Shop now <ArrowRight size={16} />
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
