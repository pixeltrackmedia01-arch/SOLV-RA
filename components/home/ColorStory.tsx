import { brandName } from "@/config/site";
import { cutout, getProducts } from "@/data/products";
import { ColorStoryClient, type Chapter } from "./ColorStoryClient";

const STORY: { id: string; line: string }[] = [
  { id: "pop-toaster", line: "A confident red for the first slice of the day." },
  { id: "sunny-kettle", line: "Marigold: warm, golden and impossible to miss." },
  { id: "splash-blender", line: "Lagoon Teal, cool and fresh beside the fruit bowl." },
  { id: "whisk-stand-mixer", line: "A soft pistachio that feels at home on any counter." },
  { id: "brew-coffee-maker", line: "Powder Blue, for unhurried weekend pots." },
  { id: "blue-kettle", line: "Cobalt, our special edition, for a bolder pour." },
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
