import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import ProductGrid from "@/components/product/ProductGrid";
import { productService } from "@/services/productService";
import { useWishlistStore } from "@/stores/wishlist";
import { useMounted } from "@/hooks/useMounted";

export const Route = createFileRoute("/_site/wishlist")({
  head: () => ({ meta: [{ title: "Wishlist — OORA" }] }),
  component: WishlistPage,
});

function WishlistPage() {
  const ids = useWishlistStore((s) => s.ids);
  const mounted = useMounted();
  const products = mounted ? ids.map((id) => productService.byId(id)).filter(Boolean) : [];

  return (
    <div className="container-x py-10 lg:py-16">
      <header>
        <p className="eyebrow text-brand-chilli">Saved for later</p>
        <h1 className="mt-3 font-heading text-[clamp(2rem,4.4vw,3rem)] font-extrabold leading-[1.02] tracking-[-0.03em] text-brand-forest">
          Your wishlist
        </h1>
        <p className="mt-2 text-[14px] text-brand-forest/60">
          {products.length > 0
            ? `${products.length} ${products.length === 1 ? "snack" : "snacks"} saved.`
            : "Tap the heart on any product to keep it here."}
        </p>
      </header>

      {products.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-brand-forest/20 px-6 py-20 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-cream">
            <Heart className="h-7 w-7 text-brand-forest/40" strokeWidth={1.5} />
          </div>
          <p className="mt-5 font-heading text-xl font-extrabold text-brand-forest">
            Nothing saved yet
          </p>
          <p className="mx-auto mt-2 max-w-sm text-[13.5px] text-brand-forest/60">
            Save the packs you want to try next and they'll wait here, even after you close the tab.
          </p>
          <Link
            to="/shop"
            className="mt-6 inline-flex rounded-md bg-brand-forest px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-paper"
          >
            Browse snacks
          </Link>
        </div>
      ) : (
        <div className="mt-10">
          <ProductGrid products={products} />
        </div>
      )}
    </div>
  );
}