import { Children, isValidElement, type ReactElement, type ReactNode } from "react";

/**
 * Splits headline text into words so they can rise in one by one.
 * Use inside an element with [data-split]. Supports plain strings and
 * single-level elements such as <span className="italic">.
 */
export function SplitText({ children }: { children: ReactNode }) {
  let i = 0;
  const words = (text: string, className?: string) =>
    text
      .split(/(\s+)/)
      .filter((t) => t.length)
      .map((t, k) =>
        /^\s+$/.test(t) ? (
          " "
        ) : (
          <span key={`${i}-${k}`} className={`split-w${className ? ` ${className}` : ""}`}>
            <span style={{ "--i": i++ } as React.CSSProperties}>{t}</span>
          </span>
        ),
      );

  return (
    <>
      {Children.toArray(children).flatMap((child): ReactNode[] => {
        if (typeof child === "string" || typeof child === "number") return words(String(child));
        if (isValidElement(child)) {
          const el = child as ReactElement<{ className?: string; children?: ReactNode }>;
          const inner = el.props.children;
          if (typeof inner === "string") return words(inner, el.props.className);
        }
        return [child];
      })}
    </>
  );
}
