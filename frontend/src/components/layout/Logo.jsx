import { Link } from "@tanstack/react-router";
import { brand } from "@/lib/brand";

export default function Logo({ className = "" }) {
  return (
    <Link
      to="/"
      aria-label={`${brand.name} home`}
      className={`group inline-flex items-baseline gap-1.5 ${className}`}
    >
      <span className="font-heading text-[22px] font-extrabold leading-none tracking-[0.2em] text-brand-forest">
        {brand.name}
      </span>
      <span className="h-1.5 w-1.5 rounded-full bg-brand-chilli transition-transform duration-300 group-hover:scale-150" />
    </Link>
  );
}