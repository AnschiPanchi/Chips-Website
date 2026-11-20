import { Link } from "@tanstack/react-router";
import { Instagram, Mail, Phone } from "lucide-react";
import { brand } from "@/lib/brand";
import { footerColumns } from "@/data/navigation";

export default function Footer() {
  return (
    <footer className="mt-auto bg-brand-forest text-brand-cream">
      <div className="container-x grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-10 lg:py-16">
        <div>
          <p className="font-heading text-2xl font-extrabold tracking-[0.2em]">{brand.name}</p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-brand-cream/65">
            {brand.promise} Made for the 4pm craving, the study break and the group chat that
            always wants one more pack.
          </p>
          <div className="mt-6 space-y-2 text-sm text-brand-cream/70">
            <a href={`mailto:${brand.email}`} className="flex items-center gap-2 hover:text-brand-chilli">
              <Mail className="h-4 w-4" strokeWidth={1.6} /> {brand.email}
            </a>
            <a href={`tel:${brand.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-brand-chilli">
              <Phone className="h-4 w-4" strokeWidth={1.6} /> {brand.phone}
            </a>
            <p className="flex items-center gap-2">
              <Instagram className="h-4 w-4" strokeWidth={1.6} /> {brand.instagram}
            </p>
          </div>
        </div>

        {footerColumns.map((column) => (
          <div key={column.title}>
            <p className="eyebrow text-brand-cream/45">{column.title}</p>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    params={link.params}
                    className="text-sm text-brand-cream/75 transition-colors hover:text-brand-chilli"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-brand-cream/12">
        <div className="container-x flex flex-col gap-3 py-5 text-[11px] text-brand-cream/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {brand.name}. {brand.legalName}. A frontend demonstration store.</p>
          <p>Nutrition values are illustrative. No payment is processed in this demo.</p>
        </div>
      </div>
    </footer>
  );
}