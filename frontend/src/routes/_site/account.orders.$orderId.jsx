import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import OrderTimeline from "@/components/account/OrderTimeline";
import StatusBadge from "@/components/account/StatusBadge";
import { inr, shortDate } from "@/lib/format";
import { statusLabel } from "@/data/orders";
import { useAdminStore } from "@/stores/admin";

export const Route = createFileRoute("/_site/account/orders/$orderId")({
  head: () => ({ meta: [{ title: "Order details — MORO" }] }),
  component: OrderDetailPage,
});

function OrderDetailPage() {
  const { orderId } = Route.useParams();
  const order = useAdminStore((s) => s.orders.find((o) => o.id === orderId));

  if (!order) {
    return (
      <div>
        <h2 className="font-heading text-lg font-extrabold text-brand-forest">Order not found</h2>
        <p className="mt-2 text-[13px] text-brand-forest/60">
          We couldn't find {orderId} in this session.
        </p>
        <Link
          to="/account/orders"
          className="mt-5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-forest"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to orders
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        to="/account/orders"
        className="inline-flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-brand-forest/50 hover:text-brand-forest"
      >
        <ArrowLeft className="h-3 w-3" /> All orders
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-xl font-extrabold text-brand-forest">{order.id}</h2>
          <p className="mt-1 text-[12px] text-brand-forest/50">
            Placed {shortDate(order.placedAt)} · {order.payment}
          </p>
        </div>
        <StatusBadge status={order.status} label={statusLabel[order.status]} />
      </div>

      <div className="mt-7 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-forest/45">
            Items
          </h3>
          <ul className="mt-3 divide-y divide-brand-forest/10 border-y border-brand-forest/10">
            {order.items.map((item) => (
              <li key={`${item.productId}-${item.weight}`} className="flex justify-between gap-4 py-3">
                <div>
                  <p className="text-[13.5px] font-medium text-brand-forest">{item.name}</p>
                  <p className="text-[11.5px] text-brand-forest/50">
                    {item.weight} · Qty {item.qty}
                  </p>
                </div>
                <p className="text-[13.5px] font-semibold text-brand-forest">
                  {inr(item.price * item.qty)}
                </p>
              </li>
            ))}
          </ul>

          <dl className="mt-4 space-y-2 text-[13px]">
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

          <div className="mt-6 rounded-xl bg-brand-cream/60 p-5 text-[12.5px] leading-relaxed text-brand-forest/70">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-forest/40">
              Delivery address
            </p>
            <p className="mt-2">
              {order.address.name}
              <br />
              {order.address.line1}
              {order.address.line2 ? `, ${order.address.line2}` : ""}
              <br />
              {order.address.city}, {order.address.state} {order.address.pincode}
              <br />
              {order.address.phone}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-forest/45">
            Tracking
          </h3>
          <div className="mt-4">
            <OrderTimeline order={order} />
          </div>
        </div>
      </div>
    </div>
  );
}