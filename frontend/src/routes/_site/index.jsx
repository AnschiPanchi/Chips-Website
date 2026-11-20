import { createFileRoute } from "@tanstack/react-router";
import Hero from "@/components/home/Hero";
import UspStrip from "@/components/home/UspStrip";
import Bestsellers from "@/components/home/Bestsellers";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import BrandStory from "@/components/home/BrandStory";
import FlavourShowcase from "@/components/home/FlavourShowcase";
import FeaturedCollection from "@/components/home/FeaturedCollection";
import BundleSection from "@/components/home/BundleSection";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";

export const Route = createFileRoute("/_site/")({
  head: () => ({
    meta: [
      { title: "MORO — Big Flavour. Zero Palm Oil." },
      {
        name: "description",
        content:
          "Baked chips, air-popped crisps, millet snacks and namkeen made with cold-pressed oils and zero palm oil. Big crunch, full-on flavour.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Hero />
      <UspStrip />
      <Bestsellers />
      <CategoryShowcase />
      <BrandStory />
      <FlavourShowcase />
      <FeaturedCollection />
      <BundleSection />
      <Testimonials />
      <Newsletter />
    </>
  );
}