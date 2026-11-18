"use client";

import Link from "next/link";
import { getProducts } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { useShopActions } from "@/lib/useShopActions";
import { useWishlist } from "./WishlistContext";
import styles from "./Wishlist.module.css";

export function WishlistView() {
  const { ids, hydrated } = useWishlist();
  const { addToCart } = useShopActions();
  const items = getProducts(ids);

  if (!hydrated) return <p className={styles.loading}>Loading your wishlist…</p>;

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <h2>Nothing saved yet.</h2>
        <p>Tap the heart on any appliance to keep it here.</p>
        <Link href="/shop" className="btn">
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className={styles.bar}>
        <p>
          <strong>{items.length}</strong> saved {items.length === 1 ? "appliance" : "appliances"}
        </p>
        <button type="button" className="btn btn--ghost" onClick={() => items.forEach((p) => addToCart(p.id, 1))}>
          Add all to cart
        </button>
      </div>
      <ul className={styles.grid}>
        {items.map((p) => (
          <li key={p.id}>
            <ProductCard product={p} headingLevel="h2" />
          </li>
        ))}
      </ul>
    </>
  );
}
