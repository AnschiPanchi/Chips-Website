import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { brand } from "@/lib/brand";

export const Route = createFileRoute("/_site/contact")({
  head: () => ({ meta: [{ title: "Contact us — MORO" }] }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().min(2, "Enter your name"),
  email: z.string().email("Enter a valid email"),
  subject: z.enum(["order", "bulk", "feedback", "other"]),
  message: z.string().min(10, "Tell us a little more (10 characters minimum)"),
});

const field =
  "w-full rounded-md border border-brand-forest/20 bg-brand-paper px-3.5 py-3 text-[14px] text-brand-forest outline-none transition-colors placeholder:text-brand-forest/30 focus:border-brand-forest";
const label = "block text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-forest/50";

function ContactPage() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { subject: "order" } });

  const onSubmit = () => {
    setTimeout(() => {
      setSent(true);
      reset();
      toast.success("Message noted — demo only, nothing was sent.");
    }, 600);
  };

  return (
    <div className="container-x py-14 lg:py-20">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <div>
          <p className="eyebrow text-brand-chilli">Contact</p>
          <h1 className="mt-4 font-heading text-[clamp(2rem,4.6vw,3.2rem)] font-extrabold leading-[1] tracking-[-0.035em] text-brand-forest">
            Talk to a human.
          </h1>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-brand-forest/65">
            Questions about an order, a bulk box for a hostel floor, or a flavour you want us to
            make next — we read everything.
          </p>

          <div className="mt-8 space-y-4 border-t border-brand-forest/12 pt-8">
            <p className="flex items-center gap-3 text-[13.5px] text-brand-forest/75">
              <Mail className="h-4 w-4 text-brand-olive" /> {brand.email}
            </p>
            <p className="flex items-center gap-3 text-[13.5px] text-brand-forest/75">
              <Phone className="h-4 w-4 text-brand-olive" /> {brand.phone}
            </p>
            <p className="flex items-center gap-3 text-[13.5px] text-brand-forest/75">
              <MapPin className="h-4 w-4 text-brand-olive" /> {brand.city}
            </p>
          </div>
          <p className="mt-6 text-[12px] leading-relaxed text-brand-forest/45">
            Support hours: Monday to Saturday, 10am to 6pm IST. Replies usually within one working
            day.
          </p>
        </div>

        <div className="rounded-2xl border border-brand-forest/12 bg-brand-cream/40 p-6 lg:p-8">
          {sent ? (
            <div className="py-10 text-center">
              <p className="font-heading text-xl font-extrabold text-brand-forest">
                Message received (in this demo)
              </p>
              <p className="mx-auto mt-2 max-w-sm text-[13.5px] leading-relaxed text-brand-forest/60">
                Nothing was actually sent — this is a frontend demonstration. In the live store
                you'd hear back within a working day.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-6 rounded-md border border-brand-forest/25 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-forest"
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="c-name" className={label}>
                    Name
                  </label>
                  <input id="c-name" className={`mt-2 ${field}`} {...register("name")} />
                  {errors.name && (
                    <p className="mt-1.5 text-[12px] text-brand-chilli">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="c-email" className={label}>
                    Email
                  </label>
                  <input id="c-email" type="email" className={`mt-2 ${field}`} {...register("email")} />
                  {errors.email && (
                    <p className="mt-1.5 text-[12px] text-brand-chilli">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="c-subject" className={label}>
                  What's this about?
                </label>
                <select id="c-subject" className={`mt-2 ${field}`} {...register("subject")}>
                  <option value="order">An order</option>
                  <option value="bulk">Bulk or gifting</option>
                  <option value="feedback">Product feedback</option>
                  <option value="other">Something else</option>
                </select>
              </div>

              <div>
                <label htmlFor="c-message" className={label}>
                  Message
                </label>
                <textarea
                  id="c-message"
                  rows={5}
                  className={`mt-2 ${field} resize-none`}
                  {...register("message")}
                />
                {errors.message && (
                  <p className="mt-1.5 text-[12px] text-brand-chilli">{errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-forest px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-paper transition-colors hover:bg-brand-ink disabled:opacity-60"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {isSubmitting ? "Sending" : "Send message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}