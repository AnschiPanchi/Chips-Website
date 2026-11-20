import { Truck, Leaf, MapPin } from "lucide-react";
import { brand } from "@/lib/brand";
import { inr } from "@/lib/format";

export default function AnnouncementBar() {
  return (
    <div className="bg-brand-forest text-brand-cream">
      <div className="container-x flex h-9 items-center justify-between gap-4 text-[11px] font-medium tracking-wide">
        <p className="flex items-center gap-1.5">
          <Truck className="h-3.5 w-3.5" strokeWidth={1.75} />
          Free shipping over {inr(brand.freeShippingThreshold)}
        </p>
        <p className="hidden items-center gap-1.5 sm:flex">
          <Leaf className="h-3.5 w-3.5" strokeWidth={1.75} />
          Zero palm oil. Always.
        </p>
        <p className="hidden items-center gap-1.5 md:flex">
          <MapPin className="h-3.5 w-3.5" strokeWidth={1.75} />
          Made in {brand.city.split(",")[0]}
        </p>
      </div>
    </div>
  );
}