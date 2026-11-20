import { Quote } from "lucide-react";
import Stars from "@/components/product/Stars";
import SectionHeading from "./SectionHeading";
import { testimonials } from "@/data/testimonials";

export default function Testimonials() {
  return (
    <section className="bg-brand-cream">
      <div className="container-x py-16 lg:py-24">
        <SectionHeading
          eyebrow="Reviews"
          title="Word of mouth, mostly from the school bus"
          copy="Unedited notes from people who bought a pack, finished it and came back for more."
        />

        <div className="mt-10 grid gap-4 md:grid-cols-3 lg:mt-14">
          {testimonials.slice(0, 3).map((item) => (
            <figure
              key={item.id}
              className="flex flex-col justify-between rounded-2xl bg-brand-paper p-6 lg:p-7"
            >
              <div>
                <Quote className="h-6 w-6 text-brand-chilli/40" strokeWidth={1.5} />
                <blockquote className="mt-4 text-[14.5px] leading-relaxed text-brand-forest/85">
                  “{item.quote}”
                </blockquote>
              </div>
              <figcaption className="mt-6 border-t border-brand-forest/10 pt-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-heading text-[13px] font-bold text-brand-forest">{item.name}</p>
                    <p className="text-[11px] text-brand-forest/50">{item.detail}</p>
                  </div>
                  <Stars value={item.rating} />
                </div>
                <p className="mt-3 text-[10.5px] uppercase tracking-[0.12em] text-brand-forest/40">
                  Bought {item.product}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}