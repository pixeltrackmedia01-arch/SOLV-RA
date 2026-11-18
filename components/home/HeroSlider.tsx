import { brandName } from "@/config/site";
import { cutout, getProduct } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { HeroSliderClient, type HeroSlide, type HeroPiece } from "./HeroSliderClient";

/**
 * Hero slides. Each slide floods the screen with one product color, sets a
 * giant word behind the product and floats companion appliances around it
 * at different depths. Positions are in a 1440 × 900 design frame.
 *
 *   fruit  layer: sharp, mid-size companions + sparkles
 *   corner layer: large blurred companions in the bottom-left / top-right
 */
type Companion = { id: string; x: number; y: number; w: number; rot: number; layer: "fruit" | "corner" };

const SLIDES: { id: string; word: string; companions: Companion[] }[] = [
  {
    id: "pop-toaster",
    word: "Pop",
    companions: [
      { id: "sunny-kettle", x: 205, y: 455, w: 205, rot: -8, layer: "fruit" },
      { id: "brew-coffee-maker", x: 1065, y: 200, w: 165, rot: 9, layer: "fruit" },
      { id: "rice-cooker", x: -50, y: 610, w: 330, rot: 0, layer: "corner" },
      { id: "whip-hand-mixer", x: 1225, y: -10, w: 270, rot: 12, layer: "corner" },
    ],
  },
  {
    id: "sunny-kettle",
    word: "Sunny",
    companions: [
      { id: "pop-toaster", x: 195, y: 470, w: 215, rot: 7, layer: "fruit" },
      { id: "blue-kettle", x: 1070, y: 195, w: 160, rot: -10, layer: "fruit" },
      { id: "rice-cooker", x: -45, y: 605, w: 320, rot: 0, layer: "corner" },
      { id: "splash-blender", x: 1235, y: -20, w: 250, rot: 14, layer: "corner" },
    ],
  },
  {
    id: "splash-blender",
    word: "Splash",
    companions: [
      { id: "whip-hand-mixer", x: 200, y: 450, w: 205, rot: -6, layer: "fruit" },
      { id: "sunny-kettle", x: 1068, y: 205, w: 160, rot: 10, layer: "fruit" },
      { id: "crisp-air-fryer", x: -55, y: 600, w: 320, rot: 0, layer: "corner" },
      { id: "brew-coffee-maker", x: 1230, y: -15, w: 255, rot: 12, layer: "corner" },
    ],
  },
  {
    id: "whisk-stand-mixer",
    word: "Whisk",
    companions: [
      { id: "whip-hand-mixer", x: 205, y: 455, w: 200, rot: 8, layer: "fruit" },
      { id: "splash-blender", x: 1075, y: 195, w: 150, rot: -9, layer: "fruit" },
      { id: "reheat-microwave", x: -60, y: 620, w: 340, rot: 0, layer: "corner" },
      { id: "pop-toaster", x: 1220, y: -5, w: 270, rot: 14, layer: "corner" },
    ],
  },
  {
    id: "blue-kettle",
    word: "Blue",
    companions: [
      { id: "brew-coffee-maker", x: 205, y: 455, w: 200, rot: -7, layer: "fruit" },
      { id: "sunny-kettle", x: 1068, y: 200, w: 160, rot: 10, layer: "fruit" },
      { id: "crisp-air-fryer", x: -50, y: 610, w: 320, rot: 0, layer: "corner" },
      { id: "reheat-microwave", x: 1215, y: 0, w: 280, rot: 12, layer: "corner" },
    ],
  },
];

const SPARKLES: HeroPiece[] = [
  { kind: "sparkle", x: 395, y: 215, w: 44, rot: 0, layer: "fruit" },
  { kind: "sparkle", x: 1020, y: 605, w: 30, rot: 20, layer: "fruit" },
];

export function HeroSlider() {
  const slides: HeroSlide[] = SLIDES.map((s) => {
    const p = getProduct(s.id)!;
    const main = cutout(p);
    return {
      id: p.id,
      word: s.word,
      bg: p.color.hex,
      ink: p.color.ink,
      colorName: p.color.name,
      href: `/shop/${p.slug}`,
      title: brandName(p.name),
      type: p.type,
      price: formatPrice(p.price),
      main: { src: main.src, alt: main.alt },
      pieces: [
        ...s.companions.map((c) => ({
          kind: "product" as const,
          src: cutout(getProduct(c.id)!).src,
          x: c.x,
          y: c.y,
          w: c.w,
          rot: c.rot,
          layer: c.layer,
        })),
        ...SPARKLES,
      ],
    };
  });
  return <HeroSliderClient slides={slides} />;
}
