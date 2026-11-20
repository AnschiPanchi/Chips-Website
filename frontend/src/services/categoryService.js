import { categories, findCategory } from "@/data/categories";
import { products } from "@/data/products";

export const categoryService = {
  list() {
    return categories.map((c) => ({
      ...c,
      count: products.filter((p) => p.category === c.slug).length,
    }));
  },
  get(slug) {
    const category = findCategory(slug);
    if (!category) return null;
    return { ...category, count: products.filter((p) => p.category === slug).length };
  },
};

export default categoryService;