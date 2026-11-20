import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import AdminHeader from "@/components/admin/AdminHeader";
import InventoryTable from "@/components/admin/InventoryTable";
import { useAdminStore } from "@/stores/admin";

export const Route = createFileRoute("/admin/inventory")({
  component: AdminInventory,
});

function AdminInventory() {
  const products = useAdminStore((s) => s.products);
  const settings = useAdminStore((s) => s.settings);
  const updateStock = useAdminStore((s) => s.updateStock);
  const total = products.reduce((sum, p) => sum + Number(p.stock || 0), 0);
  const low = products.filter((p) => p.stock <= settings.lowStock).length;

  return (
    <div className="pb-16">
      <AdminHeader title="Inventory" subtitle={`${total} units across ${products.length} products`} />
      <div className="space-y-4 px-5 py-6 lg:px-8">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-brand-forest/12 bg-brand-paper p-4">
            <p className="text-[10.5px] uppercase tracking-[0.12em] text-brand-forest/45">Total units</p>
            <p className="mt-1.5 font-heading text-xl font-extrabold text-brand-forest">{total}</p>
          </div>
          <div className="rounded-xl border border-brand-forest/12 bg-brand-paper p-4">
            <p className="text-[10.5px] uppercase tracking-[0.12em] text-brand-forest/45">Low stock</p>
            <p className="mt-1.5 font-heading text-xl font-extrabold text-brand-chilli">{low}</p>
          </div>
          <div className="rounded-xl border border-brand-forest/12 bg-brand-paper p-4">
            <p className="text-[10.5px] uppercase tracking-[0.12em] text-brand-forest/45">Threshold</p>
            <p className="mt-1.5 font-heading text-xl font-extrabold text-brand-forest">
              {settings.lowStock}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-brand-forest/12 bg-brand-paper p-5">
          <InventoryTable
            products={products}
            lowStock={settings.lowStock}
            onStock={(id, value) => updateStock(id, value)}
          />
          <p className="mt-3 text-[11px] text-brand-forest/40">
            Editing a number saves instantly. Set stock to 0 to mark a product sold out.
          </p>
        </div>
      </div>
    </div>
  );
}