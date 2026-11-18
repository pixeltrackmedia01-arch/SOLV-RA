import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SplitText } from "@/components/SplitText";
import { WishlistView } from "@/components/wishlist/WishlistView";
import styles from "@/app/shop/shop.module.css";

export const metadata: Metadata = {
  title: "Your wishlist",
  description: "Appliances you've saved for later.",
  alternates: { canonical: "/wishlist" },
  robots: { index: false, follow: true },
};

export default function WishlistPage() {
  return (
    <div className="container">
      <header className={styles.head}>
        <Breadcrumbs crumbs={[{ name: "Home", href: "/" }, { name: "Wishlist", href: "/wishlist" }]} />
        <h1 className={styles.title} data-split>
          <SplitText>
            Saved for <span className="italic">later.</span>
          </SplitText>
        </h1>
        <p className="lede">Your wishlist is kept on this device — no account needed.</p>
      </header>
      <WishlistView />
    </div>
  );
}
