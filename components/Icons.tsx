import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 22, ...rest }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    focusable: false,
    ...rest,
  };
}

export const SearchIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export const BagIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
);

export const MenuIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const CloseIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const ArrowRight = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const ChevronDown = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const PlusIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const MinusIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 12h14" />
  </svg>
);

export const CheckIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);

/** Small geometric crab mark used in the wordmark and footer. */
export const CrabMark = ({ size = 34, ...rest }: IconProps) => (
  <svg
    width={size}
    height={(size * 28) / 40}
    viewBox="0 0 40 28"
    fill="none"
    aria-hidden="true"
    focusable="false"
    {...rest}
  >
    <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
      <path d="M10.5 21.5 6.5 25.5M14 22l-2 4.5M29.5 21.5l4 4M26 22l2 4.5" />
      <path d="M16 13V9.5M24 13V9.5" />
      <path d="M11 15.5C6.5 15 4 12 4.3 8.2M4.3 8.2a4 4 0 1 1 6.2-2.4L7.4 7.6M29 15.5c4.5-.5 7-3.5 6.7-7.3M35.7 8.2a4 4 0 1 0-6.2-2.4l3.1 1.8" />
    </g>
    <circle cx="16" cy="8" r="2.2" fill="currentColor" />
    <circle cx="24" cy="8" r="2.2" fill="currentColor" />
    <path d="M8 22a12 9.5 0 0 1 24 0z" fill="currentColor" />
  </svg>
);
