"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useShopActions } from "@/lib/useShopActions";
import styles from "./ProductExtras.module.css";

type Props = { id: string; title: string; price: string | null; img: string; tint: string; ink: string; targetId: string };

/** Appears once the main buy box scrolls out of view. */
export function StickyBuyBar({ id, title, price, img, tint, ink, targetId }: Props) {
  const [show, setShow] = useState(false);
  const { addToCart } = useShopActions();

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(target);
    return () => io.disconnect();
  }, [targetId]);

  return (
    <div className={`${styles.sticky} ${show ? styles.stickyOn : ""}`} aria-hidden={!show} inert={!show}>
      <div className={`container ${styles.stickyInner}`}>
        <span className={styles.stickyThumb} style={{ background: tint }}>
          <Image src={img} alt="" width={56} height={56} sizes="56px" />
        </span>
        <p className={styles.stickyName}>
          {title}
          {price && <span>{price}</span>}
        </p>
        <button
          type="button"
          className="btn"
          style={{ "--btn-bg": tint, "--btn-fg": ink, "--btn-border": "var(--ink)" } as React.CSSProperties}
          onClick={() => addToCart(id, 1)}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
