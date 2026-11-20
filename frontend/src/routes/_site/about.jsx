import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { media } from "@/data/media";
import { brand } from "@/lib/brand";

export const Route = createFileRoute("/_site/about")({
  head: () => ({
    meta: [
      { title: "Our story — OORA" },
      {
        name: "description",
        content:
          "Why OORA exists: baked, popped and roasted snacks with zero palm oil, made with cold-pressed oils and familiar Indian masalas.",
      },
    ],
  }),
  component: AboutPage,
});

const steps = [
  {
    step: "01",
    title: "Choose the base",
    copy: "Potatoes from Nilgiris farms, jowar and ragi from Karnataka and Maharashtra. Nothing that needs a chemistry degree.",
  },
  {
    step: "02",
    title: "Bake, pop or roast",
    copy: "No fryer, no palm oil. Oven-baked chips, hot-air popped crisps and slow-roasted namkeen in cold-pressed groundnut, sesame or sunflower oil.",
  },
  {
    step: "03",
    title: "Season like home",
    copy: "Chaat masala, amchur, curry leaf, Kashmiri chilli. Familiar flavours, dialled to a mild heat so everyone can share the pack.",
  },
];

const values = [
  { title: "Zero palm oil", copy: "Not a drop in any product, at any stage. It's the whole reason we started." },
  { title: "Readable labels", copy: "Short ingredient lists, no MSG, no maida, no flavour enhancers." },
  { title: "Millet first", copy: "Jowar, ragi and bajra in as many products as we can manage." },
  { title: "Honest pricing", copy: "No fake MRPs. One fair price, with bundles that actually save money." },
];

function AboutPage() {
  return (
    <div>
      <section className="container-x py-14 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16">
          <div>
            <p className="eyebrow text-brand-chilli">Our story</p>
            <h1 className="mt-4 font-heading text-[clamp(2.2rem,5vw,3.8rem)] font-extrabold leading-[0.98] tracking-[-0.035em] text-brand-forest">
              We just wanted a snack we could read the back of.
            </h1>
            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-brand-forest/70">
              {brand.name} started in a Bengaluru kitchen in 2024, with two trays of potato slices,
              a bottle of cold-pressed groundnut oil and a rule: nothing gets fried in palm oil.
            </p>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-brand-forest/70">
              We grew up on the corner-shop namkeen and the chips in the school canteen. We wanted
              that taste memory back, without the oil we can't stand behind. So we bake, pop and
              roast instead, and season with the masalas already in our kitchens.
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl">
            <Image
              src={media.story}
              alt="Millets, spices and cold-pressed oil"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-brand-forest text-brand-cream">
        <div className="container-x py-14 lg:py-20">
          <p className="eyebrow text-brand-chilli">How it's made</p>
          <h2 className="mt-3 max-w-xl font-heading text-[clamp(1.7rem,3.4vw,2.6rem)] font-extrabold leading-[1.06] tracking-[-0.03em]">
            Three steps, no shortcuts.
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {steps.map((item) => (
              <div key={item.step} className="border-t border-brand-cream/20 pt-5">
                <p className="font-heading text-[11px] font-bold tracking-[0.2em] text-brand-chilli">
                  {item.step}
                </p>
                <p className="mt-3 font-heading text-lg font-bold">{item.title}</p>
                <p className="mt-2 text-[13.5px] leading-relaxed text-brand-cream/65">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-14 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <h2 className="font-heading text-[clamp(1.7rem,3.4vw,2.4rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-brand-forest">
            What we won't compromise on
          </h2>
          <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {values.map((value) => (
              <div key={value.title}>
                <p className="font-heading text-[15px] font-bold text-brand-forest">{value.title}</p>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-brand-forest/65">
                  {value.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x pb-16 lg:pb-24">
        <div className="flex flex-col items-start justify-between gap-5 rounded-2xl bg-brand-cream px-6 py-10 sm:flex-row sm:items-center lg:px-10">
          <div>
            <p className="font-heading text-xl font-extrabold text-brand-forest sm:text-2xl">
              Try the box everyone orders twice.
            </p>
            <p className="mt-1.5 text-[13.5px] text-brand-forest/60">
              Five packs, one flat price, free shipping.
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 rounded-md bg-brand-forest px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-paper transition-colors hover:bg-brand-ink"
          >
            Shop the range <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}