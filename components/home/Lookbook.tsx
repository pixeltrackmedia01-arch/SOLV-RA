import { brandName } from "@/config/site";
import { inUse, products } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { SplitText } from "@/components/SplitText";
import { LookbookTrack, type LookItem } from "./LookbookTrack";
import styles from "./Lookbook.module.css";

export function Lookbook() {
  const order = ["pop-toaster", "splash-blender", "crisp-air-fryer", "sunny-kettle", "whip-hand-mixer", "reheat-microwave", "blue-kettle", "rice-cooker", "brew-coffee-maker", "whisk-stand-mixer"];
  const items: LookItem[] = order.map((id) => {
    const p = products.find((x) => x.id === id)!;
    const img = inUse(p);
    return {
      id: p.id,
      href: `/shop/${p.slug}`,
      name: brandName(p.name),
      type: p.type,
      color: p.color.name,
      hex: p.color.hex,
      price: formatPrice(p.price),
      img: { src: img.src, alt: img.alt },
    };
  });
  return (
    <section className={styles.section} aria-labelledby="look-title">
      <div className={`container ${styles.head}`}>
        <div>
          <p className="eyebrow">On the counter</p>
          <h2 id="look-title" className={styles.title} data-split>
            <SplitText>
              Shop the <span className="italic">look.</span>
            </SplitText>
          </h2>
        </div>
        <p className={styles.hint}>Drag, scroll or swipe to explore</p>
      </div>
      <LookbookTrack items={items} />
    </section>
  );
}
