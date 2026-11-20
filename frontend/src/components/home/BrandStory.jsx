import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { media } from "@/data/media";

const stats = [
  { value: "0%", label: "palm oil, across the range" },
  { value: "4", label: "cold-pressed oils in rotation" },
  { value: "100%", label: "baked, popped or roasted" },
];

export default function BrandStory() {
  return (
    <section className="bg-brand-cream">
      <div className="container-x grid items-center gap-10 py-16 lg:grid-cols-2 lg:gap-20 lg:py-24">
        <div className="relative">
          <div className="overflow-hidden rounded-2xl">
            <Image
              src={media.story}
              alt="Millets, spices and cold-pressed oil on a wooden table"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 right-4 hidden rounded-xl bg-brand-paper px-5 py-4 shadow-lg sm:block">
            <p className="font-heading text-2xl font-extrabold text-brand-forest">Since 2024</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-brand-forest/50">
              Bengaluru kitchen
            </p>
          </div>
        </div>

        <div>
          <p className="eyebrow text-brand-chilli">Why we started</p>
          <h2 className="mt-4 max-w-lg font-heading text-[clamp(1.75rem,3.4vw,2.6rem)] font-extrabold leading-[1.06] tracking-[-0.03em] text-brand-forest">
            We wanted the crunch without the palm oil.
          </h2>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-brand-forest/70">
            Every snack we grew up loving was fried in palm oil, dusted with MSG and sold in a
            packet that promised nothing. So we started baking, popping and roasting instead —
            using jowar, ragi, potatoes and the masalas already in our kitchens.
          </p>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-brand-forest/70">
            Same taste memory. Same loud crunch. A label you can actually read.
          </p>

          <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-brand-forest/12 pt-7">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="font-heading text-[clamp(1.4rem,2.4vw,1.9rem)] font-extrabold text-brand-forest">
                  {stat.value}
                </dt>
                <dd className="mt-1 text-[11.5px] leading-snug text-brand-forest/55">{stat.label}</dd>
              </div>
            ))}
          </dl>

          <Link
            to="/about"
            className="mt-8 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-forest transition-colors hover:text-brand-chilli"
          >
            Read the full story
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}