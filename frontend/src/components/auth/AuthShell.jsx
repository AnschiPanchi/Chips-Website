import { Link } from "@tanstack/react-router";
import { brand } from "@/lib/brand";

export default function AuthShell({ eyebrow, title, copy, children, footer }) {
  return (
    <div className="grid min-h-screen bg-brand-paper lg:grid-cols-2">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-brand-forest p-12 text-brand-cream lg:flex">
        <Link to="/" className="font-heading text-xl font-extrabold tracking-[0.2em]">
          {brand.name}
        </Link>
        <div className="relative z-10 max-w-sm">
          <p className="eyebrow text-brand-chilli">{brand.tagline}</p>
          <p className="mt-5 font-heading text-[clamp(2rem,3vw,2.6rem)] font-extrabold leading-[1.02] tracking-[-0.03em]">
            Big crunch. Full-on flavour. No palm oil.
          </p>
          <p className="mt-4 text-[13.5px] leading-relaxed text-brand-cream/60">
            An account keeps your orders, addresses and wishlist in one place — and gets you first
            access to new flavours.
          </p>
        </div>
        <p className="text-[11px] uppercase tracking-[0.16em] text-brand-cream/35">
          Demo storefront · mock authentication
        </p>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full border border-brand-cream/15"
        />
      </aside>

      <main className="flex items-center justify-center px-5 py-14 sm:px-10">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 font-heading text-base font-extrabold tracking-[0.2em] text-brand-forest lg:hidden"
          >
            {brand.name}
          </Link>
          <p className="eyebrow text-brand-chilli">{eyebrow}</p>
          <h1 className="mt-3 font-heading text-[clamp(1.8rem,3.6vw,2.4rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-brand-forest">
            {title}
          </h1>
          {copy && <p className="mt-3 text-[13.5px] leading-relaxed text-brand-forest/60">{copy}</p>}
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6 text-[13px] text-brand-forest/60">{footer}</div>}
          <p className="mt-10 text-[11px] leading-relaxed text-brand-forest/35">
            This is a frontend demonstration. Sign-in is simulated in the browser and is not secure
            authentication.
          </p>
        </div>
      </main>
    </div>
  );
}