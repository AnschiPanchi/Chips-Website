import { allProducts, products, bundles } from "@/data/products";

// Mock-backed service layer. Swap these bodies for REST calls (or server
// functions) when the Express + MongoDB API lands — signatures stay the same.
const sorters = {
  featured: () => 0,
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  newest: (a, b) => (b.badges?.includes("new") ? 1 : 0) - (a.badges?.includes("new") ? 1 : 0),
  popular: (a, b) => b.reviewCount - a.reviewCount,
  rating: (a, b) => b.rating - a.rating,
};

export const productService = {
  list({ category, q = "", sort = "featured", max = null, inStockOnly = false } = {}) {
    let list = [...allProducts];
    if (category) list = list.filter((p) => p.category === category);
    if (q.trim()) {
      const term = q.trim().toLowerCase();
      list = list.filter((p) =>
        [p.name, p.flavour, p.tagline, p.category].join(" ").toLowerCase().includes(term)
      );
    }
    if (max) list = list.filter((p) => p.price <= max);
    if (inStockOnly) list = list.filter((p) => p.variants?.[0]?.stock > 0);
    return list.sort(sorters[sort] || sorters.featured);
  },
  bySlug(slug) {
    return allProducts.find((p) => p.slug === slug) || null;
  },
  byId(id) {
    return allProducts.find((p) => p.id === id) || null;
  },
  bestsellers(limit = 4) {
    return products
      .filter((p) => p.badges?.includes("bestseller"))
      .slice(0, limit);
  },
  related(slug, limit = 4) {
    const product = productService.bySlug(slug);
    if (!product) return [];
    return allProducts
      .filter((p) => p.slug !== slug && p.category === product.category)
      .concat(allProducts.filter((p) => p.slug !== slug && p.category !== product.category))
      .slice(0, limit);
  },
  bundles() {
    return bundles;
  },
  inStock(product) {
    return (product?.variants?.[0]?.stock ?? 0) > 0;
  },
};

export default productService;