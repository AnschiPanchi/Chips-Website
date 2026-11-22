import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { LogIn } from "lucide-react";
import AccountNav from "@/components/account/AccountNav";
import { useAuthStore } from "@/stores/auth";
import { useMounted } from "@/hooks/useMounted";

export const Route = createFileRoute("/_site/account")({
  component: AccountLayout,
});

function AccountLayout() {
  const user = useAuthStore((s) => s.user);
  const mounted = useMounted();

  if (!mounted) {
    return <div className="container-x py-20 text-[13px] text-brand-forest/40">Loading your account…</div>;
  }

  if (!user) {
    return (
      <div className="container-x py-20 text-center lg:py-28">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-cream">
          <LogIn className="h-7 w-7 text-brand-forest/40" strokeWidth={1.5} />
        </div>
        <h1 className="mt-5 font-heading text-2xl font-extrabold text-brand-forest">
          Sign in to see your account
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-[13.5px] leading-relaxed text-brand-forest/60">
          Your orders, addresses and wishlist live here. This demo signs you in locally.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/login"
            className="rounded-md bg-brand-forest px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-paper"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="rounded-md border border-brand-forest/25 px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-forest"
          >
            Create account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-x py-10 lg:py-14">
      <header className="border-b border-brand-forest/12 pb-6">
        <p className="eyebrow text-brand-chilli">Your account</p>
        <h1 className="mt-2 font-heading text-[clamp(1.7rem,3.6vw,2.4rem)] font-extrabold leading-tight tracking-[-0.03em] text-brand-forest">
          Hi, {user.name.split(" ")[0]}
        </h1>
        <p className="mt-1 text-[13px] text-brand-forest/55">{user.email}</p>
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[210px_1fr] lg:gap-14">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <AccountNav />
        </aside>
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}