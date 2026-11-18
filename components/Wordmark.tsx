import Link from "next/link";
import { site } from "@/config/site";
import { CrabMark } from "./Icons";
import styles from "./Wordmark.module.css";

export function Wordmark({ asLink = true }: { asLink?: boolean }) {
  const inner = (
    <>
      <CrabMark className={styles.mark} />
      <span className={styles.text}>
        <span className={styles.primary}>{site.shortName}</span>
        <span className={styles.secondary}>{site.wordmarkSub}</span>
      </span>
    </>
  );
  if (!asLink) return <span className={styles.wordmark}>{inner}</span>;
  return (
    <Link href="/" className={styles.wordmark} aria-label={`${site.name} — home`}>
      {inner}
    </Link>
  );
}
