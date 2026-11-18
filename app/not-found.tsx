import type { Metadata } from "next";
import Link from "next/link";
import { CrabMark } from "@/components/Icons";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className={`container ${styles.wrap}`}>
      <div className={styles.crab} aria-hidden="true">
        <CrabMark size={120} />
      </div>
      <p className="eyebrow">Error 404</p>
      <h1 className={styles.title}>
        This page went <span className="italic">sideways.</span>
      </h1>
      <p className="lede">
        The link may be old or mistyped. Let’s get you back to somewhere more colorful.
      </p>
      <div className={styles.links}>
        <Link href="/shop" className="btn">
          Shop all appliances
        </Link>
        <Link href="/" className="btn btn--ghost">
          Go to the homepage
        </Link>
      </div>
    </div>
  );
}
