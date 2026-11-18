/** Decorative mid-century starburst. Purely ornamental (aria-hidden). */
export function Sunburst({
  rays = 24,
  color = "currentColor",
  className,
}: {
  rays?: number;
  color?: string;
  className?: string;
}) {
  const paths = Array.from({ length: rays }, (_, i) => {
    const a0 = (i / rays) * Math.PI * 2;
    const a1 = a0 + (Math.PI * 2) / rays / 2;
    const r = 100;
    const x0 = (100 + Math.cos(a0) * r).toFixed(2);
    const y0 = (100 + Math.sin(a0) * r).toFixed(2);
    const x1 = (100 + Math.cos(a1) * r).toFixed(2);
    const y1 = (100 + Math.sin(a1) * r).toFixed(2);
    return `M100 100L${x0} ${y0}L${x1} ${y1}Z`;
  }).join("");
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" focusable="false">
      <path d={paths} fill={color} />
    </svg>
  );
}

/** Four-point sparkle ornament. */
export function Sparkle({ className, color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true" focusable="false">
      <path d="M20 0c1.6 11 7.4 17.6 20 20-12.6 2.4-18.4 9-20 20-1.6-11-7.4-17.6-20-20C12.6 17.6 18.4 11 20 0Z" fill={color} />
    </svg>
  );
}
