import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import ProductForm from "@/components/admin/ProductForm";
import { useAdminStore } from "@/stores/admin";

export const Route = createFileRoute("/admin/products/$id/edit")({
  component: EditProduct,
});

function EditProduct() {
  const { id } = Route.useParams();
  const product = useAdminStore((s) => s.products.find((p) => p.id === id));

  return (
    <div className="pb-16">
      <AdminHeader
        title={product ? `Edit ${product.name}` : "Edit product"}
        subtitle="Changes save to this browser"
      />
      <div className="px-5 py-6 lg:px-8">
        {product ? (
          <ProductForm product={product} />
        ) : (
          <div className="rounded-xl border border-dashed border-brand-forest/20 px-6 py-14 text-center">
            <p className="font-heading text-base font-bold text-brand-forest">Product not found</p>
            <p className="mt-2 text-[13px] text-brand-forest/55">
              It may have been deleted in this session.
            </p>
            <Link
              to="/admin/products"
              className="mt-5 inline-flex items-center gap-2 rounded-md bg-brand-forest px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-brand-paper"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}