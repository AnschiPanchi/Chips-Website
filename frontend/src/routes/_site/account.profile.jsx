import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth";

export const Route = createFileRoute("/_site/account/profile")({
  head: () => ({ meta: [{ title: "Profile — OORA" }] }),
  component: ProfilePage,
});

const schema = z.object({
  name: z.string().min(2, "Enter your name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().regex(/^[0-9+\s-]{10,15}$/, "Enter a valid phone number"),
});

const field =
  "w-full rounded-md border border-brand-forest/20 bg-brand-paper px-3.5 py-3 text-[14px] text-brand-forest outline-none transition-colors focus:border-brand-forest";
const label = "block text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-forest/50";

function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const [saved, setSaved] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: user?.name || "", email: user?.email || "", phone: user?.phone || "" },
  });

  const onSubmit = (values) => {
    setTimeout(() => {
      updateProfile(values);
      setSaved(true);
      toast.success("Profile updated");
      setTimeout(() => setSaved(false), 2500);
    }, 500);
  };

  return (
    <div className="max-w-lg">
      <h2 className="font-heading text-base font-extrabold uppercase tracking-[0.12em] text-brand-forest">
        Personal information
      </h2>
      <p className="mt-2 text-[13px] text-brand-forest/55">
        Saved locally in this demo. Nothing is sent to a server.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-4">
        <div>
          <label htmlFor="p-name" className={label}>
            Full name
          </label>
          <input id="p-name" className={`mt-2 ${field}`} {...register("name")} />
          {errors.name && <p className="mt-1.5 text-[12px] text-brand-chilli">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="p-email" className={label}>
            Email
          </label>
          <input id="p-email" type="email" className={`mt-2 ${field}`} {...register("email")} />
          {errors.email && <p className="mt-1.5 text-[12px] text-brand-chilli">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="p-phone" className={label}>
            Phone
          </label>
          <input id="p-phone" type="tel" className={`mt-2 ${field}`} {...register("phone")} />
          {errors.phone && <p className="mt-1.5 text-[12px] text-brand-chilli">{errors.phone.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded-md bg-brand-forest px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-paper transition-colors hover:bg-brand-ink disabled:opacity-60"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : saved ? (
            <Check className="h-4 w-4" />
          ) : null}
          {isSubmitting ? "Saving" : saved ? "Saved" : "Save changes"}
        </button>
      </form>
    </div>
  );
}