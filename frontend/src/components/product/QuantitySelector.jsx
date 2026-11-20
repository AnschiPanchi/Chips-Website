import { Minus, Plus } from "lucide-react";

export default function QuantitySelector({ value, onChange, min = 1, max = 10, compact = false }) {
  const size = compact ? "h-8 w-8" : "h-10 w-10";
  return (
    <div className="inline-flex items-center rounded-md border border-brand-forest/20 bg-brand-paper">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className={`grid ${size} place-items-center text-brand-forest transition-colors hover:bg-brand-forest/6 disabled:opacity-30`}
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span
        className={`min-w-8 text-center font-heading text-sm font-bold text-brand-forest ${
          compact ? "" : "min-w-10"
        }`}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
        className={`grid ${size} place-items-center text-brand-forest transition-colors hover:bg-brand-forest/6 disabled:opacity-30`}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}