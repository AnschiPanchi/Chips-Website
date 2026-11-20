import { createFileRoute } from "@tanstack/react-router";
import ProductBrowser from "@/components/product/ProductBrowser";
import { productService } from "@/services/productService";

export const Route = createFileRoute("/_site/shop")({
  validateSearch: (search) => ({ q: search.q || undefined }),
  head: () => ({
    meta: [
      { title: "Shop all snacks — OORA" },
      {
        name: "description",
        content: "The full OORA range: baked chips, air-popped crisps, millet snacks and namkeen.",
      },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const { q } = Route.useSearch();
  const products = productService.list();

  return (
    <div className="container-x py-10 lg:py-16">
      <header className="max-w-2xl">
        <p className="eyebrow text-brand-chilli">The archive</p>
        <h1 className="mt-3 font-heading text-[clamp(2rem,4.4vw,3.2rem)] font-extrabold leading-[1.02] tracking-[-0.03em] text-brand-forest">
          Every snack we make
        </h1>
        <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-brand-forest/65">
          Baked, air-popped and roasted in cold-pressed oils. Filter by range, price or what's in
          stock — all {products.length} products are palm-oil free.
        </p>
      </header>

      <div className="mt-10 lg:mt-14">
        <ProductBrowser key={q || "all"} products={products} initialQuery={q || ""} showCategories />
      </div>
    </div>
  );
}