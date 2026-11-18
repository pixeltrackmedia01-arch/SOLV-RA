import Link from "next/link";
import { featuredIds, getProducts } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { ArrowRight } from "@/components/Icons";
import styles from "./Home.module.css";

export function FeaturedProducts() {
  const [lead, ...rest] = getProducts(featuredIds);
  return (
    <section className={`container ${styles.section}`} aria-labelledby="featured-title">
      <div className={styles.sectionHead}>
        <div>
          <p className="eyebrow">Counter favorites</p>
          <h2 id="featured-title" className={styles.h2}>
            Pick a color, <span className="italic">any color.</span>
          </h2>
        </div>
        <Link href="/shop" className="text-link">
          Shop all ten <ArrowRight size={18} />
        </Link>
      </div>

      <div className={styles.featuredGrid}>
        <div className={styles.featuredLead} data-reveal>
          <ProductCard
            product={lead}
            variant="feature"
            imageKind="lifestyle"
            sizes="(max-width: 860px) 100vw, 45vw"
          />
        </div>
        {rest.map((p) => (
          <div key={p.id} className={styles.featuredItem} data-reveal>
            <ProductCard product={p} sizes="(max-width: 860px) 50vw, 24vw" />
          </div>
        ))}
        <aside className={styles.featuredNote} data-reveal>
          <p className={styles.featuredNoteText}>
            Every Crab appliance has one signature color, chosen to sit happily beside the others.
          </p>
          <Link href="/about" className="text-link">
            Our design point of view <ArrowRight size={18} />
          </Link>
        </aside>
      </div>
    </section>
  );
}
