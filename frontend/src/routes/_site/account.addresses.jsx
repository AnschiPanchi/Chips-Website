import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuthStore } from "@/stores/auth";

export const Route = createFileRoute("/_site/account/addresses")({
  head: () => ({ meta: [{ title: "Addresses — MORO" }] }),
  component: AddressesPage,
});

const schema = z.object({
  label: z.string().min(1, "Add a label"),
  name: z.string().min(2, "Enter the recipient's name"),
  phone: z.string().regex(/^[0-9+\s-]{10,15}$/, "Enter a valid phone number"),
  line1: z.string().min(5, "Enter the street address"),
  line2: z.string().optional(),
  city: z.string().min(2, "Enter a city"),
  state: z.string().min(2, "Enter a state"),
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit PIN code"),
});

const field =
  "w-full rounded-md border border-brand-forest/20 bg-brand-paper px-3.5 py-2.5 text-[13.5px] text-brand-forest outline-none focus:border-brand-forest";
const label = "block text-[10.5px] font-semibold uppercase tracking-[0.12em] text-brand-forest/50";

function AddressesPage() {
  const user = useAuthStore((s) => s.user);
  const addAddress = useAuthStore((s) => s.addAddress);
  const updateAddress = useAuthStore((s) => s.updateAddress);
  const removeAddress = useAuthStore((s) => s.removeAddress);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const openNew = () => {
    setEditing(null);
    reset({ label: "Home", name: user?.name || "", phone: user?.phone || "", line1: "", line2: "", city: "", state: "", pincode: "" });
    setOpen(true);
  };

  const openEdit = (address) => {
    setEditing(address);
    reset(address);
    setOpen(true);
  };

  const onSubmit = (values) => {
    if (editing) {
      updateAddress(editing.id, values);
      toast.success("Address updated");
    } else {
      addAddress(values);
      toast.success("Address added");
    }
    setOpen(false);
  };

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="font-heading text-base font-extrabold uppercase tracking-[0.12em] text-brand-forest">
            Saved addresses
          </h2>
          <p className="mt-1 text-[13px] text-brand-forest/55">Used to prefill checkout.</p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="inline-flex items-center gap-1.5 rounded-md bg-brand-forest px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-brand-paper"
        >
          <Plus className="h-3.5 w-3.5" /> Add address
        </button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {(user?.addresses || []).map((address) => (
          <div key={address.id} className="rounded-xl border border-brand-forest/12 p-5">
            <div className="flex items-start justify-between gap-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-brand-chilli">
                {address.label}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(address)}
                  aria-label="Edit address"
                  className="text-brand-forest/35 hover:text-brand-forest"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    removeAddress(address.id);
                    toast.success("Address removed");
                  }}
                  aria-label="Delete address"
                  className="text-brand-forest/35 hover:text-brand-chilli"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <p className="mt-3 text-[13.5px] font-semibold text-brand-forest">{address.name}</p>
            <p className="mt-1 text-[12.5px] leading-relaxed text-brand-forest/65">
              {address.line1}
              {address.line2 ? `, ${address.line2}` : ""}
              <br />
              {address.city}, {address.state} {address.pincode}
              <br />
              {address.phone}
            </p>
          </div>
        ))}
        {(user?.addresses || []).length === 0 && (
          <p className="rounded-xl border border-dashed border-brand-forest/20 px-5 py-10 text-center text-[13px] text-brand-forest/55 sm:col-span-2">
            No addresses saved yet.
          </p>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[88vh] overflow-y-auto bg-brand-paper sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-extrabold text-brand-forest">
              {editing ? "Edit address" : "Add address"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-2 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={label}>Label</label>
                <input className={`mt-1.5 ${field}`} {...register("label")} />
                {errors.label && <p className="mt-1 text-[11px] text-brand-chilli">{errors.label.message}</p>}
              </div>
              <div>
                <label className={label}>Recipient</label>
                <input className={`mt-1.5 ${field}`} {...register("name")} />
                {errors.name && <p className="mt-1 text-[11px] text-brand-chilli">{errors.name.message}</p>}
              </div>
            </div>
            <div>
              <label className={label}>Phone</label>
              <input className={`mt-1.5 ${field}`} {...register("phone")} />
              {errors.phone && <p className="mt-1 text-[11px] text-brand-chilli">{errors.phone.message}</p>}
            </div>
            <div>
              <label className={label}>Address</label>
              <input className={`mt-1.5 ${field}`} {...register("line1")} />
              {errors.line1 && <p className="mt-1 text-[11px] text-brand-chilli">{errors.line1.message}</p>}
            </div>
            <div>
              <label className={label}>Landmark (optional)</label>
              <input className={`mt-1.5 ${field}`} {...register("line2")} />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className={label}>City</label>
                <input className={`mt-1.5 ${field}`} {...register("city")} />
                {errors.city && <p className="mt-1 text-[11px] text-brand-chilli">{errors.city.message}</p>}
              </div>
              <div>
                <label className={label}>State</label>
                <input className={`mt-1.5 ${field}`} {...register("state")} />
                {errors.state && <p className="mt-1 text-[11px] text-brand-chilli">{errors.state.message}</p>}
              </div>
              <div>
                <label className={label}>PIN code</label>
                <input className={`mt-1.5 ${field}`} inputMode="numeric" {...register("pincode")} />
                {errors.pincode && <p className="mt-1 text-[11px] text-brand-chilli">{errors.pincode.message}</p>}
              </div>
            </div>
            <button
              type="submit"
              className="mt-2 w-full rounded-md bg-brand-forest px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-paper"
            >
              {editing ? "Save address" : "Add address"}
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}