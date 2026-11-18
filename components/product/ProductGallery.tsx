"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductImage } from "@/data/products";
import styles from "./ProductGallery.module.css";

export function ProductGallery({ images, tint, name }: { images: ProductImage[]; tint: string; name: string }) {
  const [index, setIndex] = useState(0);
  const active = images[index];
  return (
    <div className={styles.gallery} style={{ "--tint": tint } as React.CSSProperties}>
      <div className={`${styles.main} ${active.kind === "lifestyle" ? styles.isLifestyle : ""}`}>
        {images.map((img, i) => (
          <Image
            key={img.src}
            src={img.src}
            alt={img.alt}
            width={img.width}
            height={img.height}
            sizes="(max-width: 860px) 100vw, 55vw"
            priority={i === 0}
            className={`${styles.img} ${img.kind === "lifestyle" ? styles.cover : ""}`}
            hidden={i !== index}
          />
        ))}
      </div>
      {images.length > 1 && (
        <ul className={styles.thumbs} aria-label={`${name} images`}>
          {images.map((img, i) => (
            <li key={img.src}>
              <button
                type="button"
                className={styles.thumb}
                aria-pressed={i === index}
                onClick={() => setIndex(i)}
              >
                <Image src={img.src} alt="" width={120} height={120} sizes="88px" />
                <span className="visually-hidden">
                  Show image {i + 1}: {img.kind === "lifestyle" ? "on the counter" : "product only"}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
