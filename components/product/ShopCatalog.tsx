"use client";

import Image from "next/image";
import { useEffect, useId, useMemo, useState } from "react";
import {
  categories,
  colorFamilies,
  featuredIds,
  priceBands,
  type CategorySlug,
  type ColorFamily,
  type PriceBand,
  type Product,
} from "@/data/products";
import { brandName } from "@/config/site";
import { searchProducts } from "@/lib/search";
import { CloseIcon } from "@/components/Icons";
import { ProductCard } from "./ProductCard";
import styles from "./ShopCatalog.module.css";

export type SortKey = "featured" | "name" | "price-asc" | "price-desc";


export type CatalogState = {
  category: CategorySlug | "all";
  colors: ColorFamily[];
  prices: PriceBand[];
  sort: SortKey;
  q: string;
};

const sortLabels: Record<SortKey, string> = {
  featured: "Featured",
  name: "Name (A–Z)",
  "price-asc": "Price (low to high)",
  "price-desc": "Price (high to low)",
};

function applyState(list: Product[], s: CatalogState) {
  let out = s.q ? searchProducts(list, s.q) : list.slice();
  if (s.category !== "all") out = out.filter((p) => p.category === s.category);
  if (s.colors.length) out = out.filter((p) => s.colors.includes(p.color.family));
  if (s.prices.length)
    out = out.filter((p) =>
      priceBands.some((b) => s.prices.includes(b.slug) && p.price != null && p.price >= b.min && p.price <= b.max),
    );
  const featuredRank = (p: Product) => {
    const i = featuredIds.indexOf(p.id);
    return i === -1 ? featuredIds.length + list.indexOf(p) : i;
  };
  const price = (p: Product) => p.price ?? Number.POSITIVE_INFINITY;
  out.sort((a, b) => {
    switch (s.sort) {
      case "name":
        return brandName(a.name).localeCompare(brandName(b.name));
      case "price-asc":
        return price(a) - price(b);
      case "price-desc":
        return price(b) - price(a);
      default:
        return featuredRank(a) - featuredRank(b);
    }
  });
  return out;
}

function toQueryString(s: CatalogState) {
  const params = new URLSearchParams();
  if (s.category !== "all") params.set("category", s.category);
  if (s.colors.length) params.set("color", s.colors.join(","));
  if (s.prices.length) params.set("price", s.prices.join(","));
  if (s.sort !== "featured") params.set("sort", s.sort);
  if (s.q) params.set("q", s.q);
  const str = params.toString();
  return str ? `?${str}` : "";
}

const BANNERS: Record<CatalogState["category"], { src: string; ink: string; bg: string }> = {
  all: { src: "/images/banners/shop-all.webp", ink: "#1b1714", bg: "#EFE6D7" },
  morning: { src: "/images/banners/cat-morning.webp", ink: "#1b1714", bg: "#F6C445" },
  "mix-blend": { src: "/images/banners/cat-mix-blend.webp", ink: "#1b1714", bg: "#A8BE78" },
  "cook-heat": { src: "/images/banners/cat-cook-heat.webp", ink: "#ffffff", bg: "#1F6663" },
};

export function ShopCatalog({ products, initial }: { products: Product[]; initial: CatalogState }) {
  const [state, setState] = useState<CatalogState>(initial);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const panelId = useId();

  const results = useMemo(() => applyState(products, state), [products, state]);

  // Keep the URL shareable without triggering a navigation.
  useEffect(() => {
    const qs = toQueryString(state);
    if (qs !== window.location.search) {
      window.history.replaceState(window.history.state, "", `${window.location.pathname}${qs}`);
    }
  }, [state]);

  const update = (patch: Partial<CatalogState>) => setState((s) => ({ ...s, ...patch }));
  const reset = () => setState({ category: "all", colors: [], prices: [], sort: state.sort, q: "" });

  const active: { key: string; label: string; clear: () => void }[] = [];
  if (state.q) active.push({ key: "q", label: `Search: “${state.q}”`, clear: () => update({ q: "" }) });
  if (state.category !== "all") {
    const c = categories.find((x) => x.slug === state.category);
    active.push({ key: "cat", label: c?.name ?? state.category, clear: () => update({ category: "all" }) });
  }
  for (const f of state.colors) {
    const fam = colorFamilies.find((x) => x.slug === f);
    active.push({
      key: `color-${f}`,
      label: fam?.name ?? f,
      clear: () => update({ colors: state.colors.filter((c) => c !== f) }),
    });
  }

  for (const b of state.prices) {
    const band = priceBands.find((x) => x.slug === b);
    active.push({
      key: `price-${b}`,
      label: band?.label ?? b,
      clear: () => update({ prices: state.prices.filter((x) => x !== b) }),
    });
  }

  const filterCount = active.length;
  const cat = categories.find((c) => c.slug === state.category);
  const banner = BANNERS[state.category];

  return (
    <div className={styles.layout}>
      <header className={styles.banner} style={{ color: banner.ink, background: banner.bg }}>
        <Image
          key={banner.src}
          src={banner.src}
          alt=""
          width={2400}
          height={860}
          priority
          sizes="(max-width: 1360px) 100vw, 1360px"
          className={styles.bannerImg}
        />
        <div className={styles.bannerText}>
          <p className={styles.bannerEyebrow}>Collection</p>
          <h1 className={styles.bannerTitle}>{cat ? cat.name : "All appliances"}</h1>
          <p className={styles.bannerBlurb}>
            {cat ? cat.blurb : "Ten everyday appliances, ten signature colors. Filter by routine, color or price."}
          </p>
        </div>
      </header>
      <div className={styles.toolbar}>
        <p className={styles.count} role="status" aria-live="polite" aria-atomic="true">
          <strong>{results.length}</strong> of {products.length} appliances
        </p>
        <button
          type="button"
          className={`btn btn--ghost ${styles.filterToggle}`}
          aria-expanded={filtersOpen}
          aria-controls={panelId}
          onClick={() => setFiltersOpen((o) => !o)}
        >
          Filters{filterCount > 0 ? ` (${filterCount})` : ""}
        </button>
        <div className={styles.sort}>
          <label htmlFor="sort-select">Sort by</label>
          <select
            id="sort-select"
            value={state.sort}
            onChange={(e) => update({ sort: e.target.value as SortKey })}
          >
            {(Object.keys(sortLabels) as SortKey[]).map((k) => (
              <option key={k} value={k}>
                {sortLabels[k]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <aside
        id={panelId}
        className={`${styles.filters} ${filtersOpen ? styles.filtersOpen : ""}`}
        aria-label="Product filters"
      >
        <div className={styles.searchField}>
          <label htmlFor="catalog-q">Search</label>
          <input
            id="catalog-q"
            type="search"
            value={state.q}
            placeholder="e.g. kettle"
            onChange={(e) => update({ q: e.target.value })}
          />
        </div>

        <fieldset className={styles.fieldset}>
          <legend>Category</legend>
          <div className={styles.options}>
            {[{ slug: "all" as const, name: "All" }, ...categories].map((c) => (
              <label key={c.slug} className={styles.option}>
                <input
                  type="radio"
                  name="category"
                  value={c.slug}
                  checked={state.category === c.slug}
                  onChange={() => update({ category: c.slug })}
                />
                <span>{c.name}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend>Color</legend>
          <div className={styles.options}>
            {colorFamilies.map((f) => (
              <label key={f.slug} className={styles.option}>
                <input
                  type="checkbox"
                  value={f.slug}
                  checked={state.colors.includes(f.slug)}
                  onChange={(e) =>
                    update({
                      colors: e.target.checked
                        ? [...state.colors, f.slug]
                        : state.colors.filter((c) => c !== f.slug),
                    })
                  }
                />
                <span className={styles.swatches} aria-hidden="true">
                  {f.swatches.map((s) => (
                    <i key={s} style={{ background: s }} />
                  ))}
                </span>
                <span>{f.name}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend>Price</legend>
          <div className={styles.options}>
            {priceBands.map((b) => {
              const count = products.filter((p) => p.price != null && p.price >= b.min && p.price <= b.max).length;
              return (
                <label key={b.slug} className={styles.option}>
                  <input
                    type="checkbox"
                    value={b.slug}
                    checked={state.prices.includes(b.slug)}
                    onChange={(e) =>
                      update({
                        prices: e.target.checked ? [...state.prices, b.slug] : state.prices.filter((x) => x !== b.slug),
                      })
                    }
                  />
                  <span>{b.label}</span>
                  <span className={styles.optCount}>{count}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {filterCount > 0 && (
          <button type="button" className={`btn btn--ghost btn--block ${styles.resetSide}`} onClick={reset}>
            Reset filters
          </button>
        )}
      </aside>

      <div className={styles.results}>
        {active.length > 0 && (
          <div className={styles.active}>
            <span className="visually-hidden">Active filters:</span>
            <ul className={styles.chips}>
              {active.map((a) => (
                <li key={a.key}>
                  <button type="button" className={styles.chip} onClick={a.clear}>
                    {a.label}
                    <CloseIcon size={14} />
                    <span className="visually-hidden">Remove filter</span>
                  </button>
                </li>
              ))}
            </ul>
            <button type="button" className={styles.clearAll} onClick={reset}>
              Clear all
            </button>
          </div>
        )}

        {results.length > 0 ? (
          <ul className={styles.grid}>
            {results.map((p, i) => (
              <li key={p.id} className={styles.gridItem} style={{ "--i": i } as React.CSSProperties}>
                <ProductCard
                  product={p}
                  headingLevel="h2"
                  priority={i < 3}
                  sizes="(max-width: 600px) 50vw, (max-width: 1100px) 33vw, 300px"
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className={styles.empty}>
            <h2>No appliances match those filters.</h2>
            <p>Try a different color or category, or start again with the full range.</p>
            <button type="button" className="btn" onClick={reset}>
              Show all appliances
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
