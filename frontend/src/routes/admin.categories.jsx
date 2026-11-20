import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import AdminHeader from "@/components/admin/AdminHeader";
import { useAdminStore } from "@/stores/admin";

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategories,
});

function AdminCategories() {
  const categories = useAdminStore((s) => s.categories);
  const products = useAdminStore((s) => s.products);
  const addCategory = useAdminStore((s) => s.addCategory);
  const deleteCategory = useAdminStore((s) => s.deleteCategory);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const submit = (event) => {
    event.preventDefault();
    if (name.trim().length < 3) {
      setError("Category name needs at least 3 characters.");
      return;
    }
    if (categories.some((c) => c.slug === name.trim().toLowerCase().replace(/\s+/g, "-"))) {
      setError("That category already exists.");
      return;
    }
    addCategory(name.trim(), description.trim());
    setName("");
    setDescription("");
    setError("");
    toast.success("Category added");
  };

  return (
    <div className="pb-16">
      <AdminHeader title="Categories" subtitle={`${categories.length} ranges`} />

      <div className="grid gap-4 px-5 py-6 lg:grid-cols-[1.6fr_1fr] lg:px-8">
        <section className="rounded-xl border border-brand-forest/12 bg-brand-paper p-5">
          <h2 className="font-heading text-[13px] font-extrabold uppercase tracking-[0.12em] text-brand-forest">
            All categories
          </h2>
          <ul className="mt-4 divide-y divide-brand-forest/10">
            {categories.map((category) => {
              const count = products.filter((p) => p.category === category.slug).length;
              return (
                <li key={category.slug} className="flex items-start justify-between gap-3 py-3">
                  <div>
                    <p className="text-[13px] font-semibold text-brand-forest">{category.name}</p>
                    <p className="mt-0.5 text-[11px] text-brand-forest/50">
                      {count} products · /{category.slug}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      deleteCategory(category.slug);
                      toast.success("Category removed");
                    }}
                    aria-label={`Delete ${category.name}`}
                    className="text-brand-forest/35 hover:text-brand-chilli"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="rounded-xl border border-brand-forest/12 bg-brand-paper p-5">
          <h2 className="font-heading text-[13px] font-extrabold uppercase tracking-[0.12em] text-brand-forest">
            Add a category
          </h2>
          <form onSubmit={submit} className="mt-4 space-y-3">
            <div>
              <label htmlFor="cat-name" className="block text-[10.5px] font-semibold uppercase tracking-[0.12em] text-brand-forest/50">
                Name
              </label>
              <input
                id="cat-name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                className="mt-1.5 w-full rounded-md border border-brand-forest/20 px-3 py-2.5 text-[13px] outline-none focus:border-brand-forest"
              />
            </div>
            <div>
              <label htmlFor="cat-desc" className="block text-[10.5px] font-semibold uppercase tracking-[0.12em] text-brand-forest/50">
                Description
              </label>
              <textarea
                id="cat-desc"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1.5 w-full resize-none rounded-md border border-brand-forest/20 px-3 py-2.5 text-[13px] outline-none focus:border-brand-forest"
              />
            </div>
            {error && <p className="text-[11.5px] text-brand-chilli">{error}</p>}
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-md bg-brand-forest px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-brand-paper"
            >
              <Plus className="h-3.5 w-3.5" /> Add category
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}