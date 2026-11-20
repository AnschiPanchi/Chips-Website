import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { Image } from "@/components/ui/image";
import { inr } from "@/lib/format";
import { productService } from "@/services/productService";

export default function SearchOverlay({ open, onOpenChange }) {
  const [term, setTerm] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const results = useMemo(() => {
    if (!term.trim()) return [];
    return productService.list({ q: term }).slice(0, 5);
  }, [term]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", onKey);
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    return () => {
      document.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  const goToShop = () => {
    onOpenChange(false);
    navigate({ to: "/shop", search: { q: term } });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-brand-forest/35 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Search snacks"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="mx-auto mt-20 w-[92%] max-w-2xl overflow-hidden rounded-2xl bg-brand-paper shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-brand-forest/10 px-5 py-4">
          <Search className="h-5 w-5 shrink-0 text-brand-forest/50" strokeWidth={1.75} />
          <input
            ref={inputRef}
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && goToShop()}
            placeholder="Search chips, millets, namkeen…"
            className="w-full bg-transparent text-[15px] text-brand-forest outline-none placeholder:text-brand-forest/40"
          />
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close search"
            className="grid h-8 w-8 place-items-center rounded-full text-brand-forest/50 hover:bg-brand-forest/8"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {!term.trim() && (
            <div className="px-3 py-6">
              <p className="eyebrow text-brand-forest/40">Try</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Chilli lime", "Millet", "Namkeen", "Air-popped", "Peri peri"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setTerm(s)}
                    className="rounded-full border border-brand-forest/15 px-3 py-1.5 text-xs font-medium text-brand-forest transition-colors hover:border-brand-chilli hover:text-brand-chilli"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {term.trim() && results.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-brand-forest/60">
              No snacks match “{term}”. Try “millet” or “namkeen”.
            </p>
          )}

          {results.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => {
                onOpenChange(false);
                navigate({ to: "/products/$slug", params: { slug: product.slug } });
              }}
              className="flex w-full items-center gap-4 rounded-xl px-3 py-3 text-left transition-colors hover:bg-brand-forest/5"
            >
              <Image
                src={product.image}
                alt={product.name}
                className="h-14 w-14 shrink-0 rounded-lg bg-brand-cream object-cover"
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-brand-forest">
                  {product.name}
                </span>
                <span className="block text-xs text-brand-forest/55">
                  {product.flavour} · {product.weight}
                </span>
              </span>
              <span className="font-heading text-sm font-bold text-brand-forest">
                {inr(product.price)}
              </span>
            </button>
          ))}

          {term.trim() && results.length > 0 && (
            <button
              type="button"
              onClick={goToShop}
              className="mt-1 w-full rounded-xl px-3 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-brand-chilli hover:bg-brand-chilli/8"
            >
              See all results for “{term}”
            </button>
          )}
        </div>
      </div>
    </div>
  );
}