import Link from "next/link";
import { site } from "@/config/site";
import { categories } from "@/data/products";
import { infoPages } from "@/data/info";
import { Wordmark } from "@/components/Wordmark";
import { CurrentYear } from "./CurrentYear";
import styles from "./Footer.module.css";

const palette = ["#E94B35", "#F6C445", "#36AFA6", "#A8BE78", "#79BDE8", "#1F6663", "#E889A8", "#F5EBDD", "#F47A38", "#3158A5"];

export function Footer() {
  const help = infoPages.filter((p) => p.group === "help");
  const legal = infoPages.filter((p) => p.group === "legal");
  return (
    <footer className={styles.footer}>
      <div className={styles.stripe} aria-hidden="true">
        {palette.map((c) => (
          <span key={c} style={{ background: c }} />
        ))}
      </div>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <Wordmark />
          <p className={styles.tagline}>{site.tagline}</p>
        </div>

        <nav aria-labelledby="footer-shop" className={styles.col}>
          <h2 id="footer-shop" className={styles.heading}>
            Shop
          </h2>
          <ul>
            <li>
              <Link href="/shop">All appliances</Link>
            </li>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/shop?category=${c.slug}`}>{c.name}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-brand" className={styles.col}>
          <h2 id="footer-brand" className={styles.heading}>
            {site.shortName}
          </h2>
          <ul>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/journal">Journal</Link>
            </li>
            <li>
              <Link href="/info/contact">Contact</Link>
            </li>
            <li>
              <Link href="/faq">FAQ</Link>
            </li>
            <li>
              <Link href="/wishlist">Wishlist</Link>
            </li>
          </ul>
        </nav>

        <nav aria-labelledby="footer-help" className={styles.col}>
          <h2 id="footer-help" className={styles.heading}>
            Help
          </h2>
          <ul>
            {help.map((p) => (
              <li key={p.slug}>
                <Link href={`/info/${p.slug}`}>{p.title}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.col}>
          <h2 className={styles.heading}>Follow</h2>
          <ul>
            {site.social.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer">
                  {s.label}
                  <span className="visually-hidden"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <p>
          © <CurrentYear /> {site.name}. All rights reserved.
        </p>
        <ul className={styles.legal}>
          {legal.map((p) => (
            <li key={p.slug}>
              <Link href={`/info/${p.slug}`}>{p.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
