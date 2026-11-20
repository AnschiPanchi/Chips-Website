import { createFileRoute, Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import CouponInput from "@/components/cart/CouponInput";
import { useCartStore } from "@/stores/cart";

export const Route = createFileRoute("/_site/checkout")({
  head: () => ({ meta: [{ title: "Checkout — MORO" }] }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const items = useCartStore((s) => s.items);

  if (items.length === 0) {
    return (
      <div className="container-x py-20 text-center lg:py-28">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-cream">
          <ShoppingBag className="h-7 w-7 text-brand-forest/40" strokeWidth={1.5} />
        </div>
        <h1 className="mt-5 font-heading text-2xl font-extrabold text-brand-forest">
          Nothing to check out yet
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-[13.5px] text-brand-forest/60">
          Add a pack or two to your bag and come back.
        </p>
        <Link
          to="/shop"
          className="mt-6 inline-flex rounded-md bg-brand-forest px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-paper"
        >
          Shop all snacks
        </Link>
      </div>
    );
  }

  return (
    <div className="container-x py-10 lg:py-16">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-brand-chilli">Step 2 of 2</p>
          <h1 className="mt-3 font-heading text-[clamp(2rem,4.4vw,3rem)] font-extrabold leading-[1.02] tracking-[-0.03em] text-brand-forest">
            Checkout
          </h1>
        </div>
        <Link
          to="/cart"
          className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-forest/50 hover:text-brand-forest"
        >
          Back to bag
        </Link>
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <div>
          <CheckoutForm />
        </div>
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <OrderSummary />
          <div className="rounded-2xl border border-brand-forest/12 p-6">
            <p className="eyebrow text-brand-forest/45">Have a code?</p>
            <div className="mt-3">
              <CouponInput />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}