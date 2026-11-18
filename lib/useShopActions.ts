"use client";

import { useCallback } from "react";
import { brandName } from "@/config/site";
import { cutout, getProduct } from "@/data/products";
import { useCart } from "@/components/cart/CartContext";
import { useWishlist } from "@/components/wishlist/WishlistContext";
import { useToast } from "@/components/toast/Toaster";

/** Add-to-cart and wishlist actions with consistent toast + screen-reader feedback. */
export function useShopActions() {
  const cart = useCart();
  const wishlist = useWishlist();
  const { push } = useToast();

  const addToCart = useCallback(
    (id: string, qty = 1) => {
      const p = getProduct(id);
      if (!p) return;
      cart.add(id, qty);
      const title = brandName(p.name);
      push({
        title: `Added ${qty} × ${title} to your cart.`,
        body: `${p.type} · ${p.color.name}`,
        image: { src: cutout(p).src, tint: p.color.hex },
        action: { label: "View cart", onClick: cart.openCart },
      });
    },
    [cart, push],
  );

  const toggleWishlist = useCallback(
    (id: string) => {
      const p = getProduct(id);
      if (!p) return;
      const added = wishlist.toggle(id);
      push({
        title: added ? `Saved ${brandName(p.name)} to your wishlist.` : `Removed ${brandName(p.name)} from your wishlist.`,
        image: { src: cutout(p).src, tint: p.color.hex },
      });
    },
    [wishlist, push],
  );

  return { addToCart, toggleWishlist, isWishlisted: wishlist.has };
}
