import { Image } from "@/components/ui/image";
import { inr } from "@/lib/format";
import { cartTotals } from "@/lib/totals";
import { useCartStore } from "@/stores/cart";

export default function OrderSummary({ express = false, compact = false }) {
  const items = useCartStore((s) => s.items);
  const coupon = useCartStore((s) => s.coupon);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const { discount, shipping, total } = cartTotals({ subtotal, coupon, express });

  return (
    <div className="rounded-2xl border border-brand-forest/12 bg-brand-cream/50 p-6 lg:p-7">
      <h2 className="font-heading text-base font-extrabold uppercase tracking-[0.14em] text-brand-forest">
        What's in your box
      </h2>

      <ul className={`mt-5 space-y-4 ${compact ? "" : "max-h-[320px] overflow-y-auto pr-1"}`}>
        {items.map((item) => (
          <li key={item.key} className="flex items-center gap-3">
            <div className="relative shrink-0">
              <Image
                src={item.image}
                alt={item.name}
                className="h-14 w-14 rounded-lg bg-brand-cream object-cover"
              />
              <span className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-brand-forest text-[10px] font-bold text-brand-paper">
                {item.qty}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-brand-forest">{item.name}</p>
              <p className="text-[11px] text-brand-forest/50">{item.weight}</p>
            </div>
            <p className="text-[13px] font-semibold text-brand-forest">{inr(item.price * item.qty)}</p>
          </li>
        ))}
        {items.length === 0 && (
          <li className="text-[13px] text-brand-forest/50">Your bag is empty.</li>
        )}
      </ul>

      <dl className="mt-5 space-y-2.5 border-t border-brand-forest/12 pt-5 text-[13px]">
        <div className="flex justify-between">
          <dt className="text-brand-forest/65">Subtotal</dt>
          <dd className="font-medium text-brand-forest">{inr(subtotal)}</dd>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-brand-olive">
            <dt>Coupon {coupon?.code}</dt>
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
          To pay
        </span>
        <span className="font-heading text-xl font-extrabold text-brand-forest">{inr(total)}</span>
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-brand-forest/45">
        Demo checkout. No payment is processed and no order is dispatched.
      </p>
    </div>
  );
}