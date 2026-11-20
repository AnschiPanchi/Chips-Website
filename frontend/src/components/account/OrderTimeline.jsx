import { Check, X } from "lucide-react";
import { shortDate } from "@/lib/format";
import { trackingSteps, statusLabel } from "@/data/orders";

export default function OrderTimeline({ order }) {
  if (order.status === "cancelled") {
    return (
      <div className="flex items-center gap-3 rounded-lg bg-brand-ink/5 px-4 py-3">
        <X className="h-4 w-4 text-brand-ink/50" />
        <p className="text-[13px] text-brand-ink/60">
          This order was cancelled. Refunds in the live store land in 3–5 working days.
        </p>
      </div>
    );
  }

  const current = trackingSteps.indexOf(order.status);

  return (
    <ol className="space-y-0">
      {trackingSteps.map((step, index) => {
        const done = index <= current;
        const active = index === current;
        return (
          <li key={step} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border ${
                  done
                    ? "border-brand-forest bg-brand-forest text-brand-paper"
                    : "border-brand-forest/20 text-brand-forest/30"
                }`}
              >
                {done ? <Check className="h-3 w-3" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
              </span>
              {index < trackingSteps.length - 1 && (
                <span className={`h-8 w-px ${done ? "bg-brand-forest/40" : "bg-brand-forest/12"}`} />
              )}
            </div>
            <div className="pb-2">
              <p
                className={`text-[13px] ${
                  active ? "font-semibold text-brand-forest" : done ? "text-brand-forest/75" : "text-brand-forest/35"
                }`}
              >
                {statusLabel[step]}
              </p>
              {index === 0 && (
                <p className="text-[11px] text-brand-forest/40">{shortDate(order.placedAt)}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}