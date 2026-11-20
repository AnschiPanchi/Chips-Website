import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { categories } from "@/data/categories";
import { navLinks } from "@/data/navigation";
import { useAuthStore } from "@/stores/auth";

export default function MobileNav({ open, onOpenChange }) {
  const user = useAuthStore((s) => s.user);
  const close = () => onOpenChange(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[86vw] max-w-sm overflow-y-auto bg-brand-paper p-0">
        <SheetHeader className="border-b border-brand-forest/10 px-6 py-5 text-left">
          <SheetTitle className="font-heading text-sm font-bold uppercase tracking-[0.2em] text-brand-forest">
            Menu
          </SheetTitle>
        </SheetHeader>

        <div className="px-6 py-6">
          <p className="eyebrow text-brand-forest/40">Shop by category</p>
          <div className="mt-4 space-y-1">
            {categories.map((category) => (
              <Link
                key={category.slug}
                to="/collections/$slug"
                params={{ slug: category.slug }}
                onClick={close}
                className="flex items-center justify-between rounded-lg px-3 py-3 text-[15px] font-medium text-brand-forest transition-colors hover:bg-brand-forest/6"
              >
                {category.name}
                <ArrowRight className="h-4 w-4 text-brand-forest/40" />
              </Link>
            ))}
          </div>

          <div className="mt-6 border-t border-brand-forest/10 pt-6">
            {navLinks
              .filter((l) => l.to === "/shop" || l.to === "/about")
              .map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={close}
                  className="block rounded-lg px-3 py-3 text-[15px] font-medium text-brand-forest transition-colors hover:bg-brand-forest/6"
                >
                  {link.label}
                </Link>
              ))}
            <Link
              to="/wishlist"
              onClick={close}
              className="block rounded-lg px-3 py-3 text-[15px] font-medium text-brand-forest transition-colors hover:bg-brand-forest/6"
            >
              Wishlist
            </Link>
            <Link
              to="/account"
              onClick={close}
              className="block rounded-lg px-3 py-3 text-[15px] font-medium text-brand-forest transition-colors hover:bg-brand-forest/6"
            >
              {user ? `Hi, ${user.name.split(" ")[0]}` : "Sign in"}
            </Link>
          </div>

          <Link
            to="/shop"
            onClick={close}
            className="mt-6 flex items-center justify-center gap-2 rounded-md bg-brand-forest px-5 py-3.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-brand-paper"
          >
            Shop all snacks
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}