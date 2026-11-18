"use client";

/**
 * Front-end DEMO cart.
 * - Stored in localStorage only; nothing is sent to a server.
 * - No checkout, payment or order placement is connected.
 * To connect a real commerce backend (Shopify, Medusa, Stripe, …),
 * replace the add/setQuantity/remove implementations here.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { site } from "@/config/site";
import { getProduct, type Product } from "@/data/products";

const STORAGE_KEY = "crab-cart-v1";

type StoredLine = { id: string; qty: number };
export type CartLine = { product: Product; qty: number; lineTotal: number };

type CartContextValue = {
  hydrated: boolean;
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (id: string, qty?: number) => void;
  setQuantity: (id: string, qty: number) => void;
  remove: (id: string) => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  announce: (message: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const clamp = (n: number) => Math.max(1, Math.min(site.commerce.maxQuantity, Math.round(n)));

function readStorage(): StoredLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (l): l is StoredLine =>
          typeof l === "object" && l !== null && typeof l.id === "string" && typeof l.qty === "number",
      )
      .filter((l) => getProduct(l.id))
      .map((l) => ({ id: l.id, qty: clamp(l.qty) }));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<StoredLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const msgTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hydrate from storage after mount to avoid server/client mismatch.
  useEffect(() => {
    setItems(readStorage());
    setHydrated(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setItems(readStorage());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable (private mode, quota) — cart still works for this page view */
    }
  }, [items, hydrated]);

  const announce = useCallback((text: string) => {
    if (msgTimer.current) clearTimeout(msgTimer.current);
    // Clear first so repeated identical messages are re-announced.
    setMessage("");
    msgTimer.current = setTimeout(() => setMessage(text), 60);
  }, []);

  const add = useCallback((id: string, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((l) => l.id === id);
      if (existing) return prev.map((l) => (l.id === id ? { ...l, qty: clamp(l.qty + qty) } : l));
      return [...prev, { id, qty: clamp(qty) }];
    });
  }, []);

  const setQuantity = useCallback((id: string, qty: number) => {
    setItems((prev) => prev.map((l) => (l.id === id ? { ...l, qty: clamp(qty) } : l)));
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const lines: CartLine[] = items.flatMap((l) => {
      const product = getProduct(l.id);
      if (!product) return [];
      return [{ product, qty: l.qty, lineTotal: (product.price ?? 0) * l.qty }];
    });
    return {
      hydrated,
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal: lines.reduce((n, l) => n + l.lineTotal, 0),
      add,
      setQuantity,
      remove,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      announce,
    };
  }, [items, hydrated, add, setQuantity, remove, isOpen, announce]);

  return (
    <CartContext.Provider value={value}>
      {children}
      <div className="visually-hidden" role="status" aria-live="polite" aria-atomic="true">
        {message}
      </div>
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
