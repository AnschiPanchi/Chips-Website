import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export default function StatCard({ label, value, hint, trend, icon: Icon }) {
  const up = trend >= 0;
  return (
    <div className="rounded-xl border border-brand-forest/12 bg-brand-paper p-5">
      <div className="flex items-start justify-between">
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-brand-forest/45">
          {label}
        </p>
        {Icon && <Icon className="h-4 w-4 text-brand-olive" strokeWidth={1.7} />}
      </div>
      <p className="mt-3 font-heading text-2xl font-extrabold tracking-tight text-brand-forest">
        {value}
      </p>
      <div className="mt-1.5 flex items-center gap-2">
        {typeof trend === "number" && (
          <span
            className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${
              up ? "text-brand-olive" : "text-brand-chilli"
            }`}
          >
            {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(trend)}%
          </span>
        )}
        {hint && <span className="text-[11px] text-brand-forest/45">{hint}</span>}
      </div>
    </div>
  );
}