import { site } from "@/config/site";

const formatter = new Intl.NumberFormat(site.commerce.currencyLocale, {
  style: "currency",
  currency: site.commerce.currency,
  maximumFractionDigits: 0,
});

export function formatPrice(amount: number | null | undefined) {
  if (amount == null) return null;
  return formatter.format(amount);
}
