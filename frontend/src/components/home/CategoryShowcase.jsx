import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { categoryService } from "@/services/categoryService";

const tones = {
  chilli: "bg-brand-chilli text-brand-ink",
  olive: "bg-brand-olive text-brand-paper",
  forest: "bg-brand-forest text-brand-cream",
  cream: "bg-brand-cream text-brand-forest",
};

export default function CategoryShowcase() {
  const categories = categoryService.list();
  return (
    <section className="container-x py-16 lg:py-24">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="max-w-md font-heading text-[clamp(1.75rem,3.4vw,2.6rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-brand-forest">
          Four ways to crunch
        </h2>
        <p className="max-w-xs text-[13px] leading-relaxed text-brand-forest/55">
          Every range is made with cold-pressed oils. Pick your crunch.
        </p>
      </div>

      <div className="mt-10 grid gap-4 lg:mt-14 lg:grid-cols-4 lg:grid-rows-2">
        {categories.map((category, i) => {
          const Icon = category.icon;
          const featured = i === 0;
          return (
            <Link
              key={category.slug}
              to="/collections/$slug"
              params={{ slug: category.slug }}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl p-6 transition-transform duration-500 hover:-translate-y-1 lg:p-7 ${
                tones[category.tone] || tones.forest
              } ${featured ? "lg:col-span-2 lg:row-span-2 lg:min-h-[420px]" : "min-h-[190px]"}`}
            >
              <div className="flex items-start justify-between">
                <Icon
                  className={featured ? "h-9 w-9 opacity-80" : "h-6 w-6 opacity-70"}
                  strokeWidth={1.4}
                />
                <ArrowUpRight className="h-5 w-5 opacity-50 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
              </div>
              <div className="mt-10">
                <p className={`eyebrow ${featured ? "text-current/60" : "text-current/55"}`}>
                  {category.tagline}
                </p>
                <p
                  className={`mt-2 font-heading font-extrabold leading-none tracking-[-0.03em] ${
                    featured ? "text-[clamp(2rem,4vw,3.2rem)]" : "text-[clamp(1.25rem,2vw,1.6rem)]"
                  }`}
                >
                  {category.name}
                </p>
                <p
                  className={`mt-3 text-[12.5px] font-medium uppercase tracking-[0.14em] ${
                    featured ? "opacity-70" : "opacity-60"
                  }`}
                >
                  {category.count} products
                </p>
              </div>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full border border-current opacity-15 transition-transform duration-700 group-hover:scale-125"
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}