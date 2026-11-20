import { Link } from "@tanstack/react-router";
import { ShoppingBag, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Image } from "@/components/ui/image";
import QuantitySelector from "@/components/product/QuantitySelector";
import { inr } from "@/lib/format";
import { brand } from "@/lib/brand";
import { cartTotals } from "@/lib/totals";
import { useCartStore } from "@/stores/cart";

export default function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const setOpen = useCartStore((s) => s.setOpen);
  const items = useCartStore((s) => s.items);
  const coupon = useCartStore((s) => s.coupon);
  const setQty = useCartStore((s) => s.setQty);
  const remove = useCartStore((s) => s.remove);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const { total, freeShip } = cartTotals({ subtotal, coupon });
  const toFree = Math.max(0, brand.freeShippingThreshold - subtotal);
  const progress = Math.min(100, (subtotal / brand.freeShippingThreshold) * 100);

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 bg-brand-paper p-0 sm:max-w-md">
        <SheetHeader className="border-b border-brand-forest/10 px-6 py-5 text-left">
          <SheetTitle className="flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-[0.2em] text-brand-forest">
            <ShoppingBag className="h-4 w-4" /> Your bag ({items.length})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-brand-cream">
              <ShoppingBag className="h-7 w-7 text-brand-forest/40" strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-heading text-lg font-bold text-brand-forest">Your bag is empty</p>
              <p className="mt-1 text-sm text-brand-forest/60">
                Big flavour is a few clicks away.
              </p>
            </div>
            <Link
              to="/shop"
              onClick={() => setOpen(false)}
              className="rounded-md bg-brand-forest px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-brand-paper"
            >
              Shop all snacks
            </Link>
          </div>
        ) : (
          <>
            <div className="border-b border-brand-forest/10 bg-brand-cream/60 px-6 py-3">
              <p className="text-[12px] font-medium text-brand-forest">
                {freeShip ? "Free shipping unlocked." : `Add ${inr(toFree)} for free shipping.`}
              </p>
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-brand-forest/12">
                <div
                  className="h-full rounded-full bg-brand-chilli transition-all duration-500"
                  style={{ width: `${freeShip ? 100 : progress}%` }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6">
              {items.map((item) => (
                <div key={item.key} className="flex gap-4 border-b border-brand-forest/10 py-4">
                  <Link to="/products/$slug" params={{ slug: item.slug }} onClick={() => setOpen(false)}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 rounded-lg bg-brand-cream object-cover"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-brand-forest">{item.name}</p>
                        <p className="text-xs text-brand-forest/55">{item.weight}</p>
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
                    <div className="mt-3 flex items-center justify-between">
                      <QuantitySelector
                        value={item.qty}
                        onChange={(qty) => setQty(item.key, qty)}
                        compact
                      />
                      <p className="font-heading text-sm font-bold text-brand-forest">
                        {inr(item.price * item.qty)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-brand-forest/10 px-6 py-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-brand-forest/70">Subtotal</span>
                <span className="font-heading text-base font-bold text-brand-forest">{inr(total)}</span>
              </div>
              <p className="mt-1 text-[11px] text-brand-forest/50">
                Shipping and coupons applied at checkout.
              </p>
              <Link
                to="/checkout"
                onClick={() => setOpen(false)}
                className="mt-4 flex w-full items-center justify-center rounded-md bg-brand-forest px-6 py-3.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-brand-paper transition-colors hover:bg-brand-ink"
              >
                Checkout
              </Link>
              <Link
                to="/cart"
                onClick={() => setOpen(false)}
                className="mt-2 flex w-full items-center justify-center rounded-md border border-brand-forest/20 px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-brand-forest transition-colors hover:border-brand-forest"
              >
                View bag
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}