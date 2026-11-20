import { createFileRoute } from "@tanstack/react-router";
import AdminHeader from "@/components/admin/AdminHeader";
import ProductForm from "@/components/admin/ProductForm";

export const Route = createFileRoute("/admin/products/new")({
  component: NewProduct,
});

function NewProduct() {
  return (
    <div className="pb-16">
      <AdminHeader title="New product" subtitle="Add a snack to the catalogue" />
      <div className="px-5 py-6 lg:px-8">
        <ProductForm />
      </div>
    </div>
  );
}