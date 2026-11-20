import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Image } from "@/components/ui/image";
import { useAdminStore } from "@/stores/admin";
import { slugify } from "@/lib/format";

const schema = z.object({
  name: z.string().min(3, "Product name is required"),
  category: z.string().min(1, "Pick a category"),
  price: z.coerce.number().min(1, "Price must be above zero"),
  mrp: z.coerce.number().min(0, "MRP can't be negative"),
  stock: z.coerce.number().min(0, "Stock can't be negative"),
  weight: z.string().min(1, "Add a pack weight"),
  image: z.string().url("Paste a valid image URL").or(z.literal("")),
  description: z.string().optional(),
});

const field =
  "w-full rounded-md border border-brand-forest/20 bg-brand-paper px-3.5 py-2.5 text-[13.5px] text-brand-forest outline-none focus:border-brand-forest";
const label = "block text-[10.5px] font-semibold uppercase tracking-[0.12em] text-brand-forest/50";

export default function ProductForm({ product }) {
  const navigate = useNavigate();
  const categories = useAdminStore((s) => s.categories);
  const addProduct = useAdminStore((s) => s.addProduct);
  const updateProduct = useAdminStore((s) => s.updateProduct);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: product?.name || "",
      category: product?.category || categories[0]?.slug || "baked-chips",
      price: product?.price || 149,
      mrp: product?.mrp || 179,
      stock: product?.stock ?? 0,
      weight: product?.weight || "80g",
      image: product?.image || "",
      description: product?.description || "",
    },
  });

  const imageUrl = watch("image");
  const nameValue = watch("name");

  const onSubmit = (values) => {
    const payload = {
      ...values,
      slug: slugify(values.name),
      status: Number(values.stock) > 0 ? "active" : "sold-out",
    };
    if (product) {
      updateProduct(product.id, payload);
    } else {
      addProduct(payload);
    }
    navigate({ to: "/admin/products" });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <div className="space-y-4 rounded-xl border border-brand-forest/12 bg-brand-paper p-5">
        <div>
          <label htmlFor="p-name" className={label}>
            Product name
          </label>
          <input id="p-name" className={`mt-1.5 ${field}`} {...register("name")} />
          {errors.name && <p className="mt-1 text-[11px] text-brand-chilli">{errors.name.message}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="p-category" className={label}>
              Category
            </label>
            <select id="p-category" className={`mt-1.5 ${field}`} {...register("category")}>
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-[11px] text-brand-chilli">{errors.category.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="p-weight" className={label}>
              Pack weight
            </label>
            <input id="p-weight" className={`mt-1.5 ${field}`} {...register("weight")} />
            {errors.weight && <p className="mt-1 text-[11px] text-brand-chilli">{errors.weight.message}</p>}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="p-price" className={label}>
              Price (₹)
            </label>
            <input id="p-price" type="number" className={`mt-1.5 ${field}`} {...register("price")} />
            {errors.price && <p className="mt-1 text-[11px] text-brand-chilli">{errors.price.message}</p>}
          </div>
          <div>
            <label htmlFor="p-mrp" className={label}>
              MRP (₹)
            </label>
            <input id="p-mrp" type="number" className={`mt-1.5 ${field}`} {...register("mrp")} />
            {errors.mrp && <p className="mt-1 text-[11px] text-brand-chilli">{errors.mrp.message}</p>}
          </div>
          <div>
            <label htmlFor="p-stock" className={label}>
              Stock
            </label>
            <input id="p-stock" type="number" className={`mt-1.5 ${field}`} {...register("stock")} />
            {errors.stock && <p className="mt-1 text-[11px] text-brand-chilli">{errors.stock.message}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="p-image" className={label}>
            Image URL
          </label>
          <input id="p-image" className={`mt-1.5 ${field}`} placeholder="https://…" {...register("image")} />
          {errors.image && <p className="mt-1 text-[11px] text-brand-chilli">{errors.image.message}</p>}
        </div>

        <div>
          <label htmlFor="p-desc" className={label}>
            Description
          </label>
          <textarea
            id="p-desc"
            rows={4}
            className={`mt-1.5 ${field} resize-none`}
            {...register("description")}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="rounded-md bg-brand-forest px-5 py-3 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-brand-paper hover:bg-brand-ink"
          >
            {product ? "Save changes" : "Create product"}
          </button>
          <button
            type="button"
            onClick={() => navigate({ to: "/admin/products" })}
            className="rounded-md border border-brand-forest/20 px-5 py-3 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-brand-forest"
          >
            Cancel
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-brand-forest/12 bg-brand-paper p-5">
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-brand-forest/45">
          Preview
        </p>
        <div className="mt-3 overflow-hidden rounded-lg bg-brand-cream">
          {imageUrl ? (
            <Image src={imageUrl} alt="" className="aspect-[4/5] w-full object-cover" />
          ) : (
            <div className="grid aspect-[4/5] w-full place-items-center bg-brand-cream text-[11px] uppercase tracking-[0.12em] text-brand-forest/35">
              No image
            </div>
          )}
        </div>
        <p className="mt-3 font-heading text-[14px] font-bold text-brand-forest">
          {nameValue || "Product name"}
        </p>
        <p className="mt-1 text-[11px] text-brand-forest/45">
          Stock updates status automatically. Images come from a URL in this demo.
        </p>
      </div>
    </form>
  );
}