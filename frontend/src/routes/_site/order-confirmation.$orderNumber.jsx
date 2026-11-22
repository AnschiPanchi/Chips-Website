import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Package, Loader2 } from "lucide-react";
import { inr, shortDate } from "@/lib/format";
import { useAdminStore } from "@/stores/admin";
import { ordersApi } from "@/api/apiClient";

export const Route = createFileRoute("/_site/order-confirmation/$orderNumber")({
  head: () => ({ meta: [{ title: "Order placed — MORO" }] }),
  component: ConfirmationPage,
});

function ConfirmationPage() {
  const { orderNumber } = Route.useParams();
  const localOrder = useAdminStore((s) => s.orders.find((o) => o.id === orderNumber));
  const [dbOrder, setDbOrder] = useState(null);
  const [loading, setLoading] = useState(!localOrder);

  useEffect(() => {
    let unmounted = false;
    ordersApi.byNumber(orderNumber)
      .then((res) => {
        if (!unmounted && res?.order) setDbOrder(res.order);
      })
      .catch(() => {})
      .finally(() => {
        if (!unmounted) setLoading(false);
      });
    return () => { unmounted = true; };
  }, [orderNumber]);

  const order = localOrder || dbOrder;

  return (
    <div className="container-x py-14 lg:py-20">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-olive/15 text-brand-olive">
            <CheckCircle2 className="h-6 w-6" strokeWidth={1.6} />
          </span>
          <div>
            <p className="eyebrow text-brand-chilli">Order confirmed</p>
            <h1 className="mt-1 font-heading text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold leading-tight tracking-[-0.03em] text-brand-forest">
              Thanks — order {orderNumber}
            </h1>
          </div>
        </div>

        <p className="mt-4 text-[14px] leading-relaxed text-brand-forest/65">
          Your order has been placed successfully! We've received your order and are packing your freshly baked snacks.
          A confirmation with your invoice and tracking updates has been dispatched to your email.
        </p>

        <div className="mt-8 rounded-2xl border border-brand-forest/12 bg-brand-cream/50 p-6">
          <div className="flex items-center justify-between border-b border-brand-forest/12 pb-4">
            <p className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-brand-forest">
              <Package className="h-4 w-4" /> Order details
            </p>
            <span className="rounded-full bg-brand-forest px-3 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-brand-paper">
              {order?.status || "placed"}
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-brand-forest/40" />
            </div>
          ) : order ? (
            <>
              <ul className="divide-y divide-brand-forest/8 py-2">
                {order.items?.map((item, idx) => (
                  <li key={`${item.productId || idx}-${item.weight}`} className="flex justify-between py-2.5 text-[13px]">
                    <span className="text-brand-forest/75">
                      {item.name} <span className="text-brand-forest/40">· {item.weight} × {item.qty}</span>
                    </span>
                    <span className="font-medium text-brand-forest">{inr(item.price * item.qty)}</span>
                  </li>
                ))}
              </ul>
              <dl className="space-y-2 border-t border-brand-forest/12 pt-3 text-[13px]">
                <div className="flex justify-between">
                  <dt className="text-brand-forest/60">Subtotal</dt>
                  <dd>{inr(order.subtotal)}</dd>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-brand-olive">
                    <dt>Discount</dt>
                    <dd>− {inr(order.discount)}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-brand-forest/60">Shipping</dt>
                  <dd>{order.shipping === 0 ? "Free" : inr(order.shipping)}</dd>
                </div>
                <div className="flex justify-between border-t border-brand-forest/12 pt-2 font-heading text-base font-extrabold text-brand-forest">
                  <dt>Total</dt>
                  <dd>{inr(order.total)}</dd>
                </div>
              </dl>
              {order.address && (
                <div className="mt-4 grid gap-3 border-t border-brand-forest/12 pt-4 text-[12.5px] text-brand-forest/65 sm:grid-cols-2">
                  <p>
                    <span className="block text-[10px] uppercase tracking-[0.12em] text-brand-forest/40">
                      Delivering to
                    </span>
                    {order.address.name}
                    <br />
                    {order.address.line1}
                    {order.address.line2 ? `, ${order.address.line2}` : ""}
                    <br />
                    {order.address.city}, {order.address.state} {order.address.pincode}
                  </p>
                  <p>
                    <span className="block text-[10px] uppercase tracking-[0.12em] text-brand-forest/40">
                      Payment
                    </span>
                    {order.payment}
                    <br />
                    Placed {order.placedAt ? shortDate(order.placedAt) : "Just now"}
                  </p>
                </div>
              )}
            </>
          ) : (
            <p className="py-4 text-[13px] text-brand-forest/60">
              Order {orderNumber} has been received. Check your email for full details.
            </p>
          )}
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            to="/shop"
            className="inline-flex rounded-md bg-brand-forest px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-paper hover:bg-brand-chilli transition-colors"
          >
            Continue shopping
          </Link>
          <Link
            to="/account/orders"
            className="inline-flex rounded-md border border-brand-forest/20 px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-forest hover:bg-brand-forest/5 transition-colors"
          >
            View all orders
          </Link>
        </div>
      </div>
    </div>
  );
}
