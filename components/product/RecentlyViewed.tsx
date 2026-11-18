"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/data/products";
import { ProductCard } from "./ProductCard";
import styles from "./ProductExtras.module.css";

const KEY = "crab-recent-v1";

/** Records this product and shows the others viewed on this device. */
export function RecentlyViewed({ currentId }: { currentId: string }) {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const prev: string[] = JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
      const clean = Array.isArray(prev) ? prev.filter((x) => typeof x === "string") : [];
      setIds(clean.filter((x) => x !== currentId).slice(0, 4));
      window.localStorage.setItem(KEY, JSON.stringify([currentId, ...clean.filter((x) => x !== currentId)].slice(0, 8)));
    } catch {
      /* storage unavailable */
    }
  }, [currentId]);

  const items = getProducts(ids);
  if (items.length === 0) return null;

  return (
    <section className={`container ${styles.recent}`} aria-labelledby="recent-title">
      <h2 id="recent-title" className={styles.recentTitle}>
        Recently viewed
      </h2>
      <ul className={styles.recentGrid}>
        {items.map((p) => (
          <li key={p.id}>
            <ProductCard product={p} variant="compact" sizes="(max-width: 860px) 50vw, 22vw" />
          </li>
        ))}
      </ul>
    </section>
  );
}
