import Image from "next/image";
import Link from "next/link";
import { brandName } from "@/config/site";
import { getProduct, inUse } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { ArrowRight } from "@/components/Icons";
import styles from "./D2C.module.css";

const PROMOS = [
  { id: "splash-blender", eyebrow: "Smoothie season", headline: "Blend something fresh." },
  { id: "whip-hand-mixer", eyebrow: "Baking days", headline: "Whip up something pretty." },
];

export function PromoSplit() {
  return (
    <section className={`container ${styles.section}`} aria-label="Featured promotions">
      <div className={styles.promos} data-stagger>
        {PROMOS.map((pr) => {
          const p = getProduct(pr.id)!;
          const img = inUse(p);
          return (
            <Link key={p.id} href={`/shop/${p.slug}`} className={styles.promo} data-reveal style={{ "--c": p.color.hex, "--c-ink": p.color.ink } as React.CSSProperties}>
              <span className={styles.promoMedia}>
                <Image src={img.src} alt={img.alt} width={img.width} height={img.height} sizes="(max-width: 860px) 100vw, 50vw" />
              </span>
              <span className={styles.promoText}>
                <span className={styles.promoEyebrow}>{pr.eyebrow}</span>
                <span className={styles.promoHeadline}>{pr.headline}</span>
                <span className={styles.promoMeta}>
                  {brandName(p.name)} · {p.type} · {formatPrice(p.price)}
                </span>
                <span className={styles.promoCta}>
                  Shop {brandName(p.name)} <ArrowRight size={16} />
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
