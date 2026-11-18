import styles from "./D2C.module.css";

/* Honest, verifiable service points — no delivery or warranty promises until confirmed. */
const items = [
  {
    title: "10 signature colors",
    text: "One shade per appliance, made to mix",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="8" cy="9" r="4.5" />
        <circle cx="16" cy="9" r="4.5" />
        <circle cx="12" cy="15.5" r="4.5" />
      </svg>
    ),
  },
  {
    title: "Simple dial controls",
    text: "Tactile, readable at a glance",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8" />
        <path d="M12 12V6.5" />
        <path d="M12 2v1.5M22 12h-1.5M12 22v-1.5M2 12h1.5" />
      </svg>
    ),
  },
  {
    title: "Full specs, every product",
    text: "Power, capacity and size listed",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <path d="M9 8h6M9 12h6M9 16h4" />
      </svg>
    ),
  },
  {
    title: "Save favourites",
    text: "Wishlist & cart kept on your device",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2Z" />
      </svg>
    ),
  },
];

export function TrustBar() {
  return (
    <section className={styles.trust} aria-label="Why shop Crab">
      <ul className={`container ${styles.trustList}`} data-stagger>
        {items.map((it) => (
          <li key={it.title} data-reveal>
            <span className={styles.trustIcon}>{it.icon}</span>
            <span>
              <strong>{it.title}</strong>
              <span>{it.text}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
