import ProductCard from "./ProductCard";

export default function ProductGrid({ products = [], columns = 4 }) {
  const cols =
    columns === 3
      ? "grid-cols-2 md:grid-cols-3"
      : "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
  return (
    <div className={`grid gap-x-5 gap-y-10 sm:gap-x-6 ${cols}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}