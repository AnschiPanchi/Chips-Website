import { useState } from "react";
import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import AuthShell from "@/components/auth/AuthShell";
import { useAuthStore } from "@/stores/auth";
import { authApi } from "@/api/apiClient";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — MORO" }] }),
  beforeLoad: () => {
    if (authApi.hasToken()) {
      throw redirect({ to: "/" });
    }
  },
  component: LoginPage,
});

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const field =
  "w-full rounded-md border border-brand-forest/20 bg-brand-paper px-3.5 py-3 text-[14px] text-brand-forest outline-none transition-colors placeholder:text-brand-forest/30 focus:border-brand-forest";

function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [show, setShow] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { email: "", password: "" } });

  const onSubmit = async (values) => {
    try {
      const user = await login({ email: values.email, password: values.password });
      toast.success("Welcome back!");
      if (user?.role === "admin") {
        navigate({ to: "/admin" });
      } else {
        const searchParams = new URLSearchParams(window.location.search);
        const redirectUrl = searchParams.get("redirect");
        if (redirectUrl && !redirectUrl.includes("/admin")) {
          window.location.href = redirectUrl;
        } else {
          navigate({ to: "/" });
        }
      }
    } catch (err) {
      toast.error(err.message || "Invalid email or password");
    }
  };

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to your snack stash"
      copy="Your orders, saved addresses and wishlist, all in one place."
      footer={
        <p>
          New here?{" "}
          <Link to="/register" className="font-semibold text-brand-forest underline underline-offset-4">
            Create an account
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <label htmlFor="login-email" className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-forest/50">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            className={`mt-2 ${field}`}
            {...register("email")}
          />
          {errors.email && <p className="mt-1.5 text-[12px] text-brand-chilli">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="login-password" className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-forest/50">
              Password
            </label>
            <Link to="/forgot-password" className="text-[11px] font-medium text-brand-forest/50 hover:text-brand-chilli">
              Forgot password?
            </Link>
          </div>
          <div className="relative mt-2">
            <input
              id="login-password"
              type={show ? "text" : "password"}
              autoComplete="current-password"
              className={`${field} pr-11`}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? "Hide password" : "Show password"}
              className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded text-brand-forest/40 hover:text-brand-forest"
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 text-[12px] text-brand-chilli">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-forest px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-paper transition-colors hover:bg-brand-ink disabled:opacity-60"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {isSubmitting ? "Signing in" : "Sign in"}
        </button>

        <button
          type="button"
          onClick={() => {
            setValue("email", "aanya.kapoor@example.com", { shouldValidate: true });
            setValue("password", "MOROcrunch", { shouldValidate: true });
          }}
          className="w-full rounded-md border border-brand-forest/20 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-forest/70 transition-colors hover:border-brand-forest hover:text-brand-forest"
        >
          Fill demo credentials
        </button>
      </form>
    </AuthShell>
  );
}