"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { brandName } from "@/config/site";
import { cutout, getProducts } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { useShopActions } from "@/lib/useShopActions";
import { PlusIcon } from "@/components/Icons";
import styles from "./ProductExtras.module.css";

/** Pick-and-mix bundle: this product plus two companions, totalled live. */
export function CompleteTheSet({ ids }: { ids: string[] }) {
  const items = getProducts(ids);
  const [picked, setPicked] = useState<string[]>(ids);
  const { addToCart } = useShopActions();
  const chosen = items.filter((p) => picked.includes(p.id));
  const total = chosen.reduce((n, p) => n + (p.price ?? 0), 0);

  return (
    <section className={styles.set} aria-labelledby="set-title">
      <h2 id="set-title" className={styles.setTitle}>
        Complete the <span className="italic">set</span>
      </h2>
      <div className={styles.setRow}>
        {items.map((p, i) => (
          <div key={p.id} className={styles.setItemWrap}>
            {i > 0 && (
              <span className={styles.setPlus} aria-hidden="true">
                <PlusIcon size={18} />
              </span>
            )}
            <label className={`${styles.setItem} ${picked.includes(p.id) ? styles.setOn : ""}`}>
              <input
                type="checkbox"
                checked={picked.includes(p.id)}
                disabled={i === 0}
                onChange={(e) =>
                  setPicked((prev) => (e.target.checked ? [...prev, p.id] : prev.filter((x) => x !== p.id)))
                }
              />
              <span className={styles.setImg} style={{ background: p.color.hex }}>
                <Image src={cutout(p).src} alt="" width={200} height={200} sizes="140px" />
              </span>
              <span className={styles.setName}>
                {i === 0 ? "This item: " : ""}
                {brandName(p.name)}
              </span>
              <span className={styles.setMeta}>
                {p.color.name} · {formatPrice(p.price)}
              </span>
            </label>
            {i > 0 && (
              <Link href={`/shop/${p.slug}`} className={styles.setLink}>
                View {brandName(p.name)}
              </Link>
            )}
          </div>
        ))}
        <div className={styles.setTotal}>
          <p>
            Total for {chosen.length} {chosen.length === 1 ? "item" : "items"}
          </p>
          <p className={styles.setPrice}>{formatPrice(total)}</p>
          <button type="button" className="btn" onClick={() => chosen.forEach((p) => addToCart(p.id, 1))}>
            Add {chosen.length} to cart
          </button>
        </div>
      </div>
    </section>
  );
}
