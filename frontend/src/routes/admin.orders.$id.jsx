import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import AdminHeader from "@/components/admin/AdminHeader";
import StatusBadge from "@/components/account/StatusBadge";
import OrderTimeline from "@/components/account/OrderTimeline";
import { ORDER_STATUSES, statusLabel } from "@/data/orders";
import { inr, shortDate } from "@/lib/format";
import { useAdminStore } from "@/stores/admin";

export const Route = createFileRoute("/admin/orders/$id")({
  component: AdminOrderDetail,
});

function AdminOrderDetail() {
  const { id } = Route.useParams();
  const order = useAdminStore((s) => s.orders.find((o) => o.id === id));
  const updateStatus = useAdminStore((s) => s.updateOrderStatus);

  if (!order) {
    return (
      <div className="pb-16">
        <AdminHeader title="Order not found" />
        <div className="px-5 py-10 lg:px-8">
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-forest"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-16">
      <AdminHeader title={order.id} subtitle={`Placed ${shortDate(order.placedAt)}`} />

      <div className="grid gap-4 px-5 py-6 lg:grid-cols-[1.5fr_1fr] lg:px-8">
        <div className="space-y-4">
          <section className="rounded-xl border border-brand-forest/12 bg-brand-paper p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-brand-forest/45">
                  Update status
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <select
                    value={order.status}
                    onChange={(e) => {
                      updateStatus(order.id, e.target.value);
                      toast.success(`Status set to ${statusLabel[e.target.value]}`);
                    }}
                    aria-label="Order status"
                    className="rounded-md border border-brand-forest/20 bg-transparent px-3 py-2 text-[12px] text-brand-forest outline-none"
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {statusLabel[status]}
                      </option>
                    ))}
                  </select>
                  <StatusBadge status={order.status} label={statusLabel[order.status]} />
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-brand-forest/45">
                  Order total
                </p>
                <p className="mt-1 font-heading text-xl font-extrabold text-brand-forest">
                  {inr(order.total)}
                </p>
                <p className="text-[11px] text-brand-forest/45">{order.payment}</p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-brand-forest/12 bg-brand-paper p-5">
            <h2 className="font-heading text-[13px] font-extrabold uppercase tracking-[0.12em] text-brand-forest">
              Items
            </h2>
            <ul className="mt-3 divide-y divide-brand-forest/10">
              {order.items.map((item) => (
                <li key={`${item.productId}-${item.weight}`} className="flex justify-between gap-4 py-3 text-[12.5px]">
                  <div>
                    <p className="font-medium text-brand-forest">{item.name}</p>
                    <p className="text-[11px] text-brand-forest/45">
                      {item.weight} · Qty {item.qty}
                    </p>
                  </div>
                  <p className="font-semibold text-brand-forest">{inr(item.price * item.qty)}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-3 space-y-1.5 border-t border-brand-forest/12 pt-3 text-[12.5px]">
              <div className="flex justify-between">
                <dt className="text-brand-forest/55">Subtotal</dt>
                <dd>{inr(order.subtotal)}</dd>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-brand-olive">
                  <dt>Discount</dt>
                  <dd>− {inr(order.discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-brand-forest/55">Shipping</dt>
                <dd>{order.shipping === 0 ? "Free" : inr(order.shipping)}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-xl border border-brand-forest/12 bg-brand-paper p-5">
            <h2 className="font-heading text-[13px] font-extrabold uppercase tracking-[0.12em] text-brand-forest">
              Customer & delivery
            </h2>
            <div className="mt-3 grid gap-4 text-[12.5px] leading-relaxed text-brand-forest/70 sm:grid-cols-2">
              <div>
                <p className="text-[10px] uppercase tracking-[0.12em] text-brand-forest/40">Customer</p>
                <p className="mt-1 font-medium text-brand-forest">{order.customer}</p>
                <p>{order.email}</p>
                <p>{order.phone}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.12em] text-brand-forest/40">Ship to</p>
                <p className="mt-1">{order.address.line1}</p>
                {order.address.line2 && <p>{order.address.line2}</p>}
                <p>
                  {order.address.city}, {order.address.state} {order.address.pincode}
                </p>
              </div>
            </div>
          </section>
        </div>

        <section className="h-fit rounded-xl border border-brand-forest/12 bg-brand-paper p-5">
          <h2 className="font-heading text-[13px] font-extrabold uppercase tracking-[0.12em] text-brand-forest">
            Fulfilment timeline
          </h2>
          <div className="mt-4">
            <OrderTimeline order={order} />
          </div>
          <Link
            to="/admin/orders"
            className="mt-6 inline-flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-brand-forest/50 hover:text-brand-forest"
          >
            <ArrowLeft className="h-3 w-3" /> All orders
          </Link>
        </section>
      </div>
    </div>
  );
}