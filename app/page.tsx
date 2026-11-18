import type { Metadata } from "next";
import { HeroSlider } from "@/components/home/HeroSlider";
import { TrustBar } from "@/components/home/TrustBar";
import { CategoryTiles } from "@/components/home/CategoryTiles";
import { ProductTabs } from "@/components/home/ProductTabs";
import { PromoSplit } from "@/components/home/PromoSplit";
import { ImageBanner } from "@/components/home/ImageBanner";
import { ShopByColor } from "@/components/home/ShopByColor";
import { Spotlight } from "@/components/home/Spotlight";
import { Lookbook } from "@/components/home/Lookbook";
import { Marquee } from "@/components/home/Marquee";
import { BrandStory } from "@/components/home/BrandStory";
import { JournalPreview } from "@/components/home/JournalPreview";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <TrustBar />
      <CategoryTiles />
      <ProductTabs />
      <PromoSplit />
      <ImageBanner />
      <ShopByColor />
      <Spotlight />
      <Lookbook />
      <Marquee />
      <BrandStory />
      <JournalPreview />
      <NewsletterSection />
    </>
  );
}
