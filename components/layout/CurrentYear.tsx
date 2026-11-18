"use client";

/** Renders the visitor's current year, so static pages never show a stale copyright. */
export function CurrentYear() {
  return <span suppressHydrationWarning>{new Date().getFullYear()}</span>;
}
