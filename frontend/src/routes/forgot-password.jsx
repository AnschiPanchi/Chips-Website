import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Loader2, MailCheck } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Reset your password — OORA" }] }),
  component: ForgotPasswordPage,
});

const schema = z.object({ email: z.string().email("Enter a valid email") });

const field =
  "w-full rounded-md border border-brand-forest/20 bg-brand-paper px-3.5 py-3 text-[14px] text-brand-forest outline-none transition-colors placeholder:text-brand-forest/30 focus:border-brand-forest";

function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = () => {
    setTimeout(() => setSent(true), 600);
  };

  return (
    <AuthShell
      eyebrow="Password help"
      title={sent ? "Check your inbox" : "Reset your password"}
      copy={
        sent
          ? undefined
          : "Enter the email you signed up with and we'll send a reset link."
      }
      footer={
        <Link to="/login" className="inline-flex items-center gap-2 font-semibold text-brand-forest">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
        </Link>
      }
    >
      {sent ? (
        <div className="rounded-xl border border-brand-olive/35 bg-brand-olive/8 px-5 py-6">
          <MailCheck className="h-6 w-6 text-brand-olive" />
          <p className="mt-3 text-[13.5px] leading-relaxed text-brand-forest/75">
            If an account exists for <span className="font-semibold">{getValues("email")}</span>, a
            reset link is on its way. In this demo no email is sent.
          </p>
          <button
            type="button"
            onClick={() => setSent(false)}
            className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-chilli"
          >
            Use a different email
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div>
            <label htmlFor="forgot-email" className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-forest/50">
              Email
            </label>
            <input id="forgot-email" type="email" className={`mt-2 ${field}`} {...register("email")} />
            {errors.email && <p className="mt-1.5 text-[12px] text-brand-chilli">{errors.email.message}</p>}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-forest px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-paper transition-colors hover:bg-brand-ink disabled:opacity-60"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {isSubmitting ? "Sending link" : "Send reset link"}
          </button>
        </form>
      )}
    </AuthShell>
  );
}