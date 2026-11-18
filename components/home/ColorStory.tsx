import { brandName } from "@/config/site";
import { cutout, getProducts } from "@/data/products";
import { ColorStoryClient, type Chapter } from "./ColorStoryClient";

const STORY: { id: string; line: string }[] = [
  { id: "brew-coffee-maker", line: "Powder Blue, for unhurried weekend pots." },
  { id: "crisp-air-fryer", line: "Deep Teal: grown-up, glossy and quietly bold." },
  { id: "whip-hand-mixer", line: "Bubblegum Pink, because baking should be fun." },
  { id: "reheat-microwave", line: "Warm Cream, the soft neutral that ties a counter together." },
  { id: "rice-cooker", line: "Tangerine, a bright companion for everyday meals." },
];

export function ColorStory() {
  const products = getProducts(STORY.map((s) => s.id));
  const chapters: Chapter[] = products.map((p, i) => {
    const img = cutout(p);
    return {
      id: p.id,
      slug: p.slug,
      title: brandName(p.name),
      type: p.type,
      colorName: p.color.name,
      hex: p.color.hex,
      ink: p.color.ink,
      line: STORY[i].line,
      image: { src: img.src, alt: img.alt, width: img.width, height: img.height },
    };
  });
  return <ColorStoryClient chapters={chapters} />;
}
