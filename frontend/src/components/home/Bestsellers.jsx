import ProductGrid from "@/components/product/ProductGrid";
import SectionHeading from "./SectionHeading";
import { productService } from "@/services/productService";

export default function Bestsellers() {
  const products = productService.bestsellers(4);
  return (
    <section className="container-x py-16 lg:py-24">
      <SectionHeading
        eyebrow="Loved by the group chat"
        title="The packs that keep selling out"
        copy="Four snacks that went straight to the top of the reorder list."
        action={{ label: "View all snacks", to: "/shop" }}
      />
      <div className="mt-10 lg:mt-14">
        <ProductGrid products={products} />
      </div>
    </section>
  );
}