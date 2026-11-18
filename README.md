# Crab Appliances — storefront

A responsive e-commerce site for **Crab Appliances**, a retro-inspired kitchen appliance brand. Built with the Next.js App Router, TypeScript and CSS Modules. It has no UI or animation libraries.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # production
npm run typecheck
```

You need Node 20 or newer.

## Where to edit things

| What | File |
|---|---|
| Brand name, tagline, announcement bar, social links, contact, currency, commerce flags | `config/site.ts` |
| Products (copy, prices, colors, features, specs, related items) | `data/products.ts` |
| Categories and color-filter families | `data/products.ts` (bottom) |
| Journal articles (sample content) | `data/journal.ts` |
| Shipping / Returns / Contact / Privacy / Terms pages | `data/info.ts` |
| Design tokens (colors, type scale, spacing, motion) | `app/globals.css` |
| Fonts (self-hosted Archivo variable + Bodoni Moda italic, OFL) | `app/fonts/` |
| Homepage hero slider: slides, words, companion pieces | `components/home/HeroSlider.tsx` |
| Hero timeline (wipe curve, parallax factors, autoplay) | `components/home/HeroSliderClient.tsx` |

Product names are stored without the brand prefix (`"Pop"`). The prefix comes from `site.shortName`, so if you rename the brand, every product name updates with it.

## Homepage hero

A full-screen colour slider. Each slide floods the screen with one product colour, puts a giant word behind the product, and floats companion appliances at different depths; the two in the corners are blurred. Changing slide plays a 970 ms panel wipe that follows a measured coverage curve. The outgoing slide drifts away while the incoming layers glide in with parallax, and the companions travel farther than the word.

Controls: tabs, arrows, swipe, ←/→ keys, and a pause button. Autoplay runs every 4.8 s. It pauses for 6 s after any interaction, while keyboard focus is inside the hero, or when the hero is off screen. With reduced motion, slides swap instantly and nothing bobs.

## Store features

- **Shopping:** mega menu listing every product, a wishlist (heart on cards, header count, `/wishlist`), quick add on cards, toast notifications, cart suggestions, and the "Complete the set" bundle.
- **Product pages:** recently viewed, a sticky add-to-cart bar, share, accordions, and a colour-flood image slider that uses the same panel wipe as the hero.
- **Shop:** category-aware collection banners, plus category, colour, price and search filters with sorting.
- **Site-wide:** FAQ page (with FAQPage structured data), rotating announcement bar, back-to-top button, and a reading progress bar on articles.
- **Motion:** split-word headline reveals, clip-path image reveals, parallax, tilt and magnetic hover, and a scroll-reactive marquee (`components/MotionEffects.tsx`). All motion is disabled under reduced motion.

## Product images

The images come from the supplied Google Drive folder. They were converted to WebP and resized.

- `public/images/products/<id>.webp`: transparent cut-outs, 1100 × 1100
- `public/images/lifestyle/<id>.webp`: countertop scenes, 1400 × 1400
- `public/images/lifestyle/countertop-collection.webp`: full-range group shot, 1536 × 1024
- `public/images/inuse/<id>.webp`: people-using-it photos (4:5), used in galleries, category tiles, promos and "Shop the look"
- `public/images/banners/*.webp`: collection banners composed from the product cut-outs
- `public/og.jpg`: default social-share image, 1200 × 630

To replace a photo, overwrite the file and keep the same name and aspect ratio. Or change the `images` entry for that product in `data/products.ts`. All images go through `next/image`.

## Canonical URL

Set `NEXT_PUBLIC_SITE_URL` (e.g. `https://www.crabappliances.com`) in your hosting environment. Canonical tags, Open Graph URLs, `sitemap.xml`, `robots.txt` and JSON-LD all use it. The fallback is `https://www.crabappliances.example`.

## SEO included

- A title and description for each route, a title template, canonical URLs, and Open Graph / Twitter cards
- `sitemap.xml` and `robots.txt`
- JSON-LD: `Organization`, `WebSite` (with SearchAction → `/shop?q=`), `BreadcrumbList`, `Product`
- Product `offers` are left out of structured data while `commerce.pricesConfirmed` is `false`. Search engines only get confirmed prices. No ratings or reviews are emitted.

## Demo-only and placeholder content

- **Cart:** works fully on the front end and is saved in `localStorage`. **No checkout or payment is connected.** No order can be placed. Connect a commerce backend in `components/cart/CartContext.tsx`.
- **Newsletter:** validates the address and shows a demo success message. Nothing is sent or stored. To connect a provider, follow the steps at the top of `components/newsletter/NewsletterForm.tsx`.
- **Prices, specs and warranty:** these come from the supplied draft. The draft calls them suggested and proposed, to be confirmed with the manufacturer. Product pages show a "pre-launch details" notice; remove it by setting `site.prelaunchNotice` to `""`. Warranty terms are stored as `proposedWarranty` but are not shown.
- **Availability:** every product is set to `available` as sample data.
- **Social links:** these point at platform home pages, not real accounts. Replace them in `config/site.ts`.
- **Contact email:** `hello@example.com` is a reserved placeholder domain.
- **Policy pages and journal articles:** clearly labelled starter content.
