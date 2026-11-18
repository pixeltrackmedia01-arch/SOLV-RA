import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { brandName, site } from "@/config/site";
import { getCategory, getProduct, getProducts, lifestyle, products } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { productLd } from "@/lib/jsonld";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { AddToCart } from "@/components/product/AddToCart";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGallery } from "@/components/product/ProductGallery";
import { CheckIcon } from "@/components/Icons";
import styles from "./product.module.css";

type Params = Promise<{ slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  const title = `${brandName(p.name)} ${p.type} in ${p.color.name}`;
  const img = lifestyle(p);
  return {
    title,
    description: p.shortDescription,
    alternates: { canonical: `/shop/${p.slug}` },
    openGraph: {
      title: `${title} | ${site.name}`,
      description: p.shortDescription,
      url: `/shop/${p.slug}`,
      images: [{ url: img.src, width: img.width, height: img.height, alt: img.alt }],
    },
    twitter: { card: "summary_large_image", images: [img.src] },
  };
}

const availabilityLabel = { available: "Available", preorder: "Pre-order", "sold-out": "Sold out" } as const;

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();

  const title = brandName(p.name);
  const category = getCategory(p.category);
  const related = getProducts(p.relatedIds);
  const variant = p.variantNote ? getProduct(p.variantNote.productId) : undefined;

  return (
    <>
      <div className="container">
        <div className={styles.crumbs}>
          <Breadcrumbs
            crumbs={[
              { name: "Home", href: "/" },
              { name: "Shop", href: "/shop" },
              ...(category ? [{ name: category.name, href: `/shop?category=${category.slug}` }] : []),
              { name: title, href: `/shop/${p.slug}` },
            ]}
          />
        </div>

        <div className={styles.layout} style={{ "--tint": p.color.hex } as React.CSSProperties}>
          <ProductGallery images={p.images} tint={p.color.hex} name={title} />

          <div className={styles.info}>
            {p.badge && <p className={styles.badge}>{p.badge}</p>}
            <h1 className={styles.title}>
              {title}
              <span className={styles.type}>{p.type}</span>
            </h1>
            <p className={styles.tagline}>{p.tagline}</p>

            <div className={styles.priceRow}>
              {p.price != null && <p className={styles.price}>{formatPrice(p.price)}</p>}
              {p.compareAtPrice != null && p.compareAtPrice > (p.price ?? 0) && (
                <p className={styles.compare}>
                  <span className="visually-hidden">Was </span>
                  <s>{formatPrice(p.compareAtPrice)}</s>
                </p>
              )}
              <p className={styles.availability}>{availabilityLabel[p.availability]}</p>
            </div>

            <div className={styles.colorRow}>
              <span className={styles.colorChip} style={{ background: p.color.hex }} aria-hidden="true" />
              <p>
                <span className={styles.colorLabel}>Color</span>
                <strong>{p.color.name}</strong>
              </p>
            </div>

            <p className={styles.short}>{p.shortDescription}</p>

            <AddToCart
              productId={p.id}
              title={title}
              available={p.availability !== "sold-out"}
              color={p.color.hex}
              ink={p.color.ink}
            />

            {variant && p.variantNote && (
              <Link href={`/shop/${variant.slug}`} className={styles.variant}>
                <span className={styles.variantChip} style={{ background: variant.color.hex }} aria-hidden="true" />
                <span>{p.variantNote.text}</span>
              </Link>
            )}

            {site.prelaunchNotice && <p className={styles.notice}>{site.prelaunchNotice}</p>}
          </div>
        </div>

        <section className={styles.details} aria-labelledby="details-title">
          <h2 id="details-title" className="visually-hidden">
            Product details
          </h2>
          <div className={styles.about}>
            <h3>About {title}</h3>
            <p>{p.description}</p>
          </div>
          <div>
            <h3>Highlights</h3>
            <ul className={styles.features}>
              {p.features.map((f) => (
                <li key={f}>
                  <CheckIcon size={18} /> {f}
                </li>
              ))}
            </ul>
          </div>
          {(p.specs?.length || p.inTheBox?.length) && (
            <div>
              <h3>Specifications</h3>
              <dl className={styles.specs}>
                {p.specs?.map((s) => (
                  <div key={s.label}>
                    <dt>{s.label}</dt>
                    <dd>{s.value}</dd>
                  </div>
                ))}
                <div>
                  <dt>Color</dt>
                  <dd>
                    {p.color.name} ({p.color.hex})
                  </dd>
                </div>
                {p.inTheBox && (
                  <div>
                    <dt>In the box</dt>
                    <dd>{p.inTheBox.join(", ")}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}
        </section>
      </div>

      {related.length > 0 && (
        <section className={`container ${styles.related}`} aria-labelledby="related-title">
          <h2 id="related-title" className={styles.relatedTitle}>
            Pairs nicely with
          </h2>
          <ul className={styles.relatedGrid}>
            {related.map((r) => (
              <li key={r.id}>
                <ProductCard product={r} sizes="(max-width: 860px) 50vw, 30vw" />
              </li>
            ))}
          </ul>
        </section>
      )}

      <JsonLd data={productLd(p)} />
    </>
  );
}
