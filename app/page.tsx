import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { CategoryShelf } from "@/components/home/CategoryShelf";
import { ColorStory } from "@/components/home/ColorStory";
import { BrandStory } from "@/components/home/BrandStory";
import { Spotlight } from "@/components/home/Spotlight";
import { JournalPreview } from "@/components/home/JournalPreview";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <CategoryShelf />
      <ColorStory />
      <BrandStory />
      <Spotlight />
      <JournalPreview />
      <NewsletterSection />
    </>
  );
}
