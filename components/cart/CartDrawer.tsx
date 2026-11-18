"use client";

import Image from "next/image";
import Link from "next/link";
import { brandName, site } from "@/config/site";
import { cutout, featuredIds, getProducts, type Product } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { useModalDialog } from "@/lib/useModalDialog";
import { CloseIcon } from "@/components/Icons";
import { QuantitySelector } from "@/components/product/QuantitySelector";
import { useCart } from "./CartContext";
import { PlusIcon } from "@/components/Icons";
import styles from "./CartDrawer.module.css";

export function CartDrawer() {
  const { isOpen, closeCart, lines, count, subtotal, setQuantity, remove, announce } = useCart();
  const ref = useModalDialog(isOpen, closeCart);
  const inCart = new Set(lines.map((l) => l.product.id));
  const pool = lines.length ? lines.flatMap((l) => l.product.relatedIds) : featuredIds;
  const suggestions = getProducts([...new Set(pool)].filter((id) => !inCart.has(id))).slice(0, 3);

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
            <Suggestions title="Popular picks" items={suggestions} />
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
              {suggestions.length > 0 && (
                <li className={styles.suggestWrap}>
                  <Suggestions title="Pairs nicely with" items={suggestions} />
                </li>
              )}
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

function Suggestions({ title, items }: { title: string; items: Product[] }) {
  const { add, announce, closeCart } = useCart();
  if (!items.length) return null;
  return (
    <div className={styles.suggest}>
      <p className={styles.suggestTitle}>{title}</p>
      <ul>
        {items.map((p) => (
          <li key={p.id} className={styles.suggestItem}>
            <span className={styles.suggestThumb} style={{ background: p.color.hex }}>
              <Image src={cutout(p).src} alt="" width={56} height={56} sizes="56px" />
            </span>
            <Link href={`/shop/${p.slug}`} onClick={closeCart} className={styles.suggestName}>
              {brandName(p.name)}
              <span>
                {p.type} · {formatPrice(p.price)}
              </span>
            </Link>
            <button
              type="button"
              className={styles.suggestAdd}
              onClick={() => {
                add(p.id, 1);
                announce(`${brandName(p.name)} added to cart.`);
              }}
              aria-label={`Add ${brandName(p.name)} to cart`}
            >
              <PlusIcon size={16} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
