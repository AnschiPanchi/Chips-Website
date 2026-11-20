import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Heart, MapPin, Package, Wallet } from "lucide-react";
import StatusBadge from "@/components/account/StatusBadge";
import { inr, shortDate } from "@/lib/format";
import { statusLabel } from "@/data/orders";
import { useAuthStore } from "@/stores/auth";
import { useAdminStore } from "@/stores/admin";
import { useWishlistStore } from "@/stores/wishlist";

export const Route = createFileRoute("/_site/account/")({
  head: () => ({ meta: [{ title: "My account — MORO" }] }),
  component: AccountOverview,
});

function AccountOverview() {
  const user = useAuthStore((s) => s.user);
  const orders = useAdminStore((s) => s.orders);
  const wishlist = useWishlistStore((s) => s.ids);
  const mine = orders.filter((o) => o.email === user?.email);
  const spent = mine
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);
  const address = user?.addresses?.[0];

  const stats = [
    { label: "Orders placed", value: mine.length, icon: Package },
    { label: "Lifetime spend", value: inr(spent), icon: Wallet },
    { label: "Saved snacks", value: wishlist.length, icon: Heart },
  ];

  return (
    <div className="space-y-10">
      <div className="grid gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-brand-forest/12 p-5">
            <stat.icon className="h-4 w-4 text-brand-olive" strokeWidth={1.6} />
            <p className="mt-4 font-heading text-xl font-extrabold text-brand-forest">{stat.value}</p>
            <p className="mt-0.5 text-[11px] uppercase tracking-[0.12em] text-brand-forest/45">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <section>
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-heading text-base font-extrabold uppercase tracking-[0.12em] text-brand-forest">
            Recent orders
          </h2>
          <Link
            to="/account/orders"
            className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-forest/50 hover:text-brand-forest"
          >
            View all
          </Link>
        </div>

        {mine.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-brand-forest/20 px-5 py-10 text-center text-[13px] text-brand-forest/55">
            No orders yet. Your first pack is one click away.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-brand-forest/10 border-y border-brand-forest/10">
            {mine.slice(0, 3).map((order) => (
              <li key={order.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                <div>
                  <Link
                    to="/account/orders/$orderId"
                    params={{ orderId: order.id }}
                    className="font-heading text-[13.5px] font-bold text-brand-forest hover:text-brand-chilli"
                  >
                    {order.id}
                  </Link>
                  <p className="mt-0.5 text-[11.5px] text-brand-forest/50">
                    {shortDate(order.placedAt)} · {order.items.length} items · {inr(order.total)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={order.status} label={statusLabel[order.status]} />
                  <Link
                    to="/account/orders/$orderId"
                    params={{ orderId: order.id }}
                    className="text-brand-forest/35 hover:text-brand-forest"
                    aria-label={`View order ${order.id}`}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="font-heading text-base font-extrabold uppercase tracking-[0.12em] text-brand-forest">
          Default address
        </h2>
        {address ? (
          <div className="mt-4 flex items-start justify-between gap-4 rounded-xl border border-brand-forest/12 p-5">
            <div className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-olive" />
              <div className="text-[13px] leading-relaxed text-brand-forest/75">
                <p className="font-semibold text-brand-forest">{address.name}</p>
                <p>
                  {address.line1}
                  {address.line2 ? `, ${address.line2}` : ""}
                </p>
                <p>
                  {address.city}, {address.state} {address.pincode}
                </p>
                <p className="mt-1 text-brand-forest/50">{address.phone}</p>
              </div>
            </div>
            <Link
              to="/account/addresses"
              className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-forest/50 hover:text-brand-forest"
            >
              Manage
            </Link>
          </div>
        ) : (
          <p className="mt-4 text-[13px] text-brand-forest/55">No saved address yet.</p>
        )}
      </section>
    </div>
  );
}