import { useState } from "react";
import { Image } from "@/components/ui/image";

export default function ProductGallery({ images = [], name }) {
  const [active, setActive] = useState(0);
  const list = images.length ? images : [null];

  return (
    <div className="flex flex-col gap-3">
      <div className="group relative overflow-hidden rounded-2xl bg-brand-cream">
        {list[active] ? (
          <Image
            src={list[active]}
            alt={`${name} — view ${active + 1}`}
            className="aspect-[4/5] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
          />
        ) : (
          <div className="grid aspect-[4/5] w-full place-items-center bg-gradient-to-br from-brand-olive to-brand-forest">
            <span className="font-heading text-4xl font-extrabold tracking-[0.1em] text-brand-paper/90">
              {name}
            </span>
          </div>
        )}
        <span className="absolute bottom-3 left-3 rounded-full bg-brand-paper/90 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-brand-forest">
          Hover to zoom
        </span>
      </div>

      {list.length > 1 && (
        <div className="flex gap-3">
          {list.map((src, index) => (
            <button
              key={src || index}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show image ${index + 1}`}
              aria-pressed={active === index}
              className={`overflow-hidden rounded-lg border-2 transition-colors ${
                active === index ? "border-brand-forest" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={src}
                alt=""
                className="h-20 w-20 bg-brand-cream object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}