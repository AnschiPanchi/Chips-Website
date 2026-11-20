import { createFileRoute, Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import { useCartStore } from "@/stores/cart";
import { brand } from "@/lib/brand";
import { inr } from "@/lib/format";

export const Route = createFileRoute("/_site/cart")({
  head: () => ({ meta: [{ title: "Your bag — MORO" }] }),
  component: CartPage,
});

function CartPage() {
  const items = useCartStore((s) => s.items);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const toFree = Math.max(0, brand.freeShippingThreshold - subtotal);

  return (
    <div className="container-x py-10 lg:py-16">
      <header>
        <p className="eyebrow text-brand-chilli">Step 1 of 2</p>
        <h1 className="mt-3 font-heading text-[clamp(2rem,4.4vw,3rem)] font-extrabold leading-[1.02] tracking-[-0.03em] text-brand-forest">
          Your bag
        </h1>
        <p className="mt-2 text-[14px] text-brand-forest/60">
          {items.length > 0
            ? `${items.length} ${items.length === 1 ? "product" : "products"} ready to crunch.`
            : "Nothing in here yet."}
        </p>
      </header>

      {items.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-brand-forest/20 px-6 py-20 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-cream">
            <ShoppingBag className="h-7 w-7 text-brand-forest/40" strokeWidth={1.5} />
          </div>
          <p className="mt-5 font-heading text-xl font-extrabold text-brand-forest">
            Your bag is empty
          </p>
          <p className="mx-auto mt-2 max-w-sm text-[13.5px] leading-relaxed text-brand-forest/60">
            Start with the bestsellers — chilli lime chips and millet puffs are the usual first
            order.
          </p>
          <Link
            to="/shop"
            className="mt-6 inline-flex rounded-md bg-brand-forest px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-paper"
          >
            Shop all snacks
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <div>
            {items.length > 0 && (
              <div className="mb-2 rounded-lg bg-brand-cream/70 px-4 py-3">
                <p className="text-[12px] font-medium text-brand-forest">
                  {toFree > 0
                    ? `Add ${inr(toFree)} more for free shipping.`
                    : "Free shipping unlocked on this order."}
                </p>
              </div>
            )}
            {items.map((item) => (
              <CartItem key={item.key} item={item} />
            ))}
          </div>
          <div className="lg:sticky lg:top-24 lg:self-start">
            <CartSummary />
          </div>
        </div>
      )}
    </div>
  );
}