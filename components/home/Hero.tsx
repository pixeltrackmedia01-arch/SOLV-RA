import Image from "next/image";
import Link from "next/link";
import { brandName } from "@/config/site";
import { cutout, getProduct, products } from "@/data/products";
import { ArrowRight } from "@/components/Icons";
import { Sparkle, Sunburst } from "./Sunburst";
import styles from "./Home.module.css";

const HERO_PRODUCT = "pop-toaster";

export function Hero() {
  const p = getProduct(HERO_PRODUCT)!;
  const img = cutout(p);
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={`container ${styles.heroGrid}`}>
        <div className={styles.heroCopy}>
          <p className="eyebrow">Retro-inspired kitchen appliances</p>
          <h1 id="hero-title" className={styles.heroTitle}>
            Good mornings start <span className="italic">in color.</span>
          </h1>
          <p className="lede">
            Toasters, kettles, mixers and more in ten signature colors — with simple dials and
            cheerful shapes made to earn their counter space.
          </p>
          <div className={styles.heroCtas}>
            <Link href="/shop" className="btn">
              Shop all appliances <ArrowRight size={18} />
            </Link>
            <Link href={`/shop/${p.slug}`} className="btn btn--ghost">
              Meet {brandName(p.name)}
            </Link>
          </div>
          <div className={styles.heroPalette}>
            <ul aria-hidden="true">
              {products.map((x) => (
                <li key={x.id} style={{ background: x.color.hex }} />
              ))}
            </ul>
            <p>Ten signature colors</p>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.heroArch} aria-hidden="true">
            <Sunburst className={styles.heroBurst} rays={28} />
          </div>
          <Sparkle className={styles.heroSparkle} />
          <Image
            src={img.src}
            alt={img.alt}
            width={img.width}
            height={img.height}
            priority
            fetchPriority="high"
            sizes="(max-width: 860px) 90vw, 46vw"
            className={styles.heroImage}
          />
          <p className={styles.heroTag}>
            <span className={styles.heroTagChip} style={{ background: p.color.hex }} aria-hidden="true" />
            <span>
              <strong>{brandName(p.name)}</strong> · {p.color.name}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
