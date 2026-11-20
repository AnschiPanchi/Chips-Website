import { usps } from "@/data/products";

export default function UspStrip() {
  return (
    <section className="bg-brand-forest text-brand-cream">
      <div className="container-x grid grid-cols-2 gap-y-8 py-10 lg:grid-cols-4 lg:py-12">
        {usps.map((usp, i) => (
          <div
            key={usp.title}
            className={`flex flex-col gap-1.5 px-1 lg:px-8 ${
              i > 0 ? "lg:border-l lg:border-brand-cream/15" : ""
            }`}
          >
            <p className="font-heading text-[15px] font-bold tracking-tight">{usp.title}</p>
            <p className="text-[12.5px] leading-relaxed text-brand-cream/60">{usp.copy}</p>
          </div>
        ))}
      </div>
    </section>
  );
}