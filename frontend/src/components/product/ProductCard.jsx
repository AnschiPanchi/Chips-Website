import { Link } from "@tanstack/react-router";
import { Heart, Plus } from "lucide-react";
import { toast } from "sonner";
import { Image } from "@/components/ui/image";
import Stars from "./Stars";
import { inr, pctOff } from "@/lib/format";
import { useCartStore } from "@/stores/cart";
import { useWishlistStore } from "@/stores/wishlist";
import { useMounted } from "@/hooks/useMounted";

const badgeStyles = {
  bestseller: "bg-brand-forest text-brand-paper",
  new: "bg-brand-chilli text-brand-paper",
  "gluten-free": "bg-brand-olive text-brand-paper",
  bundle: "bg-brand-ink text-brand-paper",
};

export default function ProductCard({ product, priority = false }) {
  const add = useCartStore((s) => s.add);
  const ids = useWishlistStore((s) => s.ids);
  const toggle = useWishlistStore((s) => s.toggle);
  const mounted = useMounted();
  const saved = mounted && ids.includes(product.id);
  const soldOut = !(product.variants?.[0]?.stock > 0);
  const off = pctOff(product.price, product.mrp);

  const handleAdd = () => {
    if (soldOut) return;
    add(product, product.variants?.[0], 1);
    toast.success(`${product.name} added to your bag`);
  };

  const handleSave = () => {
    const added = toggle(product.id);
    toast(added ? "Saved to wishlist" : "Removed from wishlist");
  };

  return (
    <article className="group relative flex flex-col">
      <div className="relative overflow-hidden rounded-2xl bg-brand-cream">
        <Link to="/products/$slug" params={{ slug: product.slug }} className="block">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              className="aspect-[4/5] w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
            />
          ) : (
            <div className="grid aspect-[4/5] w-full place-items-center bg-gradient-to-br from-brand-olive to-brand-forest">
              <span className="font-heading text-3xl font-extrabold tracking-[0.15em] text-brand-paper/90">
                {product.name.split(" ")[0].toUpperCase()}
              </span>
            </div>
          )}
        </Link>

        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {product.badges?.slice(0, 2).map((badge) => (
            <span
              key={badge}
              className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] ${
                badgeStyles[badge] || "bg-brand-paper text-brand-forest"
              }`}
            >
              {badge === "gluten-free" ? "Gluten free" : badge}
            </span>
          ))}
          {off > 0 && !soldOut && (
            <span className="rounded-full bg-brand-paper/95 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-brand-chilli">
              {off}% off
            </span>
          )}
          {soldOut && (
            <span className="rounded-full bg-brand-ink px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-brand-paper">
              Sold out
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleSave}
          aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
          aria-pressed={saved}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-brand-paper/90 text-brand-forest shadow-sm transition-colors hover:bg-brand-paper"
        >
          <Heart className={`h-4 w-4 ${saved ? "fill-brand-chilli text-brand-chilli" : ""}`} strokeWidth={1.75} />
        </button>

        {!soldOut && (
          <button
            type="button"
            onClick={handleAdd}
            className="absolute inset-x-3 bottom-3 flex items-center justify-center gap-1.5 rounded-md bg-brand-forest/95 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-paper opacity-0 backdrop-blur transition-all duration-300 hover:bg-brand-ink group-hover:opacity-100 max-sm:opacity-100"
          >
            <Plus className="h-3.5 w-3.5" /> Add to bag
          </button>
        )}
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            to="/products/$slug"
            params={{ slug: product.slug }}
            className="font-heading text-[15px] font-semibold leading-snug text-brand-forest transition-colors hover:text-brand-chilli"
          >
            {product.name}
          </Link>
          <p className="mt-1 text-[11px] uppercase tracking-[0.1em] text-brand-forest/50">
            {product.flavour} · {product.weight}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-heading text-sm font-bold text-brand-forest">{inr(product.price)}</p>
          {product.mrp > product.price && (
            <p className="text-[11px] text-brand-forest/40 line-through">{inr(product.mrp)}</p>
          )}
        </div>
      </div>

      <div className="mt-2">
        <Stars value={product.rating} showValue count={product.reviewCount} />
      </div>
    </article>
  );
}