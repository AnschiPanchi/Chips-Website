import { createFileRoute } from "@tanstack/react-router";
import AdminHeader from "@/components/admin/AdminHeader";
import { inr, shortDate } from "@/lib/format";
import { useAdminStore } from "@/stores/admin";

export const Route = createFileRoute("/admin/customers")({
  component: AdminCustomers,
});

function AdminCustomers() {
  const customers = useAdminStore((s) => s.customers);

  return (
    <div className="pb-16">
      <AdminHeader title="Customers" subtitle={`${customers.length} accounts`} />
      <div className="px-5 py-6 lg:px-8">
        <div className="overflow-x-auto rounded-xl border border-brand-forest/12 bg-brand-paper p-5">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-brand-forest/12 text-[10px] uppercase tracking-[0.12em] text-brand-forest/40">
                <th className="py-2.5 pr-3 font-semibold">Customer</th>
                <th className="py-2.5 pr-3 font-semibold">City</th>
                <th className="py-2.5 pr-3 font-semibold">Orders</th>
                <th className="py-2.5 pr-3 font-semibold">Spend</th>
                <th className="py-2.5 font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b border-brand-forest/8 text-[12.5px]">
                  <td className="py-3 pr-3">
                    <p className="font-semibold text-brand-forest">{customer.name}</p>
                    <p className="text-[11px] text-brand-forest/45">{customer.email}</p>
                  </td>
                  <td className="py-3 pr-3 text-brand-forest/65">{customer.city}</td>
                  <td className="py-3 pr-3 text-brand-forest/65">{customer.orders}</td>
                  <td className="py-3 pr-3 font-medium text-brand-forest">{inr(customer.spend)}</td>
                  <td className="py-3 text-brand-forest/55">{shortDate(customer.joined)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}