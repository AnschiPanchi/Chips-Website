import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const submit = (event) => {
    event.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
    if (!valid) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    setDone(true);
    toast.success("You're on the list. Watch your inbox.");
  };

  return (
    <section className="bg-brand-forest text-brand-cream">
      <div className="container-x grid gap-8 py-16 lg:grid-cols-2 lg:items-center lg:py-20">
        <div>
          <p className="eyebrow text-brand-chilli">The snack letter</p>
          <h2 className="mt-3 max-w-md font-heading text-[clamp(1.6rem,3vw,2.3rem)] font-extrabold leading-[1.08] tracking-[-0.03em]">
            New flavours, restocks and the occasional discount code.
          </h2>
          <p className="mt-3 max-w-sm text-[13.5px] leading-relaxed text-brand-cream/60">
            One email a month. No spam, no palm oil, no drama.
          </p>
        </div>

        <div>
          {done ? (
            <div className="flex items-center gap-3 rounded-xl border border-brand-cream/20 bg-brand-cream/5 px-5 py-6">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-olive text-brand-paper">
                <Check className="h-4 w-4" />
              </span>
              <p className="text-sm text-brand-cream/85">
                You're subscribed. First code lands in your inbox shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="max-w-md">
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="you@example.com"
                  aria-label="Email address"
                  aria-invalid={!!error}
                  className="w-full rounded-md border border-brand-cream/25 bg-transparent px-4 py-3.5 text-sm text-brand-cream outline-none transition-colors placeholder:text-brand-cream/35 focus:border-brand-chilli"
                />
                <button
                  type="submit"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-brand-chilli px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.14em] text-brand-ink transition-colors hover:bg-brand-cream"
                >
                  Subscribe <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
              {error && <p className="mt-2 text-[12px] text-brand-chilli">{error}</p>}
              <p className="mt-3 text-[11px] text-brand-cream/40">
                Demo store: no emails are actually sent.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}