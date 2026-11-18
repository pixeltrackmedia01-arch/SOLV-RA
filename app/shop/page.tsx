import type { Metadata } from "next";
import { categories, colorFamilies, priceBands, products, type CategorySlug, type ColorFamily, type PriceBand } from "@/data/products";
import { ShopCatalog, type CatalogState, type SortKey } from "@/components/product/ShopCatalog";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import styles from "./shop.module.css";

export const metadata: Metadata = {
  title: "Shop all appliances",
  description:
    "Shop retro-inspired toasters, kettles, blenders, mixers, an air fryer, microwave and rice cooker — each in its own signature color.",
  alternates: { canonical: "/shop" },
  openGraph: { url: "/shop" },
};

type SP = Promise<Record<string, string | string[] | undefined>>;

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
const sorts: SortKey[] = ["featured", "name", "price-asc", "price-desc"];

export default async function ShopPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const cat = one(sp.category);
  const sort = one(sp.sort) as SortKey;
  const colors = one(sp.color)
    .split(",")
    .filter((c): c is ColorFamily => colorFamilies.some((f) => f.slug === c));
  const prices = one(sp.price)
    .split(",")
    .filter((b): b is PriceBand => priceBands.some((x) => x.slug === b));
  const initial: CatalogState = {
    category: categories.some((c) => c.slug === cat) ? (cat as CategorySlug) : "all",
    colors,
    prices,
    sort: sorts.includes(sort) ? sort : "featured",
    q: one(sp.q).slice(0, 80),
  };
  const key = JSON.stringify(initial);

  return (
    <div className="container">
      <div className={styles.crumbs}>
        <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Shop", href: "/shop" }]} />
      </div>
      <ShopCatalog key={key} products={products} initial={initial} />
    </div>
  );
}
