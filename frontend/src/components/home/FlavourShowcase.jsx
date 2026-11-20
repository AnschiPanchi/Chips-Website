import { Link } from "@tanstack/react-router";
import { flavours } from "@/data/products";
import SectionHeading from "./SectionHeading";

const toneClasses = {
  chilli: "group-hover:bg-brand-chilli group-hover:text-brand-ink",
  cream: "group-hover:bg-brand-cream group-hover:text-brand-forest",
  olive: "group-hover:bg-brand-olive group-hover:text-brand-paper",
  forest: "group-hover:bg-brand-forest group-hover:text-brand-cream",
  paper: "group-hover:bg-brand-paper group-hover:text-brand-forest",
};

export default function FlavourShowcase() {
  return (
    <section className="container-x py-16 lg:py-24">
      <SectionHeading
        eyebrow="The flavour index"
        title="Familiar masalas, mild on heat"
        copy="Built for everyday snacking: the spices you know, dialled to a heat level everyone at the table can handle."
        action={{ label: "Shop all", to: "/shop" }}
      />

      <div className="mt-10 border-t border-brand-forest/12 lg:mt-14">
        {flavours.map((flavour) => (
          <Link
            key={flavour.name}
            to="/shop"
            search={{ q: flavour.name.split(" ")[0] }}
            className={`group flex items-center justify-between gap-6 border-b border-brand-forest/12 px-2 py-5 transition-colors sm:px-4 ${
              toneClasses[flavour.tone] || toneClasses.olive
            }`}
          >
            <div className="flex min-w-0 flex-1 items-baseline gap-4 sm:gap-8">
              <span className="w-8 shrink-0 font-heading text-[11px] font-bold text-brand-forest/35">
                0{flavours.indexOf(flavour) + 1}
              </span>
              <div className="min-w-0">
                <p className="truncate font-heading text-[clamp(1.15rem,2.4vw,1.75rem)] font-bold tracking-[-0.02em]">
                  {flavour.name}
                </p>
                <p className="mt-0.5 truncate text-[12px] opacity-60">{flavour.note}</p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-6">
              <div className="hidden items-center gap-1.5 sm:flex" aria-label={`Heat level ${flavour.heat} of 3`}>
                {[1, 2, 3].map((level) => (
                  <span
                    key={level}
                    className={`h-1.5 w-5 rounded-full ${
                      level <= flavour.heat ? "bg-current opacity-80" : "bg-current opacity-20"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] opacity-60">
                {flavour.heat === 1 ? "Mild" : "Mild-medium"}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}