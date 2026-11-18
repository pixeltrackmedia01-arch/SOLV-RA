"use client";

import { useEffect, useRef } from "react";

/**
 * Drives a native <dialog> as a modal:
 * - showModal() gives focus containment, inert background and Escape-to-close.
 * - Focus returns to the element that opened it.
 * - Clicking the backdrop closes it.
 */
export function useModalDialog(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      returnFocus.current = document.activeElement as HTMLElement | null;
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const handleClose = () => {
      onCloseRef.current();
      const el = returnFocus.current;
      if (el && document.contains(el)) requestAnimationFrame(() => el.focus());
    };
    const handleClick = (e: MouseEvent) => {
      // A click whose target is the <dialog> itself landed on the backdrop.
      if (e.target === dialog) dialog.close();
    };
    dialog.addEventListener("close", handleClose);
    dialog.addEventListener("click", handleClick);
    return () => {
      dialog.removeEventListener("close", handleClose);
      dialog.removeEventListener("click", handleClick);
    };
  }, []);

  return ref;
}
