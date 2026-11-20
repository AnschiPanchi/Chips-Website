import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

export default function SectionHeading({ eyebrow, title, copy, action, tone = "light" }) {
  const dark = tone === "dark";
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-xl">
        {eyebrow && (
          <p className={`eyebrow ${dark ? "text-brand-cream/50" : "text-brand-chilli"}`}>{eyebrow}</p>
        )}
        <h2
          className={`mt-3 font-heading text-[clamp(1.75rem,3.4vw,2.6rem)] font-extrabold leading-[1.05] tracking-[-0.03em] ${
            dark ? "text-brand-cream" : "text-brand-forest"
          }`}
        >
          {title}
        </h2>
        {copy && (
          <p className={`mt-3 text-[15px] leading-relaxed ${dark ? "text-brand-cream/65" : "text-brand-forest/65"}`}>
            {copy}
          </p>
        )}
      </div>
      {action && (
        <Link
          to={action.to}
          params={action.params}
          className={`group inline-flex shrink-0 items-center gap-1.5 border-b pb-1 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors ${
            dark
              ? "border-brand-cream/30 text-brand-cream hover:border-brand-chilli hover:text-brand-chilli"
              : "border-brand-forest/25 text-brand-forest hover:border-brand-chilli hover:text-brand-chilli"
          }`}
        >
          {action.label}
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}