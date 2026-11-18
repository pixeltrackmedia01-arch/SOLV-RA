"use client";

import Image from "next/image";
import Link from "next/link";
import { brandName, site } from "@/config/site";
import { cutout } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { useModalDialog } from "@/lib/useModalDialog";
import { CloseIcon } from "@/components/Icons";
import { QuantitySelector } from "@/components/product/QuantitySelector";
import { useCart } from "./CartContext";
import styles from "./CartDrawer.module.css";

export function CartDrawer() {
  const { isOpen, closeCart, lines, count, subtotal, setQuantity, remove, announce } = useCart();
  const ref = useModalDialog(isOpen, closeCart);

  return (
    <dialog ref={ref} className={styles.drawer} aria-labelledby="cart-title">
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2 id="cart-title" className={styles.title}>
            Your cart {count > 0 && <span className={styles.count}>({count})</span>}
          </h2>
          <button type="button" className={styles.close} onClick={closeCart} aria-label="Close cart">
            <CloseIcon />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>Your cart is empty.</p>
            <p className={styles.emptyText}>Find a color that makes your counter smile.</p>
            <Link href="/shop" className="btn" onClick={closeCart}>
              Shop all appliances
            </Link>
          </div>
        ) : (
          <>
            <ul className={styles.lines}>
              {lines.map(({ product, qty, lineTotal }) => {
                const img = cutout(product);
                const title = brandName(product.name);
                return (
                  <li key={product.id} className={styles.line}>
                    <div
                      className={styles.thumb}
                      style={{ "--tint": product.color.hex } as React.CSSProperties}
                    >
                      <Image src={img.src} alt="" width={96} height={96} sizes="96px" />
                    </div>
                    <div className={styles.details}>
                      <Link href={`/shop/${product.slug}`} className={styles.name} onClick={closeCart}>
                        {title}
                      </Link>
                      <p className={styles.meta}>
                        {product.type} · {product.color.name}
                      </p>
                      <div className={styles.controls}>
                        <QuantitySelector
                          id={`cart-qty-${product.id}`}
                          label={title}
                          value={qty}
                          size="sm"
                          onChange={(n) => {
                            setQuantity(product.id, n);
                            announce(`${title} quantity updated to ${n}.`);
                          }}
                        />
                        <button
                          type="button"
                          className={styles.remove}
                          onClick={() => {
                            remove(product.id);
                            announce(`${title} removed from cart.`);
                          }}
                        >
                          Remove<span className="visually-hidden"> {title}</span>
                        </button>
                      </div>
                    </div>
                    <p className={styles.lineTotal}>{formatPrice(lineTotal)}</p>
                  </li>
                );
              })}
            </ul>

            <footer className={styles.footer}>
              <div className={styles.subtotal}>
                <span>Subtotal</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>
              <p className={styles.note}>
                This is a demo storefront. Checkout and payments are not connected, so no order can be
                placed and no payment details are collected.
                {!site.commerce.pricesConfirmed && " Prices shown are provisional."}
              </p>
              <button type="button" className="btn btn--block" disabled aria-describedby="checkout-note">
                Checkout unavailable in demo
              </button>
              <span id="checkout-note" className="visually-hidden">
                Checkout is not connected in this demo.
              </span>
              <Link href="/shop" className={`btn btn--ghost btn--block ${styles.continue}`} onClick={closeCart}>
                Continue shopping
              </Link>
            </footer>
          </>
        )}
      </div>
    </dialog>
  );
}
