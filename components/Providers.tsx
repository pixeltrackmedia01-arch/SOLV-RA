"use client";

import type { ReactNode } from "react";
import { CartProvider } from "@/components/cart/CartContext";
import { WishlistProvider } from "@/components/wishlist/WishlistContext";
import { ToastProvider } from "@/components/toast/Toaster";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <WishlistProvider>
        <CartProvider>{children}</CartProvider>
      </WishlistProvider>
    </ToastProvider>
  );
}
