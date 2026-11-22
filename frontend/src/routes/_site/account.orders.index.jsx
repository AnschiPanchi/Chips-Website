import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import StatusBadge from "@/components/account/StatusBadge";
import { inr, shortDate } from "@/lib/format";
import { statusLabel } from "@/data/orders";
import { useAuthStore } from "@/stores/auth";
import { useAdminStore } from "@/stores/admin";
import { ordersApi } from "@/api/apiClient";

export const Route = createFileRoute("/_site/account/orders/")({
  head: () => ({ meta: [{ title: "My orders — MORO" }] }),
  component: OrdersPage,
});

function OrdersPage() {
  const user = useAuthStore((s) => s.user);
  const localOrders = useAdminStore((s) => s.orders);
  const [apiOrders, setApiOrders] = useState([]);

  useEffect(() => {
    ordersApi.mine()
      .then((res) => {
        if (res?.orders) setApiOrders(res.orders);
      })
      .catch(() => {});
  }, [user]);

  // Combine and deduplicate orders by id
  const combined = [...apiOrders, ...localOrders.filter((o) => o.email === user?.email)];
  const seen = new Set();
  const mine = combined.filter((o) => {
    const key = o.id || o.orderNumber;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return (
    <div>
      <h2 className="font-heading text-base font-extrabold uppercase tracking-[0.12em] text-brand-forest">
        Order history
      </h2>
      <p className="mt-1 text-[13px] text-brand-forest/55">
        {mine.length} {mine.length === 1 ? "order" : "orders"} on this account.
      </p>

      {mine.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-brand-forest/20 px-5 py-14 text-center">
          <p className="font-heading text-lg font-bold text-brand-forest">No orders yet</p>
          <p className="mx-auto mt-2 max-w-xs text-[13px] text-brand-forest/55">
            Once you place a demo order it'll show up here with tracking.
          </p>
          <Link
            to="/shop"
            className="mt-5 inline-flex rounded-md bg-brand-forest px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-paper"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {mine.map((order) => (
            <li key={order.id} className="rounded-xl border border-brand-forest/12 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2.5">
                    <p className="font-heading text-[14px] font-bold text-brand-forest">{order.id}</p>
                    <StatusBadge status={order.status} label={statusLabel[order.status]} />
                  </div>
                  <p className="mt-1 text-[11.5px] text-brand-forest/50">
                    Placed {shortDate(order.placedAt)} · {order.payment}
                  </p>
                </div>
                <p className="font-heading text-[15px] font-extrabold text-brand-forest">
                  {inr(order.total)}
                </p>
              </div>

              <p className="mt-3 truncate text-[12.5px] text-brand-forest/60">
                {order.items.map((i) => `${i.name} × ${i.qty}`).join(", ")}
              </p>

              <Link
                to="/account/orders/$orderId"
                params={{ orderId: order.id }}
                className="mt-4 inline-flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-brand-forest hover:text-brand-chilli"
              >
                View details <ArrowRight className="h-3 w-3" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}