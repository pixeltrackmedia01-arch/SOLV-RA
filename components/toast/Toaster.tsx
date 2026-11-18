"use client";

import Image from "next/image";
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { CheckIcon, CloseIcon } from "@/components/Icons";
import styles from "./Toaster.module.css";

export type Toast = {
  id?: number;
  title: string;
  body?: string;
  image?: { src: string; tint: string };
  action?: { label: string; onClick: () => void };
};

type ToastCtx = { push: (t: Toast) => void };
const Ctx = createContext<ToastCtx | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<(Toast & { id: number })[]>([]);
  const seq = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((ts) => ts.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (t: Toast) => {
      const id = ++seq.current;
      setToasts((ts) => [...ts.slice(-2), { ...t, id }]);
      window.setTimeout(() => dismiss(id), 4500);
    },
    [dismiss],
  );

  return (
    <Ctx.Provider value={{ push }}>
      {children}
      <div className={styles.region} role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={styles.toast}>
            {t.image ? (
              <span className={styles.thumb} style={{ background: t.image.tint }}>
                <Image src={t.image.src} alt="" width={64} height={64} sizes="64px" />
              </span>
            ) : (
              <span className={styles.icon}>
                <CheckIcon size={18} />
              </span>
            )}
            <div className={styles.text}>
              <p className={styles.title}>{t.title}</p>
              {t.body && <p className={styles.body}>{t.body}</p>}
            </div>
            {t.action && (
              <button
                type="button"
                className={styles.action}
                onClick={() => {
                  t.action!.onClick();
                  dismiss(t.id);
                }}
              >
                {t.action.label}
              </button>
            )}
            <button type="button" className={styles.close} onClick={() => dismiss(t.id)} aria-label="Dismiss notification">
              <CloseIcon size={16} />
            </button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
