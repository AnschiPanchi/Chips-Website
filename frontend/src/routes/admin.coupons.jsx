import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import AdminHeader from "@/components/admin/AdminHeader";
import { inr } from "@/lib/format";
import { useAdminStore } from "@/stores/admin";

export const Route = createFileRoute("/admin/coupons")({
  component: AdminCoupons,
});

const field =
  "w-full rounded-md border border-brand-forest/20 bg-brand-paper px-3 py-2.5 text-[12.5px] text-brand-forest outline-none focus:border-brand-forest";
const label = "block text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-forest/50";

function AdminCoupons() {
  const coupons = useAdminStore((s) => s.coupons);
  const addCoupon = useAdminStore((s) => s.addCoupon);
  const toggleCoupon = useAdminStore((s) => s.toggleCoupon);
  const deleteCoupon = useAdminStore((s) => s.deleteCoupon);
  const [form, setForm] = useState({ code: "", type: "percent", value: 10, minOrder: 499 });
  const [error, setError] = useState("");

  const submit = (event) => {
    event.preventDefault();
    const code = form.code.trim().toUpperCase();
    if (code.length < 3) {
      setError("Code needs at least 3 characters.");
      return;
    }
    if (coupons.some((c) => c.code === code)) {
      setError("That code already exists.");
      return;
    }
    addCoupon({
      code,
      type: form.type,
      value: Number(form.value) || 0,
      minOrder: Number(form.minOrder) || 0,
      active: true,
      description:
        form.type === "percent"
          ? `${form.value}% off orders over ₹${form.minOrder}`
          : form.type === "flat"
          ? `₹${form.value} off orders over ₹${form.minOrder}`
          : "Free shipping",
    });
    setForm({ code: "", type: "percent", value: 10, minOrder: 499 });
    setError("");
    toast.success("Coupon created");
  };

  return (
    <div className="pb-16">
      <AdminHeader title="Coupons" subtitle={`${coupons.length} codes`} />

      <div className="grid gap-4 px-5 py-6 lg:grid-cols-[1.6fr_1fr] lg:px-8">
        <section className="rounded-xl border border-brand-forest/12 bg-brand-paper p-5">
          <h2 className="font-heading text-[13px] font-extrabold uppercase tracking-[0.12em] text-brand-forest">
            All codes
          </h2>
          <ul className="mt-4 divide-y divide-brand-forest/10">
            {coupons.map((coupon) => (
              <li key={coupon.code} className="flex items-start justify-between gap-3 py-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-heading text-[12.5px] font-bold tracking-wide text-brand-forest">
                      {coupon.code}
                    </p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] ${
                        coupon.active
                          ? "bg-brand-olive/15 text-brand-olive"
                          : "bg-brand-ink/10 text-brand-ink/50"
                      }`}
                    >
                      {coupon.active ? "Active" : "Paused"}
                    </span>
                  </div>
                  <p className="mt-1 text-[11.5px] text-brand-forest/55">{coupon.description}</p>
                  {coupon.minOrder > 0 && (
                    <p className="text-[11px] text-brand-forest/40">Min order {inr(coupon.minOrder)}</p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggleCoupon(coupon.code)}
                    className="text-[10px] font-semibold uppercase tracking-[0.1em] text-brand-forest/50 hover:text-brand-forest"
                  >
                    {coupon.active ? "Pause" : "Activate"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      deleteCoupon(coupon.code);
                      toast.success("Coupon deleted");
                    }}
                    aria-label={`Delete ${coupon.code}`}
                    className="text-brand-forest/35 hover:text-brand-chilli"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-brand-forest/12 bg-brand-paper p-5">
          <h2 className="font-heading text-[13px] font-extrabold uppercase tracking-[0.12em] text-brand-forest">
            Create a coupon
          </h2>
          <form onSubmit={submit} className="mt-4 space-y-3">
            <div>
              <label htmlFor="c-code" className={label}>
                Code
              </label>
              <input
                id="c-code"
                value={form.code}
                onChange={(e) => {
                  setForm({ ...form, code: e.target.value.toUpperCase() });
                  setError("");
                }}
                placeholder="CRUNCH20"
                className={`mt-1.5 ${field} uppercase`}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="c-type" className={label}>
                  Type
                </label>
                <select
                  id="c-type"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className={`mt-1.5 ${field}`}
                >
                  <option value="percent">Percent</option>
                  <option value="flat">Flat ₹</option>
                  <option value="shipping">Free shipping</option>
                </select>
              </div>
              <div>
                <label htmlFor="c-value" className={label}>
                  Value
                </label>
                <input
                  id="c-value"
                  type="number"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                  className={`mt-1.5 ${field}`}
                />
              </div>
            </div>
            <div>
              <label htmlFor="c-min" className={label}>
                Minimum order (₹)
              </label>
              <input
                id="c-min"
                type="number"
                value={form.minOrder}
                onChange={(e) => setForm({ ...form, minOrder: e.target.value })}
                className={`mt-1.5 ${field}`}
              />
            </div>
            {error && <p className="text-[11.5px] text-brand-chilli">{error}</p>}
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-md bg-brand-forest px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-brand-paper"
            >
              <Plus className="h-3.5 w-3.5" /> Create coupon
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}