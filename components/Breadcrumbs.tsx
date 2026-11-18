import Link from "next/link";
import type { Crumb } from "@/lib/jsonld";
import { breadcrumbLd } from "@/lib/jsonld";
import { JsonLd } from "./JsonLd";
import styles from "./Breadcrumbs.module.css";

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <>
      <nav aria-label="Breadcrumb" className={styles.nav}>
        <ol className={styles.list}>
          {crumbs.map((c, i) => {
            const last = i === crumbs.length - 1;
            return (
              <li key={c.href} className={styles.item}>
                {last ? (
                  <span aria-current="page">{c.name}</span>
                ) : (
                  <Link href={c.href}>{c.name}</Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbLd(crumbs)} />
    </>
  );
}
