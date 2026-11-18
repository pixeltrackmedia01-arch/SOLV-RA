import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site } from "@/config/site";
import { articles, getArticle } from "@/data/journal";
import { getProducts } from "@/data/products";
import { readableInk } from "@/lib/color";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductCard } from "@/components/product/ProductCard";
import { ArrowRight } from "@/components/Icons";
import { ReadingProgress } from "@/components/ReadingProgress";
import { SplitText } from "@/components/SplitText";
import styles from "./article.module.css";

type Params = Promise<{ slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  return {
    title: a.title,
    description: a.dek,
    alternates: { canonical: `/journal/${a.slug}` },
    openGraph: {
      type: "article",
      title: `${a.title} | ${site.name}`,
      description: a.dek,
      url: `/journal/${a.slug}`,
      images: [{ url: a.image.src, width: a.image.width, height: a.image.height, alt: a.image.alt }],
    },
  };
}

export default async function ArticlePage({ params }: { params: Params }) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();
  const others = articles.filter((x) => x.slug !== a.slug);

  return (
    <article>
      <ReadingProgress color={a.accent} />
      <header
        className={styles.header}
        style={{ "--accent": a.accent, "--accent-ink": readableInk(a.accent) } as React.CSSProperties}
      >
        <div className={`container ${styles.headerInner}`}>
          <Breadcrumbs
            crumbs={[
              { name: "Home", href: "/" },
              { name: "Journal", href: "/journal" },
              { name: a.title, href: `/journal/${a.slug}` },
            ]}
          />
          <p className={styles.meta}>
            {a.category} · {a.readingMinutes} min read
          </p>
          <h1 className={styles.title} data-split>
            <SplitText>{a.title}</SplitText>
          </h1>
          <p className={styles.dek}>{a.dek}</p>
          {a.isSample && (
            <p className={styles.sample}>Sample article — editable starter content.</p>
          )}
        </div>
      </header>

      <div className={`container ${styles.heroImage}`}>
        <div className={styles.heroClip} data-reveal="clip">
        <Image
          data-parallax="0.06"
          src={a.image.src}
          alt={a.image.alt}
          width={a.image.width}
          height={a.image.height}
          sizes="(max-width: 1000px) 100vw, 1000px"
          priority
        />
        </div>
      </div>

      <div className={`container ${styles.body}`}>
        {a.body.map((b, i) => {
          switch (b.type) {
            case "p":
              return <p key={i}>{b.text}</p>;
            case "h2":
              return <h2 key={i}>{b.text}</h2>;
            case "quote":
              return (
                <blockquote key={i} className={styles.quote}>
                  <p>{b.text}</p>
                </blockquote>
              );
            case "list":
              return (
                <ul key={i} className={styles.list}>
                  {b.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              );
            case "products":
              return (
                <figure key={i} className={styles.products}>
                  <ul>
                    {getProducts(b.ids).map((p) => (
                      <li key={p.id}>
                        <ProductCard product={p} variant="compact" sizes="(max-width: 600px) 50vw, 240px" />
                      </li>
                    ))}
                  </ul>
                  {b.caption && <figcaption>{b.caption}</figcaption>}
                </figure>
              );
          }
        })}
      </div>

      <aside className={`container ${styles.more}`} aria-labelledby="more-title">
        <h2 id="more-title">Keep reading</h2>
        <ul>
          {others.map((o) => (
            <li key={o.slug}>
              <Link href={`/journal/${o.slug}`} className={styles.moreLink}>
                <span className={styles.moreMeta}>{o.category}</span>
                <span className={styles.moreTitle}>{o.title}</span>
                <ArrowRight size={20} />
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </article>
  );
}
