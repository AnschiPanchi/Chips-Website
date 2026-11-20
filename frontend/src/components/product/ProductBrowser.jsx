import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import ProductGrid from "./ProductGrid";
import { categories } from "@/data/categories";
import { inr } from "@/lib/format";

const sorts = [
  { value: "featured", label: "Featured" },
  { value: "popular", label: "Most popular" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
];

const bands = [
  { id: "all", label: "All prices", min: 0, max: Infinity },
  { id: "under150", label: "Under ₹150", min: 0, max: 150 },
  { id: "mid", label: "₹150 – ₹250", min: 150, max: 250 },
  { id: "over250", label: "Over ₹250", min: 250, max: Infinity },
];

const sorters = {
  featured: () => 0,
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  newest: (a, b) => (b.badges?.includes("new") ? 1 : 0) - (a.badges?.includes("new") ? 1 : 0),
  popular: (a, b) => b.reviewCount - a.reviewCount,
  rating: (a, b) => b.rating - a.rating,
};

export default function ProductBrowser({ products, initialQuery = "", showCategories = false }) {
  const [q, setQ] = useState(initialQuery);
  const [selected, setSelected] = useState([]);
  const [band, setBand] = useState("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState("featured");
  const [drawer, setDrawer] = useState(false);

  const activeBand = bands.find((b) => b.id === band) || bands[0];

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return products
      .filter((p) => {
        if (term && !`${p.name} ${p.flavour} ${p.tagline}`.toLowerCase().includes(term)) return false;
        if (selected.length && !selected.includes(p.category)) return false;
        if (p.price < activeBand.min || p.price > activeBand.max) return false;
        if (inStockOnly && !(p.variants?.[0]?.stock > 0)) return false;
        return true;
      })
      .sort(sorters[sort] || sorters.featured);
  }, [products, q, selected, activeBand, inStockOnly, sort]);

  const toggleCategory = (slug) =>
    setSelected((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));

  const clearAll = () => {
    setQ("");
    setSelected([]);
    setBand("all");
    setInStockOnly(false);
  };

  const activeCount = selected.length + (band !== "all" ? 1 : 0) + (inStockOnly ? 1 : 0);

  const filterPanel = (
    <div className="space-y-7">
      <div>
        <label htmlFor="browser-search" className="eyebrow text-brand-forest/45">
          Search
        </label>
        <div className="mt-2 flex items-center gap-2 rounded-md border border-brand-forest/15 px-3 py-2.5">
          <Search className="h-4 w-4 text-brand-forest/40" />
          <input
            id="browser-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Chips, millet, namkeen…"
            className="w-full bg-transparent text-[13px] text-brand-forest outline-none placeholder:text-brand-forest/35"
          />
          {q && (
            <button type="button" onClick={() => setQ("")} aria-label="Clear search">
              <X className="h-3.5 w-3.5 text-brand-forest/40" />
            </button>
          )}
        </div>
      </div>

      {showCategories && (
        <div>
          <p className="eyebrow text-brand-forest/45">Category</p>
          <div className="mt-3 space-y-2">
            {categories.map((category) => (
              <label
                key={category.slug}
                className="flex cursor-pointer items-center gap-2.5 text-[13px] text-brand-forest/80"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(category.slug)}
                  onChange={() => toggleCategory(category.slug)}
                  className="h-4 w-4 rounded border-brand-forest/30 accent-brand-forest"
                />
                {category.name}
              </label>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="eyebrow text-brand-forest/45">Price</p>
        <div className="mt-3 space-y-2">
          {bands.map((option) => (
            <label
              key={option.id}
              className="flex cursor-pointer items-center gap-2.5 text-[13px] text-brand-forest/80"
            >
              <input
                type="radio"
                name="price-band"
                checked={band === option.id}
                onChange={() => setBand(option.id)}
                className="h-4 w-4 accent-brand-forest"
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="eyebrow text-brand-forest/45">Availability</p>
        <label className="mt-3 flex cursor-pointer items-center gap-2.5 text-[13px] text-brand-forest/80">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="h-4 w-4 rounded border-brand-forest/30 accent-brand-forest"
          />
          In stock only
        </label>
      </div>

      {activeCount > 0 && (
        <button
          type="button"
          onClick={clearAll}
          className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-chilli"
        >
          Clear filters
        </button>
      )}
    </div>
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[240px_1fr] lg:gap-14">
      <aside className="hidden lg:block">
        <div className="sticky top-24">{filterPanel}</div>
      </aside>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-forest/12 pb-4">
          <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-brand-forest/50">
            {filtered.length} {filtered.length === 1 ? "product" : "products"}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDrawer(true)}
              className="inline-flex items-center gap-2 rounded-md border border-brand-forest/20 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-forest lg:hidden"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filters{activeCount > 0 ? ` (${activeCount})` : ""}
            </button>
            <label className="sr-only" htmlFor="sort-select">
              Sort products
            </label>
            <select
              id="sort-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-md border border-brand-forest/20 bg-transparent px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-forest outline-none"
            >
              {sorts.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-8">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-brand-forest/20 px-6 py-16 text-center">
              <p className="font-heading text-lg font-bold text-brand-forest">Nothing matches yet</p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-brand-forest/60">
                Try a different flavour or clear the filters. The whole range is only {products.length}{" "}
                snacks deep.
              </p>
              <button
                type="button"
                onClick={clearAll}
                className="mt-5 rounded-md bg-brand-forest px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-paper"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <ProductGrid products={filtered} />
          )}
        </div>

        {filtered.length > 0 && (
          <p className="mt-10 text-center text-[11px] uppercase tracking-[0.14em] text-brand-forest/35">
            Showing all {filtered.length} · from {inr(Math.min(...filtered.map((p) => p.price)))}
          </p>
        )}
      </div>

      <Sheet open={drawer} onOpenChange={setDrawer}>
        <SheetContent side="left" className="w-[88vw] max-w-sm overflow-y-auto bg-brand-paper px-6">
          <SheetHeader className="px-0 pb-2 text-left">
            <SheetTitle className="font-heading text-sm font-bold uppercase tracking-[0.18em] text-brand-forest">
              Filters
            </SheetTitle>
          </SheetHeader>
          {filterPanel}
          <button
            type="button"
            onClick={() => setDrawer(false)}
            className="mt-8 w-full rounded-md bg-brand-forest px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-paper"
          >
            Show {filtered.length} products
          </button>
        </SheetContent>
      </Sheet>
    </div>
  );
}