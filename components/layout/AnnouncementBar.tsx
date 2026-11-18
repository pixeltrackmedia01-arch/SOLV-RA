import Link from "next/link";
import { site } from "@/config/site";
import styles from "./Header.module.css";

export function AnnouncementBar() {
  if (!site.announcement.enabled) return null;
  return (
    <div className={styles.announcement}>
      <Link href={site.announcement.href}>
        {site.announcement.text} <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
