import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { brandName, site } from "@/config/site";
import { cutout, getCategory, getProduct, getProducts, lifestyle, products } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { productLd } from "@/lib/jsonld";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { AddToCart } from "@/components/product/AddToCart";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductSlider } from "@/components/product/ProductSlider";
import { CheckIcon } from "@/components/Icons";
import { ProductActions } from "@/components/product/ProductActions";
import { StickyBuyBar } from "@/components/product/StickyBuyBar";
import { CompleteTheSet } from "@/components/product/CompleteTheSet";
import { RecentlyViewed } from "@/components/product/RecentlyViewed";
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
          <ProductSlider
            images={p.images}
            word={p.name}
            color={p.color.hex}
            ink={p.color.ink}
            name={title}
            companions={getProducts(p.relatedIds).map((r) => ({ src: cutout(r).src }))}
          />

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

            <div id="buy-box">
            <AddToCart
              productId={p.id}
              title={title}
              available={p.availability !== "sold-out"}
              color={p.color.hex}
              ink={p.color.ink}
            />
            </div>
            <ProductActions id={p.id} title={title} />

            {variant && p.variantNote && (
              <Link href={`/shop/${variant.slug}`} className={styles.variant}>
                <span className={styles.variantChip} style={{ background: variant.color.hex }} aria-hidden="true" />
                <span>{p.variantNote.text}</span>
              </Link>
            )}

            <div className={styles.accordion}>
              <details open>
                <summary>Highlights</summary>
                <ul className={styles.features}>
                  {p.features.map((f) => (
                    <li key={f}>
                      <CheckIcon size={18} /> {f}
                    </li>
                  ))}
                </ul>
              </details>
              <details>
                <summary>About {title}</summary>
                <p className={styles.about}>{p.description}</p>
              </details>
              <details>
                <summary>Specifications</summary>
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
                </dl>
              </details>
              {p.inTheBox && (
                <details>
                  <summary>In the box</summary>
                  <ul className={styles.box}>
                    {p.inTheBox.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </details>
              )}
              <details>
                <summary>Delivery & returns</summary>
                <p className={styles.about}>
                  Delivery and returns terms are being finalized ahead of launch. See our{" "}
                  <Link href="/info/shipping">shipping</Link> and <Link href="/info/returns">returns</Link> pages for
                  updates.
                </p>
              </details>
            </div>

            <div className={styles.palette}>
              <p className={styles.paletteLabel}>More from the palette</p>
              <ul>
                {products.map((o) => (
                  <li key={o.id}>
                    <Link
                      href={`/shop/${o.slug}`}
                      className={styles.paletteDot}
                      style={{ background: o.color.hex }}
                      aria-current={o.id === p.id ? "page" : undefined}
                      title={`${brandName(o.name)} — ${o.color.name}`}
                    >
                      <span className="visually-hidden">
                        {brandName(o.name)}, {o.type} in {o.color.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {site.prelaunchNotice && <p className={styles.notice}>{site.prelaunchNotice}</p>}
          </div>
        </div>

        <CompleteTheSet ids={[p.id, ...p.relatedIds.slice(0, 2)]} />
      </div>

      {related.length > 0 && (
        <section className={`container ${styles.related}`} aria-labelledby="related-title">
          <h2 id="related-title" className={styles.relatedTitle}>
            Pairs nicely with
          </h2>
          <ul className={styles.relatedGrid} data-stagger>
            {related.map((r) => (
              <li key={r.id} data-reveal>
                <ProductCard product={r} sizes="(max-width: 860px) 50vw, 30vw" />
              </li>
            ))}
          </ul>
        </section>
      )}

      <RecentlyViewed currentId={p.id} />

      <StickyBuyBar
        id={p.id}
        title={title}
        price={formatPrice(p.price)}
        img={cutout(p).src}
        tint={p.color.hex}
        ink={p.color.ink}
        targetId="buy-box"
      />
      <JsonLd data={productLd(p)} />
    </>
  );
}
