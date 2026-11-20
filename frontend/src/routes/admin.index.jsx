import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, Package, ShoppingCart, TrendingUp, Users } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import StatCard from "@/components/admin/StatCard";
import SalesChart from "@/components/admin/SalesChart";
import OrdersTable from "@/components/admin/OrdersTable";
import { inr } from "@/lib/format";
import { useAdminStore } from "@/stores/admin";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const orders = useAdminStore((s) => s.orders);
  const products = useAdminStore((s) => s.products);
  const customers = useAdminStore((s) => s.customers);
  const settings = useAdminStore((s) => s.settings);

  const revenue = orders.filter((o) => o.status !== "cancelled").reduce((sum, o) => sum + o.total, 0);
  const aov = orders.length ? Math.round(revenue / orders.length) : 0;
  const lowStock = products.filter((p) => p.stock <= settings.lowStock);
  const bestsellers = [...products].sort((a, b) => b.stock - a.stock).slice(0, 4);

  return (
    <div className="pb-16">
      <AdminHeader title="Overview" subtitle="Store performance at a glance" />

      <div className="space-y-5 px-5 py-6 lg:px-8">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Revenue" value={inr(revenue)} hint="all time" trend={12} icon={TrendingUp} />
          <StatCard label="Orders" value={orders.length} hint="this month" trend={8} icon={ShoppingCart} />
          <StatCard label="Avg. order value" value={inr(aov)} hint="per order" trend={-3} icon={Package} />
          <StatCard label="Customers" value={customers.length} hint="total" trend={5} icon={Users} />
        </div>

        <SalesChart />

        <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
          <section className="rounded-xl border border-brand-forest/12 bg-brand-paper p-5">
            <div className="flex items-baseline justify-between">
              <h2 className="font-heading text-[13px] font-extrabold uppercase tracking-[0.12em] text-brand-forest">
                Recent orders
              </h2>
              <Link
                to="/admin/orders"
                className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-brand-forest/50 hover:text-brand-forest"
              >
                View all
              </Link>
            </div>
            <div className="mt-3">
              <OrdersTable orders={orders} limit={5} />
            </div>
          </section>

          <div className="space-y-4">
            <section className="rounded-xl border border-brand-forest/12 bg-brand-paper p-5">
              <h2 className="font-heading text-[13px] font-extrabold uppercase tracking-[0.12em] text-brand-forest">
                Bestselling stock
              </h2>
              <ul className="mt-4 space-y-3">
                {bestsellers.map((product) => (
                  <li key={product.id} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-[12.5px] font-medium text-brand-forest">{product.name}</p>
                      <p className="text-[10.5px] uppercase tracking-[0.1em] text-brand-forest/40">
                        {product.stock} units left
                      </p>
                    </div>
                    <p className="text-[12px] font-semibold text-brand-forest">{inr(product.price)}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-xl border border-brand-chilli/25 bg-brand-chilli/5 p-5">
              <h2 className="flex items-center gap-2 font-heading text-[13px] font-extrabold uppercase tracking-[0.12em] text-brand-forest">
                <AlertTriangle className="h-4 w-4 text-brand-chilli" /> Low stock
              </h2>
              {lowStock.length === 0 ? (
                <p className="mt-3 text-[12px] text-brand-forest/55">
                  Everything is above the {settings.lowStock} unit threshold.
                </p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {lowStock.slice(0, 5).map((product) => (
                    <li key={product.id} className="flex items-center justify-between gap-3 text-[12px]">
                      <span className="truncate text-brand-forest/75">{product.name}</span>
                      <span className="shrink-0 font-semibold text-brand-chilli">{product.stock}</span>
                    </li>
                  ))}
                </ul>
              )}
              <Link
                to="/admin/inventory"
                className="mt-4 inline-flex text-[10.5px] font-semibold uppercase tracking-[0.12em] text-brand-chilli"
              >
                Manage inventory
              </Link>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}