import Image from "next/image";
import Link from "next/link";
import { brandName } from "@/config/site";
import { cutout, lifestyle, type Product } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { ArrowRight } from "@/components/Icons";
import { Swatch } from "./Swatch";
import styles from "./ProductCard.module.css";

type Props = {
  product: Product;
  variant?: "default" | "feature" | "compact";
  imageKind?: "cutout" | "lifestyle";
  priority?: boolean;
  headingLevel?: "h2" | "h3";
  sizes?: string;
};

export function ProductCard({
  product: p,
  variant = "default",
  imageKind = "cutout",
  priority = false,
  headingLevel: H = "h3",
  sizes = "(max-width: 600px) 50vw, (max-width: 1000px) 33vw, 25vw",
}: Props) {
  const img = imageKind === "lifestyle" ? lifestyle(p) : cutout(p);
  const price = formatPrice(p.price);
  return (
    <article
      className={`${styles.card} ${styles[variant]} ${imageKind === "lifestyle" ? styles.isLifestyle : ""}`}
      style={{ "--tint": p.color.hex, "--tint-ink": p.color.ink } as React.CSSProperties}
    >
      <div className={styles.media}>
        <Image
          src={img.src}
          alt={img.alt}
          width={img.width}
          height={img.height}
          sizes={sizes}
          priority={priority}
          className={styles.image}
        />
        {p.badge && <span className={styles.badge}>{p.badge}</span>}
        <span className={styles.reveal} aria-hidden="true">
          View details <ArrowRight size={16} />
        </span>
      </div>
      <div className={styles.body}>
        <H className={styles.name}>
          <Link href={`/shop/${p.slug}`} className={styles.link}>
            {brandName(p.name)}
          </Link>
        </H>
        <p className={styles.type}>{p.type}</p>
        <div className={styles.meta}>
          <Swatch name={p.color.name} hex={p.color.hex} size="sm" />
          {price && <p className={styles.price}>{price}</p>}
        </div>
      </div>
    </article>
  );
}
