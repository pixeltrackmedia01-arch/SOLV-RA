import Image from "next/image";
import Link from "next/link";
import { categories, cutout, getProduct, products } from "@/data/products";
import { ArrowRight } from "@/components/Icons";
import styles from "./Home.module.css";

export function CategoryShelf() {
  return (
    <section className={`container ${styles.section}`} aria-labelledby="category-title">
      <div className={styles.sectionHead}>
        <div>
          <p className="eyebrow">Shop by routine</p>
          <h2 id="category-title" className={styles.h2}>
            Find your corner of the kitchen.
          </h2>
        </div>
      </div>
      <ul className={styles.shelf}>
        {categories.map((c, i) => {
          const hero = getProduct(c.heroProductId)!;
          const items = products.filter((p) => p.category === c.slug);
          const others = items.filter((p) => p.id !== hero.id).slice(0, 2);
          return (
            <li
              key={c.slug}
              className={styles.shelfItem}
              style={{ "--bg": hero.color.hex, "--fg": hero.color.ink } as React.CSSProperties}
              data-reveal
            >
              <Link href={`/shop?category=${c.slug}`} className={styles.shelfLink}>
                <span className={styles.shelfIndex} aria-hidden="true">
                  0{i + 1}
                </span>
                <span className={styles.shelfName}>{c.name}</span>
                <span className={styles.shelfBlurb}>{c.blurb}</span>
                <span className={styles.shelfCta}>
                  Shop {items.length} appliances <ArrowRight size={18} />
                </span>
                <span className={styles.shelfImages} aria-hidden="true">
                  {others.map((p) => (
                    <Image
                      key={p.id}
                      src={cutout(p).src}
                      alt=""
                      width={400}
                      height={400}
                      sizes="(max-width: 860px) 30vw, 12vw"
                      className={styles.shelfSide}
                    />
                  ))}
                  <Image
                    src={cutout(hero).src}
                    alt=""
                    width={600}
                    height={600}
                    sizes="(max-width: 860px) 50vw, 20vw"
                    className={styles.shelfMain}
                  />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
