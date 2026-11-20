import { Star } from "lucide-react";

export default function Stars({ value = 0, size = 12, showValue = false, count = null }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            style={{ width: size, height: size }}
            className={
              i <= Math.round(value)
                ? "fill-brand-chilli text-brand-chilli"
                : "fill-brand-forest/12 text-brand-forest/12"
            }
            strokeWidth={0}
          />
        ))}
      </span>
      {showValue && (
        <span className="text-[11px] font-medium text-brand-forest/60">
          {value.toFixed(1)}
          {count !== null && ` (${count})`}
        </span>
      )}
    </span>
  );
}