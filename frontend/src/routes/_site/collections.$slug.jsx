import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ProductBrowser from "@/components/product/ProductBrowser";
import { categoryService } from "@/services/categoryService";
import { productService } from "@/services/productService";

export const Route = createFileRoute("/_site/collections/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params?.slug?.replace(/-/g, " ") || "Collection"} — MORO` },
      { name: "description", content: "Palm-oil free snacks made with cold-pressed oils." },
    ],
  }),
  component: CollectionPage,
});

function CollectionPage() {
  const { slug } = Route.useParams();
  const category = categoryService.get(slug);
  const products = productService.list({ category: slug });
  const others = categoryService.list().filter((c) => c.slug !== slug);

  if (!category) {
    return (
      <div className="container-x py-24 text-center">
        <h1 className="font-heading text-2xl font-extrabold text-brand-forest">
          We couldn't find that collection
        </h1>
        <Link
          to="/shop"
          className="mt-6 inline-flex rounded-md bg-brand-forest px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-paper"
        >
          Shop all snacks
        </Link>
      </div>
    );
  }

  return (
    <div>
      <section className="bg-brand-cream">
        <div className="container-x py-12 lg:py-16">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-forest/50 hover:text-brand-forest"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> All snacks
          </Link>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
            <div>
              <p className="eyebrow text-brand-chilli">{category.tagline}</p>
              <h1 className="mt-3 font-heading text-[clamp(2.2rem,5vw,3.6rem)] font-extrabold leading-[0.98] tracking-[-0.03em] text-brand-forest">
                {category.name}
              </h1>
              <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-brand-forest/70">
                {category.description}
              </p>
            </div>
            <div className="flex items-center gap-6 lg:justify-end">
              <div>
                <p className="font-heading text-3xl font-extrabold text-brand-forest">
                  {category.count}
                </p>
                <p className="text-[11px] uppercase tracking-[0.14em] text-brand-forest/45">
                  Products
                </p>
              </div>
              <div className="h-10 w-px bg-brand-forest/15" />
              <div>
                <p className="font-heading text-3xl font-extrabold text-brand-forest">0%</p>
                <p className="text-[11px] uppercase tracking-[0.14em] text-brand-forest/45">
                  Palm oil
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-x py-12 lg:py-16">
        <ProductBrowser products={products} />
      </section>

      <section className="container-x pb-16 lg:pb-24">
        <div className="border-t border-brand-forest/12 pt-10">
          <h2 className="font-heading text-xl font-extrabold text-brand-forest">
            Other ranges to try
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {others.map((item) => (
              <Link
                key={item.slug}
                to="/collections/$slug"
                params={{ slug: item.slug }}
                className="group flex items-center justify-between rounded-xl border border-brand-forest/12 px-5 py-4 transition-colors hover:border-brand-forest hover:bg-brand-cream/60"
              >
                <span>
                  <span className="block font-heading text-sm font-bold text-brand-forest">
                    {item.name}
                  </span>
                  <span className="block text-[11px] uppercase tracking-[0.12em] text-brand-forest/45">
                    {item.count} products
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 text-brand-forest/35 transition-transform group-hover:translate-x-1 group-hover:text-brand-forest" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}