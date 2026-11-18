"use client";

import Link from "next/link";
import { useState } from "react";
import { categories, featuredIds, products, type CategorySlug } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { ArrowRight } from "@/components/Icons";
import styles from "./D2C.module.css";

type Tab = CategorySlug | "all";

export function ProductTabs() {
  const [tab, setTab] = useState<Tab>("all");
  const order = [...featuredIds, ...products.map((p) => p.id).filter((id) => !featuredIds.includes(id))];
  const list = order
    .map((id) => products.find((p) => p.id === id)!)
    .filter((p) => tab === "all" || p.category === tab)
    .slice(0, 8);
  const tabs: { id: Tab; label: string }[] = [{ id: "all", label: "All" }, ...categories.map((c) => ({ id: c.slug, label: c.name }))];

  return (
    <section className={`container ${styles.section}`} aria-labelledby="range-title">
      <div className={styles.head}>
        <h2 id="range-title" className={styles.h2}>
          Shop the range
        </h2>
        <div className={styles.tabs} role="tablist" aria-label="Filter products">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              aria-controls="range-panel"
              className={styles.tab}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div id="range-panel" role="tabpanel" aria-live="polite">
        <ul className={styles.grid} key={tab}>
          {list.map((p, i) => (
            <li key={p.id} className={styles.gridItem} style={{ "--i": i } as React.CSSProperties}>
              <ProductCard product={p} priority={false} sizes="(max-width: 700px) 50vw, (max-width: 1100px) 33vw, 25vw" />
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.center}>
        <Link href={tab === "all" ? "/shop" : `/shop?category=${tab}`} className="btn btn--ghost">
          View all {tab === "all" ? "appliances" : categories.find((c) => c.slug === tab)?.name} <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
