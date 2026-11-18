"use client";

/**
 * Newsletter sign-up — DEMO ONLY.
 * No mailing-list provider is connected: submitting validates the
 * address and shows a local success message, but nothing is sent or stored.
 *
 * To connect a provider (Klaviyo, Mailchimp, Buttondown, …):
 *   1. Create a route handler, e.g. app/api/newsletter/route.ts, that calls
 *      the provider's API with a server-side secret.
 *   2. Replace the `simulate` call below with fetch("/api/newsletter", …).
 *   3. Set `newsletter.providerConnected` to true in config/site.ts.
 */

import { useId, useState } from "react";
import { site } from "@/config/site";
import styles from "./NewsletterForm.module.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Status = "idle" | "submitting" | "success" | "error";

export function NewsletterForm({ tone = "light" }: { tone?: "light" | "dark" }) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const validate = (value: string) => {
    if (!value.trim()) return "Please enter your email address.";
    if (!EMAIL_RE.test(value.trim())) return "That doesn’t look like a valid email — check for typos like a missing “@”.";
    return "";
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const msg = validate(email);
    if (msg) {
      setError(msg);
      setStatus("error");
      return;
    }
    setError("");
    setStatus("submitting");
    await new Promise((r) => setTimeout(r, 500)); // simulate network latency
    setStatus("success");
  };

  if (status === "success") {
    return (
      <div className={`${styles.success} ${tone === "dark" ? styles.dark : ""}`} role="status">
        <p className={styles.successTitle}>You’re on the list — almost.</p>
        <p>
          {site.newsletter.providerConnected
            ? `Thanks! We’ll send updates to ${email.trim()}.`
            : `This is a demo, so ${email.trim()} wasn’t actually sent anywhere or stored. Once a newsletter provider is connected, this form will subscribe you for real.`}
        </p>
        <button
          type="button"
          className={styles.again}
          onClick={() => {
            setEmail("");
            setStatus("idle");
          }}
        >
          Use a different email
        </button>
      </div>
    );
  }

  const errId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <form className={`${styles.form} ${tone === "dark" ? styles.dark : ""}`} onSubmit={onSubmit} noValidate>
      <label htmlFor={`${id}-email`} className={styles.label}>
        Email address
      </label>
      <div className={styles.row}>
        <input
          id={`${id}-email`}
          className={styles.input}
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          value={email}
          aria-invalid={status === "error" ? true : undefined}
          aria-describedby={`${hintId}${status === "error" ? ` ${errId}` : ""}`}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") {
              const msg = validate(e.target.value);
              if (!msg) {
                setError("");
                setStatus("idle");
              }
            }
          }}
        />
        <button type="submit" className="btn" disabled={status === "submitting"}>
          {status === "submitting" ? "Signing up…" : "Sign up"}
        </button>
      </div>
      <p id={errId} className={styles.error} role="alert">
        {status === "error" ? error : ""}
      </p>
      <p id={hintId} className={styles.hint}>
        New colors, journal stories and launch news. Demo form — no emails are sent.
      </p>
    </form>
  );
}
