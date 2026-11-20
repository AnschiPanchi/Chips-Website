import { Link } from "@tanstack/react-router";
import CouponInput from "./CouponInput";
import { inr } from "@/lib/format";
import { cartTotals } from "@/lib/totals";
import { useCartStore } from "@/stores/cart";

export default function CartSummary({ cta = true, express = false }) {
  const items = useCartStore((s) => s.items);
  const coupon = useCartStore((s) => s.coupon);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const { discount, shipping, total } = cartTotals({ subtotal, coupon, express });

  return (
    <div className="rounded-2xl border border-brand-forest/12 bg-brand-cream/50 p-6 lg:p-7">
      <h2 className="font-heading text-base font-extrabold uppercase tracking-[0.14em] text-brand-forest">
        Order summary
      </h2>

      <div className="mt-5">
        <CouponInput />
      </div>

      <dl className="mt-6 space-y-2.5 border-t border-brand-forest/12 pt-5 text-[13px]">
        <div className="flex justify-between">
          <dt className="text-brand-forest/65">Subtotal</dt>
          <dd className="font-medium text-brand-forest">{inr(subtotal)}</dd>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-brand-olive">
            <dt>Coupon discount</dt>
            <dd className="font-medium">− {inr(discount)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-brand-forest/65">Shipping</dt>
          <dd className="font-medium text-brand-forest">{shipping === 0 ? "Free" : inr(shipping)}</dd>
        </div>
      </dl>

      <div className="mt-4 flex items-baseline justify-between border-t border-brand-forest/12 pt-4">
        <span className="font-heading text-sm font-bold uppercase tracking-[0.12em] text-brand-forest">
          Total
        </span>
        <span className="font-heading text-xl font-extrabold text-brand-forest">{inr(total)}</span>
      </div>
      <p className="mt-1 text-[11px] text-brand-forest/45">Inclusive of all taxes. Demo pricing.</p>

      {cta && (
        <Link
          to="/checkout"
          className="mt-5 flex w-full items-center justify-center rounded-md bg-brand-forest px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-paper transition-colors hover:bg-brand-ink"
        >
          Proceed to checkout
        </Link>
      )}
      <Link
        to="/shop"
        className="mt-3 block text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-forest/50 hover:text-brand-forest"
      >
        Continue shopping
      </Link>
    </div>
  );
}