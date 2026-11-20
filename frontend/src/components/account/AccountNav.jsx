import { Link, useLocation } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/auth";

const links = [
  { label: "Overview", to: "/account" },
  { label: "Profile", to: "/account/profile" },
  { label: "Addresses", to: "/account/addresses" },
  { label: "Orders", to: "/account/orders" },
  { label: "Wishlist", to: "/wishlist" },
];

export default function AccountNav() {
  const { pathname } = useLocation();
  const logout = useAuthStore((s) => s.logout);

  return (
    <nav aria-label="Account" className="flex flex-col gap-1">
      {links.map((link) => {
        const active = pathname === link.to || (link.to !== "/account" && pathname.startsWith(link.to));
        return (
          <Link
            key={link.to}
            to={link.to}
            className={`rounded-lg px-3.5 py-2.5 text-[13px] font-medium transition-colors ${
              active
                ? "bg-brand-forest text-brand-paper"
                : "text-brand-forest/70 hover:bg-brand-forest/6 hover:text-brand-forest"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
      <button
        type="button"
        onClick={logout}
        className="mt-2 flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-[13px] font-medium text-brand-forest/50 transition-colors hover:bg-brand-chilli/8 hover:text-brand-chilli"
      >
        <LogOut className="h-3.5 w-3.5" /> Sign out
      </button>
    </nav>
  );
}