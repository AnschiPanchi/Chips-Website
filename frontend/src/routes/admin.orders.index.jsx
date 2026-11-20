import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import AdminHeader from "@/components/admin/AdminHeader";
import OrdersTable from "@/components/admin/OrdersTable";
import { ORDER_STATUSES, statusLabel } from "@/data/orders";
import { useAdminStore } from "@/stores/admin";

export const Route = createFileRoute("/admin/orders/")({
  component: AdminOrders,
});

function AdminOrders() {
  const orders = useAdminStore((s) => s.orders);
  const updateStatus = useAdminStore((s) => s.updateOrderStatus);
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="pb-16">
      <AdminHeader title="Orders" subtitle={`${orders.length} orders in this demo`} />

      <div className="space-y-4 px-5 py-6 lg:px-8">
        <div className="flex flex-wrap gap-2">
          {["all", ...ORDER_STATUSES].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={`rounded-full px-3.5 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.1em] transition-colors ${
                filter === status
                  ? "bg-brand-forest text-brand-paper"
                  : "border border-brand-forest/15 text-brand-forest/60 hover:border-brand-forest"
              }`}
            >
              {status === "all" ? "All" : statusLabel[status]}
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-brand-forest/12 bg-brand-paper p-5">
          <OrdersTable
            orders={filtered}
            onStatus={(id, status) => {
              updateStatus(id, status);
              toast.success(`${id} marked ${statusLabel[status].toLowerCase()}`);
            }}
          />
        </div>
      </div>
    </div>
  );
}