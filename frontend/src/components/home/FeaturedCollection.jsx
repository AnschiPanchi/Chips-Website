import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { inr } from "@/lib/format";
import { products } from "@/data/products";

const featured = products[5];
const picks = [products[3], products[6], products[8]];

export default function FeaturedCollection() {
  return (
    <section className="bg-brand-forest text-brand-cream">
      <div className="container-x grid gap-10 py-16 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16 lg:py-24">
        <div className="relative">
          <div className="overflow-hidden rounded-2xl bg-brand-olive/20">
            <Image
              src={featured.image}
              alt={featured.name}
              className="aspect-[5/4] w-full object-cover"
            />
          </div>
          <div className="absolute bottom-4 left-4 rounded-lg bg-brand-paper/95 px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-forest/50">
              Collection
            </p>
            <p className="font-heading text-sm font-bold text-brand-forest">Millet snacks</p>
          </div>
        </div>

        <div>
          <p className="eyebrow text-brand-chilli">Featured collection</p>
          <h2 className="mt-4 max-w-md font-heading text-[clamp(1.75rem,3.4vw,2.6rem)] font-extrabold leading-[1.05] tracking-[-0.03em]">
            Ancient grains, new-school crunch.
          </h2>
          <p className="mt-4 max-w-md text-[14.5px] leading-relaxed text-brand-cream/65">
            Jowar, ragi and bajra, puffed and baked in cold-pressed oils. Higher in fibre, gluten
            free, and seasoned the way we actually eat at home.
          </p>

          <div className="mt-8 space-y-1">
            {picks.map((product) => (
              <Link
                key={product.id}
                to="/products/$slug"
                params={{ slug: product.slug }}
                className="group flex items-center justify-between gap-4 border-b border-brand-cream/12 py-3 transition-colors hover:border-brand-chilli/60"
              >
                <span className="text-[14px] font-medium text-brand-cream/85 group-hover:text-brand-cream">
                  {product.name}
                </span>
                <span className="font-heading text-[13px] font-bold text-brand-cream/70">
                  {inr(product.price)}
                </span>
              </Link>
            ))}
          </div>

          <Link
            to="/collections/$slug"
            params={{ slug: "millet-snacks" }}
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-brand-cream px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-forest transition-colors hover:bg-brand-chilli hover:text-brand-paper"
          >
            Shop millet snacks
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}