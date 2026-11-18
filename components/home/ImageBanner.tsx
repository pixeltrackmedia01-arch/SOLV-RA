import Image from "next/image";
import Link from "next/link";
import { brandName } from "@/config/site";
import { getProduct, inUse } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { ArrowRight } from "@/components/Icons";
import { SplitText } from "@/components/SplitText";
import styles from "./D2C.module.css";

export function ImageBanner() {
  const p = getProduct("sunny-kettle")!;
  const img = inUse(p);
  return (
    <section className={styles.banner} style={{ "--c": p.color.hex, "--c-ink": p.color.ink } as React.CSSProperties} aria-labelledby="banner-title">
      <div className={styles.bannerMedia} data-reveal="clip">
        <Image data-parallax="0.08" src={img.src} alt={img.alt} width={img.width} height={img.height} sizes="(max-width: 860px) 100vw, 50vw" />
      </div>
      <div className={styles.bannerText}>
        <p className="eyebrow">Chai o’clock</p>
        <h2 id="banner-title" className={styles.bannerTitle} data-split>
          <SplitText>
            Every pour, a little <span className="italic">sunnier.</span>
          </SplitText>
        </h2>
        <p className={styles.bannerBody}>
          {brandName(p.name)} pairs a marigold finish with a 1.7 L capacity, automatic shut-off and a cordless 360° base.
        </p>
        <div className={styles.bannerBuy}>
          <span className={styles.bannerPrice}>{formatPrice(p.price)}</span>
          <Link href={`/shop/${p.slug}`} className="btn">
            Shop {brandName(p.name)} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
