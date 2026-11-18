import Image from "next/image";
import Link from "next/link";
import { brandName } from "@/config/site";
import { getProduct, lifestyle } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { ArrowRight, CheckIcon } from "@/components/Icons";
import { SplitText } from "@/components/SplitText";
import styles from "./Home.module.css";

const SPOTLIGHT = "whisk-stand-mixer";

export function Spotlight() {
  const p = getProduct(SPOTLIGHT)!;
  const img = lifestyle(p);
  return (
    <section
      className={styles.spotlight}
      aria-labelledby="spotlight-title"
      style={{ "--bg": p.color.hex, "--fg": p.color.ink } as React.CSSProperties}
    >
      <div className={`container ${styles.spotlightGrid}`}>
        <div className={`${styles.spotlightMedia} ${styles.mediaClip}`} data-reveal="clip">
          <Image data-parallax="0.07" src={img.src} alt={img.alt} width={img.width} height={img.height} sizes="(max-width: 860px) 100vw, 50vw" />
        </div>
        <div className={styles.spotlightCopy} data-reveal>
          <p className="eyebrow">In the spotlight</p>
          <h2 id="spotlight-title" className={styles.h2} data-split>
            <SplitText>{brandName(p.name)}</SplitText>
            <span className={styles.spotlightType}>{p.type}</span>
          </h2>
          <p className={styles.spotlightTagline}>{p.tagline}</p>
          <p>{p.description}</p>
          <ul className={styles.checks}>
            {p.features.slice(0, 4).map((f) => (
              <li key={f}>
                <CheckIcon size={18} /> {f}
              </li>
            ))}
          </ul>
          <div className={styles.spotlightBuy}>
            {p.price != null && <p className={styles.spotlightPrice}>{formatPrice(p.price)}</p>}
            <Link href={`/shop/${p.slug}`} className="btn">
              Explore {brandName(p.name)} <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
