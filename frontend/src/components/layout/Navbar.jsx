import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingBag, User } from "lucide-react";
import Logo from "./Logo";
import MobileNav from "./MobileNav";
import SearchOverlay from "./SearchOverlay";
import { navLinks } from "@/data/navigation";
import { useCartStore } from "@/stores/cart";
import { useWishlistStore } from "@/stores/wishlist";
import { useMounted } from "@/hooks/useMounted";

const iconBtn =
  "relative grid h-10 w-10 place-items-center rounded-full text-brand-forest transition-colors hover:bg-brand-forest/8";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { pathname } = useLocation();
  const mounted = useMounted();
  const items = useCartStore((s) => s.items);
  const openCart = useCartStore((s) => s.setOpen);
  const wishlist = useWishlistStore((s) => s.ids);
  const cartCount = mounted ? items.reduce((sum, i) => sum + i.qty, 0) : 0;
  const wishCount = mounted ? wishlist.length : 0;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 border-b bg-brand-paper/90 backdrop-blur-md transition-colors ${
          scrolled ? "border-brand-forest/12" : "border-transparent"
        }`}
      >
        <div className="container-x flex h-16 items-center justify-between gap-6">
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className={iconBtn}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" strokeWidth={1.75} />
            </button>
          </div>

          <Logo />

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
            {navLinks.map((link) => {
              const active = link.params
                ? pathname.includes(link.params.slug)
                : pathname === link.to;
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  params={link.params}
                  className={`text-[13px] font-medium tracking-wide transition-colors ${
                    active ? "text-brand-chilli" : "text-brand-forest/80 hover:text-brand-forest"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className={iconBtn}
              aria-label="Search snacks"
            >
              <Search className="h-[18px] w-[18px]" strokeWidth={1.75} />
            </button>
            <Link to="/wishlist" className={`${iconBtn} hidden sm:grid`} aria-label="Wishlist">
              <Heart className="h-[18px] w-[18px]" strokeWidth={1.75} />
              {wishCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand-olive px-1 text-[10px] font-bold text-brand-paper">
                  {wishCount}
                </span>
              )}
            </Link>
            <Link to="/account" className={`${iconBtn} hidden sm:grid`} aria-label="Account">
              <User className="h-[18px] w-[18px]" strokeWidth={1.75} />
            </Link>
            <button
              type="button"
              onClick={() => openCart(true)}
              className={iconBtn}
              aria-label={`Cart, ${cartCount} items`}
            >
              <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.75} />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand-chilli px-1 text-[10px] font-bold text-brand-paper">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <MobileNav open={menuOpen} onOpenChange={setMenuOpen} />
      <SearchOverlay open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}