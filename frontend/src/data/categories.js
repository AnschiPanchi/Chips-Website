import { Flame, Wind, Wheat, Soup } from "lucide-react";

export const categories = [
  {
    slug: "baked-chips",
    name: "Baked Chips",
    tagline: "Oven-baked, never fried",
    description:
      "Thin-cut potatoes baked until they crack, then seasoned with familiar Indian masalas. All the crunch, none of the palm oil.",
    icon: Flame,
    tone: "chilli",
  },
  {
    slug: "air-popped",
    name: "Air-Popped",
    tagline: "Hot air, zero oil",
    description:
      "Popped with hot air alone. Feather-light crisps with two or three ingredients, for the days you want the cleanest crunch.",
    icon: Wind,
    tone: "olive",
  },
  {
    slug: "millet-snacks",
    name: "Millet Snacks",
    tagline: "Jowar, ragi, bajra",
    description:
      "Millets puffed, roasted and pressed into chips, sev and puffs. Gluten-free, high in fibre, and genuinely tasty.",
    icon: Wheat,
    tone: "forest",
  },
  {
    slug: "namkeen",
    name: "Namkeen",
    tagline: "Street-side classics",
    description:
      "The corner-shop mixes you grew up on, roasted in cold-pressed groundnut oil with mild, familiar masalas.",
    icon: Soup,
    tone: "cream",
  },
];

export const findCategory = (slug) => categories.find((c) => c.slug === slug);

export default categories;