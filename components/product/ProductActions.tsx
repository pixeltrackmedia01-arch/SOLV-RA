"use client";

import { useState } from "react";
import { useWishlist } from "@/components/wishlist/WishlistContext";
import { useShopActions } from "@/lib/useShopActions";
import { HeartIcon, ShareIcon } from "@/components/Icons";
import styles from "./ProductExtras.module.css";

export function ProductActions({ id, title }: { id: string; title: string }) {
  const { toggleWishlist } = useShopActions();
  const { has, hydrated } = useWishlist();
  const [copied, setCopied] = useState(false);
  const saved = hydrated && has(id);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      /* user cancelled share sheet */
    }
  };

  return (
    <div className={styles.actions}>
      <button type="button" className={`${styles.action} ${saved ? styles.on : ""}`} aria-pressed={saved} onClick={() => toggleWishlist(id)}>
        <HeartIcon size={18} filled={saved} /> {saved ? "Saved" : "Save to wishlist"}
      </button>
      <button type="button" className={styles.action} onClick={share}>
        <ShareIcon size={18} /> {copied ? "Link copied" : "Share"}
      </button>
      <span className="visually-hidden" role="status" aria-live="polite">
        {copied ? "Link copied to clipboard" : ""}
      </span>
    </div>
  );
}
