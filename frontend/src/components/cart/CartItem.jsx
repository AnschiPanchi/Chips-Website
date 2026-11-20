import { Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Image } from "@/components/ui/image";
import { inr } from "@/lib/format";
import { useCartStore } from "@/stores/cart";

export default function CartItem({ item }) {
  const setQty = useCartStore((s) => s.setQty);
  const remove = useCartStore((s) => s.remove);

  return (
    <div className="flex gap-4 border-b border-brand-forest/10 py-5">
      <Link to="/products/$slug" params={{ slug: item.slug }} className="shrink-0">
        <Image
          src={item.image}
          alt={item.name}
          className="h-24 w-24 rounded-xl bg-brand-cream object-cover sm:h-28 sm:w-28"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              to="/products/$slug"
              params={{ slug: item.slug }}
              className="font-heading text-[14.5px] font-semibold text-brand-forest hover:text-brand-chilli"
            >
              {item.name}
            </Link>
            <p className="mt-1 text-[11.5px] uppercase tracking-[0.1em] text-brand-forest/45">
              {item.weight}
            </p>
          </div>
          <button
            type="button"
            onClick={() => remove(item.key)}
            aria-label={`Remove ${item.name}`}
            className="text-brand-forest/35 transition-colors hover:text-brand-chilli"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="inline-flex items-center rounded-md border border-brand-forest/20">
            <button
              type="button"
              onClick={() => setQty(item.key, item.qty - 1)}
              aria-label="Decrease quantity"
              className="grid h-9 w-9 place-items-center text-brand-forest hover:bg-brand-forest/6"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="min-w-8 text-center font-heading text-sm font-bold text-brand-forest">
              {item.qty}
            </span>
            <button
              type="button"
              onClick={() => setQty(item.key, item.qty + 1)}
              aria-label="Increase quantity"
              className="grid h-9 w-9 place-items-center text-brand-forest hover:bg-brand-forest/6"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="font-heading text-[15px] font-bold text-brand-forest">
            {inr(item.price * item.qty)}
          </p>
        </div>
      </div>
    </div>
  );
}