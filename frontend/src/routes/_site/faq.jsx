import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/_site/faq")({
  head: () => ({ meta: [{ title: "FAQ — OORA" }] }),
  component: FaqPage,
});

const groups = [
  {
    title: "Products",
    items: [
      {
        q: "Is everything really palm-oil free?",
        a: "Yes. Every product in the range is made without palm oil or palm derivatives. We use cold-pressed groundnut, sesame or sunflower oil, and two air-popped products use no added oil at all.",
      },
      {
        q: "How spicy are the snacks?",
        a: "The core range is mild by design. The chilli lime, peri peri and Mumbai masala packs sit at a mild-medium heat so they can be shared with friends who don't do spice.",
      },
      {
        q: "Are the millet snacks gluten free?",
        a: "The millet range is made with jowar, ragi and bajra and carries a gluten-free badge. Namkeen containing besan is naturally gluten free too, but is packed in a facility that handles gluten.",
      },
      {
        q: "Where are the nutrition values from?",
        a: "They are illustrative figures used in this demo storefront. Final products will carry lab-verified values printed on pack.",
      },
    ],
  },
  {
    title: "Orders & shipping",
    items: [
      {
        q: "How long does delivery take?",
        a: "Standard delivery is 3 to 5 working days, and express is 1 to 2 working days. Orders placed before 4pm ship the same day from Bengaluru.",
      },
      {
        q: "What does shipping cost?",
        a: "Flat ₹59, free on orders over ₹499. Express adds ₹99. Coupon FREESHIP removes shipping on any order size.",
      },
      {
        q: "Can I change my order after placing it?",
        a: "Until it's packed, yes. Write to us with your order number and we'll adjust it. This demo store doesn't process real orders.",
      },
      {
        q: "Do you offer cash on delivery?",
        a: "Yes, COD is available on most PIN codes in India, alongside UPI and cards in the live store.",
      },
    ],
  },
  {
    title: "This demo",
    items: [
      {
        q: "Is any of this real?",
        a: "This is a frontend demonstration of a D2C snack store. Products, prices, reviews and orders are mock data, and the checkout never takes a payment.",
      },
      {
        q: "Will my cart and wishlist be saved?",
        a: "Yes, both are stored in your browser, so they survive a refresh on this device. Clearing site data resets them.",
      },
    ],
  },
];

function FaqPage() {
  return (
    <div className="container-x py-14 lg:py-20">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.4fr] lg:gap-20">
        <div>
          <p className="eyebrow text-brand-chilli">Help centre</p>
          <h1 className="mt-4 font-heading text-[clamp(2rem,4.4vw,3rem)] font-extrabold leading-[1] tracking-[-0.035em] text-brand-forest">
            Questions, answered.
          </h1>
          <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-brand-forest/65">
            Still stuck? Write to us and a real person will reply.
          </p>
          <Link
            to="/contact"
            className="mt-6 inline-flex rounded-md border border-brand-forest/25 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-forest transition-colors hover:border-brand-forest hover:bg-brand-forest/5"
          >
            Contact us
          </Link>
        </div>

        <div className="space-y-10">
          {groups.map((group) => (
            <section key={group.title}>
              <h2 className="eyebrow text-brand-forest/40">{group.title}</h2>
              <Accordion type="single" collapsible className="mt-3">
                {group.items.map((item) => (
                  <AccordionItem key={item.q} value={item.q}>
                    <AccordionTrigger className="text-left text-[14px] font-semibold text-brand-forest">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-[13.5px] leading-relaxed text-brand-forest/70">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}