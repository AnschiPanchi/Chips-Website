import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";
import { useAuthStore } from "@/stores/auth";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create an account — MORO" }] }),
  component: RegisterPage,
});

const schema = z
  .object({
    name: z.string().min(2, "Enter your name"),
    email: z.string().email("Enter a valid email"),
    phone: z.string().regex(/^[0-9+\s-]{10,15}$/, "Enter a valid phone number"),
    password: z.string().min(6, "Use at least 6 characters"),
    confirm: z.string(),
    terms: z.literal(true, { errorMap: () => ({ message: "Please accept the terms" }) }),
  })
  .refine((data) => data.password === data.confirm, {
    path: ["confirm"],
    message: "Passwords don't match",
  });

const field =
  "w-full rounded-md border border-brand-forest/20 bg-brand-paper px-3.5 py-3 text-[14px] text-brand-forest outline-none transition-colors placeholder:text-brand-forest/30 focus:border-brand-forest";
const label = "block text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-forest/50";

function RegisterPage() {
  const navigate = useNavigate();
  const registerUser = useAuthStore((s) => s.register);
  const [show, setShow] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = (values) => {
    setTimeout(() => {
      registerUser({ name: values.name, email: values.email, phone: values.phone });
      navigate({ to: "/account" });
    }, 700);
  };

  return (
    <AuthShell
      eyebrow="Join the crunch"
      title="Create your account"
      copy="Order tracking, saved addresses and a wishlist that remembers what you wanted."
      footer={
        <p>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-brand-forest underline underline-offset-4">
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <label htmlFor="reg-name" className={label}>
            Full name
          </label>
          <input id="reg-name" className={`mt-2 ${field}`} {...register("name")} />
          {errors.name && <p className="mt-1.5 text-[12px] text-brand-chilli">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="reg-email" className={label}>
            Email
          </label>
          <input id="reg-email" type="email" className={`mt-2 ${field}`} {...register("email")} />
          {errors.email && <p className="mt-1.5 text-[12px] text-brand-chilli">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="reg-phone" className={label}>
            Phone
          </label>
          <input id="reg-phone" type="tel" className={`mt-2 ${field}`} {...register("phone")} />
          {errors.phone && <p className="mt-1.5 text-[12px] text-brand-chilli">{errors.phone.message}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="reg-password" className={label}>
              Password
            </label>
            <div className="relative mt-2">
              <input
                id="reg-password"
                type={show ? "text" : "password"}
                className={`${field} pr-11`}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                aria-label={show ? "Hide password" : "Show password"}
                className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center text-brand-forest/40 hover:text-brand-forest"
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-[12px] text-brand-chilli">{errors.password.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="reg-confirm" className={label}>
              Confirm
            </label>
            <input
              id="reg-confirm"
              type={show ? "text" : "password"}
              className={`mt-2 ${field}`}
              {...register("confirm")}
            />
            {errors.confirm && (
              <p className="mt-1.5 text-[12px] text-brand-chilli">{errors.confirm.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="flex items-start gap-2.5 text-[12.5px] text-brand-forest/70">
            <input type="checkbox" className="mt-0.5 h-4 w-4 accent-brand-forest" {...register("terms")} />
            I agree to the demo terms and privacy notes.
          </label>
          {errors.terms && <p className="mt-1.5 text-[12px] text-brand-chilli">{errors.terms.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-forest px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-paper transition-colors hover:bg-brand-ink disabled:opacity-60"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {isSubmitting ? "Creating account" : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}