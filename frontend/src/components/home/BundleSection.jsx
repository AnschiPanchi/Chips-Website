import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Image } from "@/components/ui/image";
import SectionHeading from "./SectionHeading";
import { bundles } from "@/data/products";
import { inr } from "@/lib/format";
import { useCartStore } from "@/stores/cart";

const fills = {
  b2: "bg-brand-olive text-brand-paper",
  b3: "bg-brand-cream text-brand-forest",
};

export default function BundleSection() {
  const add = useCartStore((s) => s.add);
  const [hero, ...rest] = bundles;

  const addBundle = (bundle) => {
    add(bundle, bundle.variants[0], 1);
    toast.success(`${bundle.name} added to your bag`);
  };

  return (
    <section className="container-x py-16 lg:py-24">
      <SectionHeading
        eyebrow="Snack boxes"
        title="Buy the box, not the pack"
        copy="Curated mixes for hostel rooms, gaming nights and chai breaks. Cheaper than buying singles."
      />

      <div className="mt-10 grid gap-4 lg:mt-14 lg:grid-cols-2">
        <article className="group relative overflow-hidden rounded-2xl bg-brand-cream">
          <Image
            src={hero.image}
            alt={hero.name}
            className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] sm:h-80"
          />
          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow text-brand-chilli">Most popular box</p>
                <h3 className="mt-2 font-heading text-xl font-extrabold text-brand-forest">
                  {hero.name}
                </h3>
                <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-brand-forest/65">
                  {hero.description}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-heading text-lg font-extrabold text-brand-forest">
                  {inr(hero.price)}
                </p>
                <p className="text-[11px] text-brand-forest/40 line-through">{inr(hero.mrp)}</p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => addBundle(hero)}
                className="inline-flex items-center gap-1.5 rounded-md bg-brand-forest px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-paper transition-colors hover:bg-brand-ink"
              >
                <Plus className="h-3.5 w-3.5" /> Add box
              </button>
              <Link
                to="/products/$slug"
                params={{ slug: hero.slug }}
                className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-forest/60 underline decoration-brand-forest/20 underline-offset-4 hover:text-brand-forest"
              >
                What's inside
              </Link>
            </div>
          </div>
        </article>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {rest.map((bundle) => (
            <article
              key={bundle.id}
              className={`flex flex-col justify-between rounded-2xl p-6 sm:p-7 ${
                fills[bundle.id] || "bg-brand-cream text-brand-forest"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-heading text-lg font-extrabold leading-tight">{bundle.name}</h3>
                  <span className="shrink-0 rounded-full border border-current/25 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] opacity-70">
                    {bundle.weight}
                  </span>
                </div>
                <p className="mt-2 text-[13px] leading-relaxed opacity-70">{bundle.tagline}</p>
                <ul className="mt-4 space-y-1 text-[12px] opacity-70">
                  {bundle.items.slice(0, 3).map((item) => (
                    <li key={item}>· {item}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <p className="font-heading text-base font-extrabold">
                  {inr(bundle.price)}
                  <span className="ml-2 text-[11px] font-medium line-through opacity-40">
                    {inr(bundle.mrp)}
                  </span>
                </p>
                <button
                  type="button"
                  onClick={() => addBundle(bundle)}
                  className="rounded-md bg-current/0 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.14em] ring-1 ring-current/30 transition-colors hover:bg-current/10"
                >
                  Add box
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}