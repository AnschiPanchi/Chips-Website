import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import AdminHeader from "@/components/admin/AdminHeader";
import { useAdminStore } from "@/stores/admin";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

const field =
  "w-full rounded-md border border-brand-forest/20 bg-brand-paper px-3.5 py-2.5 text-[13px] text-brand-forest outline-none focus:border-brand-forest";
const label = "block text-[10.5px] font-semibold uppercase tracking-[0.12em] text-brand-forest/50";

function AdminSettings() {
  const settings = useAdminStore((s) => s.settings);
  const updateSettings = useAdminStore((s) => s.updateSettings);
  const { register, handleSubmit } = useForm({ defaultValues: settings });

  const onSubmit = (values) => {
    updateSettings({
      ...values,
      freeShipping: Number(values.freeShipping),
      flatShipping: Number(values.flatShipping),
      lowStock: Number(values.lowStock),
      codEnabled: !!values.codEnabled,
      storeOpen: !!values.storeOpen,
    });
    toast.success("Store settings saved");
  };

  return (
    <div className="pb-16">
      <AdminHeader title="Settings" subtitle="Store preferences for this demo" />

      <div className="px-5 py-6 lg:px-8">
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-4">
          <section className="rounded-xl border border-brand-forest/12 bg-brand-paper p-5">
            <h2 className="font-heading text-[13px] font-extrabold uppercase tracking-[0.12em] text-brand-forest">
              Store
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="s-name" className={label}>
                  Store name
                </label>
                <input id="s-name" className={`mt-1.5 ${field}`} {...register("storeName")} />
              </div>
              <div>
                <label htmlFor="s-email" className={label}>
                  Support email
                </label>
                <input id="s-email" className={`mt-1.5 ${field}`} {...register("supportEmail")} />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <label className="flex items-center gap-2.5 text-[12.5px] text-brand-forest/75">
                <input type="checkbox" className="h-4 w-4 accent-brand-forest" {...register("storeOpen")} />
                Store is accepting orders
              </label>
              <label className="flex items-center gap-2.5 text-[12.5px] text-brand-forest/75">
                <input type="checkbox" className="h-4 w-4 accent-brand-forest" {...register("codEnabled")} />
                Cash on delivery enabled
              </label>
            </div>
          </section>

          <section className="rounded-xl border border-brand-forest/12 bg-brand-paper p-5">
            <h2 className="font-heading text-[13px] font-extrabold uppercase tracking-[0.12em] text-brand-forest">
              Shipping & inventory
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="s-free" className={label}>
                  Free shipping over (₹)
                </label>
                <input id="s-free" type="number" className={`mt-1.5 ${field}`} {...register("freeShipping")} />
              </div>
              <div>
                <label htmlFor="s-flat" className={label}>
                  Flat shipping (₹)
                </label>
                <input id="s-flat" type="number" className={`mt-1.5 ${field}`} {...register("flatShipping")} />
              </div>
              <div>
                <label htmlFor="s-low" className={label}>
                  Low stock threshold
                </label>
                <input id="s-low" type="number" className={`mt-1.5 ${field}`} {...register("lowStock")} />
              </div>
            </div>
          </section>

          <button
            type="submit"
            className="rounded-md bg-brand-forest px-5 py-3 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-brand-paper hover:bg-brand-ink"
          >
            Save settings
          </button>
          <p className="text-[11px] text-brand-forest/40">
            Demo only: settings are stored in this browser and do not change the storefront pricing
            rules.
          </p>
        </form>
      </div>
    </div>
  );
}