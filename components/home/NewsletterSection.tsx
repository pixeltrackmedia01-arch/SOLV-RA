import { NewsletterForm } from "@/components/newsletter/NewsletterForm";
import { Sunburst } from "./Sunburst";
import styles from "./Home.module.css";

export function NewsletterSection() {
  return (
    <section className={styles.newsletter} aria-labelledby="newsletter-title">
      <Sunburst className={styles.newsBurst} rays={32} />
      <div className={`container ${styles.newsletterInner}`}>
        <div>
          <p className="eyebrow">The Crab letter</p>
          <h2 id="newsletter-title" className={styles.h2}>
            Good news, <span className="italic">occasionally.</span>
          </h2>
          <p className={styles.newsText}>
            New colors, journal stories and the odd kitchen idea. No flood of emails.
          </p>
        </div>
        <NewsletterForm />
      </div>
    </section>
  );
}
