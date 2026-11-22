import { Link, useLocation } from "@tanstack/react-router";
import {
  BarChart3,
  Boxes,
  LayoutGrid,
  Megaphone,
  Package,
  Percent,
  Settings,
  ShoppingCart,
  Star,
  Users,
} from "lucide-react";
import { brand } from "@/lib/brand";

const nav = [
  { label: "Overview", to: "/admin", icon: BarChart3 },
  { label: "Products", to: "/admin/products", icon: Package },
  { label: "Categories", to: "/admin/categories", icon: LayoutGrid },
  { label: "Orders", to: "/admin/orders", icon: ShoppingCart },
  { label: "Campaigns & WhatsApp", to: "/admin/campaigns", icon: Megaphone },
  { label: "Customers", to: "/admin/customers", icon: Users },
  { label: "Inventory", to: "/admin/inventory", icon: Boxes },
  { label: "Coupons", to: "/admin/coupons", icon: Percent },
  { label: "Reviews", to: "/admin/reviews", icon: Star },
  { label: "Settings", to: "/admin/settings", icon: Settings },
];

export default function AdminSidebar({ onNavigate }) {
  const { pathname } = useLocation();

  return (
    <div className="flex h-full flex-col bg-brand-forest text-brand-cream">
      <div className="px-6 py-6">
        <Link to="/" className="font-heading text-lg font-extrabold tracking-[0.2em]">
          {brand.name}
        </Link>
        <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-brand-cream/40">
          Admin console
        </p>
      </div>

      <nav className="flex-1 space-y-0.5 px-3" aria-label="Admin">
        {nav.map((item) => {
          const active = item.to === "/admin" ? pathname === "/admin" : pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] transition-colors ${
                active
                  ? "bg-brand-cream text-brand-forest"
                  : "text-brand-cream/70 hover:bg-brand-cream/10 hover:text-brand-cream"
              }`}
            >
              <item.icon className="h-4 w-4" strokeWidth={1.7} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-brand-cream/12 px-6 py-4">
        <Link to="/" className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-cream/50 hover:text-brand-chilli">
          View storefront
        </Link>
        <p className="mt-3 text-[10px] leading-relaxed text-brand-cream/40">
          MORO Admin Console · Big Flavour, Zero Palm Oil
        </p>
      </div>
    </div>
  );
}