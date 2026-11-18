import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { site } from "@/config/site";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/components/Providers";
import { BackToTop } from "@/components/BackToTop";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { MotionEffects } from "@/components/MotionEffects";
import { JsonLd } from "@/components/JsonLd";
import { organizationLd, websiteLd } from "@/lib/jsonld";
import "./globals.css";

const archivo = localFont({
  src: "./fonts/Archivo-Variable.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--font-archivo",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "62% 125%" }],
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});

const bodoni = localFont({
  src: "./fonts/BodoniModa-Italic.woff2",
  weight: "400 900",
  style: "italic",
  variable: "--font-bodoni",
  display: "swap",
  preload: false,
  fallback: ["Didot", "Georgia", "serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Retro-inspired kitchen appliances in ten colors`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    url: "/",
    images: [{ url: site.ogImage, width: 1200, height: 630, alt: `${site.name} appliances on a sunny counter` }],
  },
  twitter: { card: "summary_large_image", images: [site.ogImage] },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#F8F3EA",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${bodoni.variable}`} suppressHydrationWarning>
      <head>
        {/* Enables progressive reveal animations only when JS is running. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Providers>
          <AnnouncementBar />
          <Header />
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <BackToTop />
        </Providers>
        <MotionEffects />
        <JsonLd data={[organizationLd(), websiteLd()]} />
      </body>
    </html>
  );
}
