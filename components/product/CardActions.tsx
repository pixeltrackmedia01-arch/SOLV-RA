"use client";

import { brandName } from "@/config/site";
import { useWishlist } from "@/components/wishlist/WishlistContext";
import { useShopActions } from "@/lib/useShopActions";
import { HeartIcon, PlusIcon } from "@/components/Icons";
import styles from "./ProductCard.module.css";

/** Wishlist heart + quick add, layered above the card's stretched link. */
export function CardActions({ id, name, available }: { id: string; name: string; available: boolean }) {
  const { addToCart, toggleWishlist } = useShopActions();
  const { has, hydrated } = useWishlist();
  const saved = hydrated && has(id);
  const title = brandName(name);
  return (
    <>
      <button
        type="button"
        className={`${styles.heart} ${saved ? styles.heartOn : ""}`}
        aria-pressed={saved}
        aria-label={saved ? `Remove ${title} from wishlist` : `Save ${title} to wishlist`}
        onClick={() => toggleWishlist(id)}
      >
        <HeartIcon size={18} filled={saved} />
      </button>
      {available && (
        <button type="button" className={styles.quickAdd} onClick={() => addToCart(id, 1)}>
          <PlusIcon size={16} /> Quick add<span className="visually-hidden"> {title} to cart</span>
        </button>
      )}
    </>
  );
}
