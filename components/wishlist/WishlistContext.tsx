"use client";

/** Wishlist saved in localStorage on this device only (no account needed). */

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getProduct } from "@/data/products";

const KEY = "crab-wishlist-v1";

type Ctx = {
  hydrated: boolean;
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => boolean;
  remove: (id: string) => void;
};

const WishlistCtx = createContext<Ctx | null>(null);

function read(): string[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string" && !!getProduct(x)) : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setIds(read());
    setHydrated(true);
    const onStorage = (e: StorageEvent) => e.key === KEY && setIds(read());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(ids));
    } catch {
      /* storage unavailable */
    }
  }, [ids, hydrated]);

  const toggle = useCallback(
    (id: string) => {
      const adding = !ids.includes(id);
      setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
      return adding;
    },
    [ids],
  );

  const remove = useCallback((id: string) => setIds((prev) => prev.filter((x) => x !== id)), []);

  const value = useMemo<Ctx>(
    () => ({ hydrated, ids, has: (id) => ids.includes(id), toggle, remove }),
    [hydrated, ids, toggle, remove],
  );

  return <WishlistCtx.Provider value={value}>{children}</WishlistCtx.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistCtx);
  if (!ctx) throw new Error("useWishlist must be used inside <WishlistProvider>");
  return ctx;
}
