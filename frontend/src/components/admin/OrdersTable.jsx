import { Link } from "@tanstack/react-router";
import StatusBadge from "@/components/account/StatusBadge";
import { inr, shortDate } from "@/lib/format";
import { ORDER_STATUSES, statusLabel } from "@/data/orders";

export default function OrdersTable({ orders, onStatus, limit }) {
  const rows = limit ? orders.slice(0, limit) : orders;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-left">
        <thead>
          <tr className="border-b border-brand-forest/12 text-[10px] uppercase tracking-[0.12em] text-brand-forest/40">
            <th className="py-2.5 pr-3 font-semibold">Order</th>
            <th className="py-2.5 pr-3 font-semibold">Customer</th>
            <th className="py-2.5 pr-3 font-semibold">Date</th>
            <th className="py-2.5 pr-3 font-semibold">Total</th>
            <th className="py-2.5 pr-3 font-semibold">Status</th>
            <th className="py-2.5 font-semibold text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((order) => (
            <tr key={order.id} className="border-b border-brand-forest/8 text-[12.5px]">
              <td className="py-3 pr-3 font-semibold text-brand-forest">{order.id}</td>
              <td className="py-3 pr-3 text-brand-forest/70">
                <span className="block">{order.customer}</span>
                <span className="block text-[11px] text-brand-forest/40">{order.items.length} items</span>
              </td>
              <td className="py-3 pr-3 text-brand-forest/60">{shortDate(order.placedAt)}</td>
              <td className="py-3 pr-3 font-medium text-brand-forest">{inr(order.total)}</td>
              <td className="py-3 pr-3">
                {onStatus ? (
                  <select
                    value={order.status}
                    onChange={(e) => onStatus(order.id, e.target.value)}
                    aria-label={`Status for ${order.id}`}
                    className="rounded-md border border-brand-forest/20 bg-transparent px-2 py-1 text-[11px] text-brand-forest outline-none"
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {statusLabel[status]}
                      </option>
                    ))}
                  </select>
                ) : (
                  <StatusBadge status={order.status} label={statusLabel[order.status]} />
                )}
              </td>
              <td className="py-3 text-right">
                <Link
                  to="/admin/orders/$id"
                  params={{ id: order.id }}
                  className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-brand-forest/50 hover:text-brand-chilli"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={6} className="py-8 text-center text-[12.5px] text-brand-forest/45">
                No orders to show.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}