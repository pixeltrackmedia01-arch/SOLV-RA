"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useMemo, useState } from "react";
import { brandName } from "@/config/site";
import { cutout, products } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { searchProducts } from "@/lib/search";
import { useModalDialog } from "@/lib/useModalDialog";
import { CloseIcon, SearchIcon } from "@/components/Icons";
import styles from "./Search.module.css";

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useModalDialog(open, () => setOpen(false));
  const router = useRouter();
  const inputId = useId();

  const results = useMemo(() => (query.trim() ? searchProducts(products, query) : []), [query]);
  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        aria-label="Search products"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        <SearchIcon />
      </button>
      <dialog ref={ref} className={styles.dialog} aria-label="Search products">
        <form
          role="search"
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            const q = query.trim();
            close();
            router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
          }}
        >
          <label htmlFor={inputId} className="visually-hidden">
            Search products
          </label>
          <SearchIcon className={styles.formIcon} />
          <input
            id={inputId}
            className={styles.input}
            type="search"
            placeholder="Search kettles, colors, mixers…"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-describedby={`${inputId}-status`}
          />
          <button type="button" className={styles.close} onClick={close} aria-label="Close search">
            <CloseIcon />
          </button>
        </form>
        <div className={styles.body}>
          <p id={`${inputId}-status`} className={styles.status} role="status" aria-live="polite">
            {query.trim()
              ? `${results.length} ${results.length === 1 ? "result" : "results"} for “${query.trim()}”`
              : "Try “kettle”, “teal” or “baking”."}
          </p>
          {results.length > 0 && (
            <ul className={styles.results}>
              {results.map((p) => (
                <li key={p.id}>
                  <Link href={`/shop/${p.slug}`} className={styles.result} onClick={close}>
                    <span className={styles.thumb} style={{ background: p.color.hex }}>
                      <Image src={cutout(p).src} alt="" width={56} height={56} sizes="56px" />
                    </span>
                    <span className={styles.resultText}>
                      <span className={styles.resultName}>{brandName(p.name)}</span>
                      <span className={styles.resultMeta}>
                        {p.type} · {p.color.name}
                      </span>
                    </span>
                    <span className={styles.resultPrice}>{formatPrice(p.price)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {query.trim() && results.length === 0 && (
            <p className={styles.none}>
              Nothing matched. <Link href="/shop" onClick={close}>Browse all appliances</Link>.
            </p>
          )}
        </div>
      </dialog>
    </>
  );
}
