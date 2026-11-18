/**
 * Shared panel-wipe transition (same measured curve as the homepage hero).
 * The outgoing slide is clipped from its leading edge while its layers drift
 * away; the incoming slide's layers glide in with per-layer parallax.
 */

const COVER_T = [0, 0.031, 0.134, 0.206, 0.278, 0.34, 0.412, 0.485, 0.546, 0.583, 0.62, 0.69, 0.79, 0.85, 0.93, 1];
const COVER_C = [0, 0.006, 0.012, 0.023, 0.047, 0.07, 0.105, 0.158, 0.246, 0.55, 0.825, 0.9, 0.94, 0.956, 0.975, 1];

export function cover(t: number) {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  let i = 0;
  while (i < COVER_T.length - 2 && t > COVER_T[i + 1]) i++;
  const k = (t - COVER_T[i]) / (COVER_T[i + 1] - COVER_T[i]);
  const s = 3 * k * k - 2 * k * k * k;
  return COVER_C[i] + (COVER_C[i + 1] - COVER_C[i]) * s;
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const easeOutQuad = (k: number) => 1 - (1 - k) * (1 - k);

type WipeOptions = {
  from: HTMLElement;
  to: HTMLElement;
  fromLayers: (HTMLElement | null)[];
  toLayers: (HTMLElement | null)[];
  /** Parallax factor per incoming layer (fraction of width). */
  factors: number[];
  dir: 1 | -1;
  width: number;
  duration?: number;
  onDone: () => void;
};

export function runWipe({ from, to, fromLayers, toLayers, factors, dir, width: W, duration = 970, onDone }: WipeOptions) {
  toLayers.forEach((l, i) => {
    if (l) l.style.transform = `translate3d(${dir * (factors[i] ?? 0.3) * W}px,0,0)`;
  });
  to.style.zIndex = "1";
  to.style.visibility = "visible";
  from.style.zIndex = "2";

  const start = performance.now();
  const step = (now: number) => {
    const t = (now - start) / duration;
    const c = cover(t);
    from.style.clipPath = dir > 0 ? `inset(0 ${c * 100}% 0 0)` : `inset(0 0 0 ${c * 100}%)`;
    fromLayers.forEach((l) => l && (l.style.transform = `translate3d(${-dir * c * 0.14 * W}px,0,0)`));
    const k = easeOutQuad(clamp01((t - 0.5) / 0.42));
    toLayers.forEach((l, i) => {
      if (l) l.style.transform = k >= 1 ? "" : `translate3d(${dir * (1 - k) * (factors[i] ?? 0.3) * W}px,0,0)`;
    });
    if (t < 1 || k < 1) {
      requestAnimationFrame(step);
      return;
    }
    from.style.clipPath = "";
    from.style.visibility = "hidden";
    from.style.zIndex = "0";
    fromLayers.forEach((l) => l && (l.style.transform = ""));
    to.style.zIndex = "2";
    onDone();
  };
  requestAnimationFrame(step);
}
