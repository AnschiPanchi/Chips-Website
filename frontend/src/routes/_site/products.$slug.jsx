import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronRight, Heart, Minus, Plus, ShieldCheck, Truck } from "lucide-react";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Image } from "@/components/ui/image";
import ProductGallery from "@/components/product/ProductGallery";
import ProductGrid from "@/components/product/ProductGrid";
import QuantitySelector from "@/components/product/QuantitySelector";
import Stars from "@/components/product/Stars";
import { inr, pctOff, shortDate } from "@/lib/format";
import { productService } from "@/services/productService";
import { useCartStore } from "@/stores/cart";
import { useWishlistStore } from "@/stores/wishlist";
import { useMounted } from "@/hooks/useMounted";
import { reviews } from "@/data/reviews";

export const Route = createFileRoute("/_site/products/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params?.slug?.replace(/-/g, " ") || "Snack"} — OORA` },
      { name: "description", content: "Baked and air-popped snacks with zero palm oil." },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const product = productService.bySlug(slug);
  const add = useCartStore((s) => s.add);
  const ids = useWishlistStore((s) => s.ids);
  const toggle = useWishlistStore((s) => s.toggle);
  const mounted = useMounted();
  const [variantIndex, setVariantIndex] = useState(0);
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <div className="container-x py-24 text-center">
        <h1 className="font-heading text-2xl font-extrabold text-brand-forest">Snack not found</h1>
        <Link
          to="/shop"
          className="mt-6 inline-flex rounded-md bg-brand-forest px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-paper"
        >
          Browse all snacks
        </Link>
      </div>
    );
  }

  const variant = product.variants[variantIndex] || product.variants[0];
  const soldOut = !(variant?.stock > 0);
  const saved = mounted && ids.includes(product.id);
  const off = pctOff(variant.price, variant.mrp);
  const productReviews = reviews.filter((r) => r.productId === product.id && r.status === "published");
  const related = productService.related(slug, 4);

  const addToBag = () => {
    add(product, variant, qty);
    toast.success(`${product.name} added to your bag`);
  };

  const buyNow = () => {
    add(product, variant, qty);
    navigate({ to: "/checkout" });
  };

  return (
    <div>
      <div className="container-x pt-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] text-brand-forest/45">
          <Link to="/" className="hover:text-brand-forest">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/shop" className="hover:text-brand-forest">
            Shop
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-brand-forest/70">{product.name}</span>
        </nav>
      </div>

      <section className="container-x grid gap-10 py-8 lg:grid-cols-2 lg:gap-16 lg:py-12">
        <ProductGallery images={product.gallery} name={product.name} />

        <div className="lg:pt-2">
          <div className="flex flex-wrap items-center gap-2">
            {product.badges?.map((badge) => (
              <span
                key={badge}
                className="rounded-full bg-brand-cream px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-brand-forest"
              >
                {badge === "gluten-free" ? "Gluten free" : badge}
              </span>
            ))}
            <span className="rounded-full bg-brand-forest/8 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-brand-forest/70">
              {product.heat === 1 ? "Mild" : "Mild-medium"} heat
            </span>
          </div>

          <h1 className="mt-4 font-heading text-[clamp(1.9rem,3.6vw,2.8rem)] font-extrabold leading-[1.02] tracking-[-0.03em] text-brand-forest">
            {product.name}
          </h1>
          <p className="mt-2 text-[14px] text-brand-forest/60">{product.tagline}</p>

          <div className="mt-4 flex items-center gap-3">
            <Stars value={product.rating} size={14} showValue count={product.reviewCount} />
            <span className="text-[11px] text-brand-forest/35">·</span>
            <span className="text-[11px] uppercase tracking-[0.12em] text-brand-forest/45">
              {product.oil}
            </span>
          </div>

          <div className="mt-6 flex items-end gap-3">
            <p className="font-heading text-3xl font-extrabold text-brand-forest">
              {inr(variant.price)}
            </p>
            {variant.mrp > variant.price && (
              <>
                <p className="pb-1 text-sm text-brand-forest/40 line-through">{inr(variant.mrp)}</p>
                <span className="mb-1 rounded bg-brand-chilli/12 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-brand-chilli">
                  {off}% off
                </span>
              </>
            )}
          </div>
          <p className="mt-1 text-[11px] text-brand-forest/40">Inclusive of all taxes</p>

          <div className="mt-7">
            <p className="eyebrow text-brand-forest/45">Pack size</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.variants.map((option, index) => (
                <button
                  key={option.weight}
                  type="button"
                  onClick={() => setVariantIndex(index)}
                  aria-pressed={variantIndex === index}
                  className={`rounded-md border px-4 py-2.5 text-[12.5px] font-semibold transition-colors ${
                    variantIndex === index
                      ? "border-brand-forest bg-brand-forest text-brand-paper"
                      : "border-brand-forest/20 text-brand-forest hover:border-brand-forest"
                  } ${option.stock === 0 ? "opacity-45" : ""}`}
                >
                  {option.weight} · {inr(option.price)}
                </button>
              ))}
            </div>
            {soldOut && (
              <p className="mt-2 text-[12px] font-medium text-brand-chilli">
                This pack size is sold out. Try the other size.
              </p>
            )}
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <QuantitySelector value={qty} onChange={setQty} max={Math.min(10, variant.stock || 1)} />
            <button
              type="button"
              onClick={addToBag}
              disabled={soldOut}
              className="flex-1 rounded-md bg-brand-forest px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-paper transition-colors hover:bg-brand-ink disabled:cursor-not-allowed disabled:opacity-40"
            >
              Add to bag
            </button>
            <button
              type="button"
              onClick={() => {
                const added = toggle(product.id);
                toast(added ? "Saved to wishlist" : "Removed from wishlist");
              }}
              aria-label="Save to wishlist"
              className="grid h-[46px] w-[46px] place-items-center rounded-md border border-brand-forest/20 text-brand-forest transition-colors hover:border-brand-forest"
            >
              <Heart className={`h-4 w-4 ${saved ? "fill-brand-chilli text-brand-chilli" : ""}`} />
            </button>
          </div>

          <button
            type="button"
            onClick={buyNow}
            disabled={soldOut}
            className="mt-3 w-full rounded-md border border-brand-forest/25 px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-forest transition-colors hover:border-brand-forest hover:bg-brand-forest/5 disabled:opacity-40"
          >
            Buy now
          </button>

          <div className="mt-7 grid gap-3 border-t border-brand-forest/12 pt-6 sm:grid-cols-2">
            <p className="flex items-center gap-2 text-[12px] text-brand-forest/65">
              <Truck className="h-4 w-4 text-brand-olive" /> Ships in 24 hours from Bengaluru
            </p>
            <p className="flex items-center gap-2 text-[12px] text-brand-forest/65">
              <ShieldCheck className="h-4 w-4 text-brand-olive" /> Zero palm oil, cold-pressed only
            </p>
          </div>

          <div className="mt-6">
            <Accordion type="single" collapsible defaultValue="description" className="w-full">
              <AccordionItem value="description">
                <AccordionTrigger className="text-[13px] font-semibold text-brand-forest">
                  Description
                </AccordionTrigger>
                <AccordionContent className="text-[13.5px] leading-relaxed text-brand-forest/70">
                  {product.description}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="ingredients">
                <AccordionTrigger className="text-[13px] font-semibold text-brand-forest">
                  Ingredients
                </AccordionTrigger>
                <AccordionContent className="text-[13.5px] leading-relaxed text-brand-forest/70">
                  {product.ingredients.join(", ")}.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="oil">
                <AccordionTrigger className="text-[13px] font-semibold text-brand-forest">
                  Oil information
                </AccordionTrigger>
                <AccordionContent className="text-[13.5px] leading-relaxed text-brand-forest/70">
                  Made with {product.oil.toLowerCase()}. No palm oil, no palm derivatives and no
                  reused frying oil at any stage.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="nutrition">
                <AccordionTrigger className="text-[13px] font-semibold text-brand-forest">
                  Nutrition (per 100g)
                </AccordionTrigger>
                <AccordionContent>
                  <dl className="divide-y divide-brand-forest/8">
                    {product.nutrition.map((row) => (
                      <div key={row.label} className="flex justify-between py-2 text-[13px]">
                        <dt className="text-brand-forest/60">{row.label}</dt>
                        <dd className="font-medium text-brand-forest">{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-2 text-[11px] text-brand-forest/40">{product.nutritionNote}</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="allergens">
                <AccordionTrigger className="text-[13px] font-semibold text-brand-forest">
                  Allergens
                </AccordionTrigger>
                <AccordionContent className="text-[13.5px] leading-relaxed text-brand-forest/70">
                  {product.allergens}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="storage">
                <AccordionTrigger className="text-[13px] font-semibold text-brand-forest">
                  Storage & shelf life
                </AccordionTrigger>
                <AccordionContent className="text-[13.5px] leading-relaxed text-brand-forest/70">
                  {product.storage} Shelf life: {product.shelfLife}.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      <section className="container-x pb-12">
        <div className="rounded-2xl bg-brand-cream/70 px-6 py-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <p className="font-heading text-3xl font-extrabold text-brand-forest">
                {product.rating.toFixed(1)}
              </p>
              <Stars value={product.rating} />
              <p className="mt-1 text-[11px] text-brand-forest/45">
                {product.reviewCount} ratings
              </p>
            </div>
            <div className="h-12 w-px bg-brand-forest/12" />
            <p className="max-w-md text-[13px] leading-relaxed text-brand-forest/65">
              Reviews are collected from verified demo orders. Nutritional values are illustrative
              until lab verification.
            </p>
          </div>

          <ul className="mt-6 space-y-5 border-t border-brand-forest/12 pt-6">
            {productReviews.length === 0 && (
              <li className="text-[13px] text-brand-forest/50">
                No written reviews yet — be the first once orders go live.
              </li>
            )}
            {productReviews.map((review) => (
              <li key={review.id}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[13px] font-semibold text-brand-forest">{review.name}</p>
                  <span className="text-[11px] text-brand-forest/40">{shortDate(review.date)}</span>
                </div>
                <div className="mt-1">
                  <Stars value={review.rating} />
                </div>
                <p className="mt-2 text-[13.5px] font-medium text-brand-forest">{review.title}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-brand-forest/65">{review.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-x pb-16 lg:pb-24">
        <div className="flex items-end justify-between gap-4 border-b border-brand-forest/12 pb-4">
          <h2 className="font-heading text-xl font-extrabold text-brand-forest">
            You might also like
          </h2>
          <Link
            to="/shop"
            className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-forest/50 hover:text-brand-forest"
          >
            Shop all
          </Link>
        </div>
        <div className="mt-8">
          <ProductGrid products={related} />
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-brand-forest/12 bg-brand-paper/95 px-5 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-heading text-base font-extrabold text-brand-forest">
              {inr(variant.price)}
            </p>
            <p className="text-[10px] uppercase tracking-[0.12em] text-brand-forest/45">
              {variant.weight}
            </p>
          </div>
          <button
            type="button"
            onClick={addToBag}
            disabled={soldOut}
            className="rounded-md bg-brand-forest px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-paper disabled:opacity-40"
          >
            Add to bag
          </button>
        </div>
      </div>
    </div>
  );
}