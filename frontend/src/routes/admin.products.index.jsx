import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import AdminHeader from "@/components/admin/AdminHeader";
import ProductsTable from "@/components/admin/ProductsTable";
import { useAdminStore } from "@/stores/admin";

export const Route = createFileRoute("/admin/products/")({
  component: AdminProducts,
});

function AdminProducts() {
  const products = useAdminStore((s) => s.products);
  const deleteProduct = useAdminStore((s) => s.deleteProduct);
  const [term, setTerm] = useState("");
  const [pending, setPending] = useState(null);

  const filtered = products.filter((p) =>
    `${p.name} ${p.category}`.toLowerCase().includes(term.trim().toLowerCase())
  );

  return (
    <div className="pb-16">
      <AdminHeader
        title="Products"
        subtitle={`${products.length} products in the catalogue`}
        action={
          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-1.5 rounded-md bg-brand-forest px-3.5 py-2 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-brand-paper"
          >
            <Plus className="h-3.5 w-3.5" /> New product
          </Link>
        }
      />

      <div className="space-y-4 px-5 py-6 lg:px-8">
        <div className="flex items-center gap-2 rounded-md border border-brand-forest/15 bg-brand-paper px-3 py-2.5 sm:max-w-xs">
          <Search className="h-4 w-4 text-brand-forest/40" />
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search products"
            aria-label="Search products"
            className="w-full bg-transparent text-[12.5px] text-brand-forest outline-none placeholder:text-brand-forest/35"
          />
        </div>

        <div className="rounded-xl border border-brand-forest/12 bg-brand-paper p-5">
          <ProductsTable products={filtered} onDelete={(product) => setPending(product)} />
        </div>
      </div>

      {pending && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-brand-forest/35 px-5"
          role="dialog"
          aria-modal="true"
          onClick={() => setPending(null)}
        >
          <div
            className="w-full max-w-sm rounded-xl bg-brand-paper p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-heading text-lg font-extrabold text-brand-forest">Delete product?</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-brand-forest/60">
              {pending.name} will be removed from the demo catalogue. This only affects this
              browser.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  deleteProduct(pending.id);
                  toast.success(`${pending.name} deleted`);
                  setPending(null);
                }}
                className="rounded-md bg-brand-chilli px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-brand-paper"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => setPending(null)}
                className="rounded-md border border-brand-forest/20 px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-brand-forest"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}