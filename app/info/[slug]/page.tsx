import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site } from "@/config/site";
import { getInfoPage, infoPages } from "@/data/info";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import styles from "./info.module.css";

type Params = Promise<{ slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return infoPages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const page = getInfoPage(slug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/info/${page.slug}` },
  };
}

export default async function InfoPage({ params }: { params: Params }) {
  const { slug } = await params;
  const page = getInfoPage(slug);
  if (!page) notFound();

  return (
    <div className={`container ${styles.wrap}`}>
      <Breadcrumbs
        crumbs={[
          { name: "Home", href: "/" },
          { name: page.title, href: `/info/${page.slug}` },
        ]}
      />
      <h1 className={styles.title}>{page.title}</h1>
      <p className={styles.flag}>Placeholder — this page will be updated before launch.</p>
      <div className={styles.body}>
        {page.body.map((p) => (
          <p key={p}>{p}</p>
        ))}
        {page.slug === "contact" && site.contact.email && (
          <p>
            Placeholder address{site.contact.isPlaceholder ? " (not monitored)" : ""}:{" "}
            <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
          </p>
        )}
      </div>
      <p className={styles.links}>
        <Link href="/shop" className="btn">
          Browse the shop
        </Link>
        <Link href="/" className="btn btn--ghost">
          Back to home
        </Link>
      </p>
    </div>
  );
}
