import Link from "next/link";
import { Wordmark } from "@/components/Wordmark";
import { CartButton } from "@/components/cart/CartButton";
import { ShopMenu } from "./ShopMenu";
import { MobileNav } from "./MobileNav";
import { SearchDialog } from "./SearchDialog";
import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.bar}`}>
        <div className={styles.left}>
          <MobileNav />
          <Wordmark />
        </div>
        <nav aria-label="Main" className={styles.nav}>
          <ul className={styles.navList}>
            <li>
              <ShopMenu />
            </li>
            <li>
              <Link href="/about" className={styles.navLink}>
                About
              </Link>
            </li>
            <li>
              <Link href="/journal" className={styles.navLink}>
                Journal
              </Link>
            </li>
          </ul>
        </nav>
        <div className={styles.actions}>
          <SearchDialog />
          <CartButton />
        </div>
      </div>
    </header>
  );
}
