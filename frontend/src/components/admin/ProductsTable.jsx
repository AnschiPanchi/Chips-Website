import { Link } from "@tanstack/react-router";
import { Pencil, Trash2 } from "lucide-react";
import StatusBadge from "@/components/account/StatusBadge";
import { Image } from "@/components/ui/image";
import { inr } from "@/lib/format";

export default function ProductsTable({ products, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px] border-collapse text-left">
        <thead>
          <tr className="border-b border-brand-forest/12 text-[10px] uppercase tracking-[0.12em] text-brand-forest/40">
            <th className="py-2.5 pr-3 font-semibold">Product</th>
            <th className="py-2.5 pr-3 font-semibold">Category</th>
            <th className="py-2.5 pr-3 font-semibold">Price</th>
            <th className="py-2.5 pr-3 font-semibold">Stock</th>
            <th className="py-2.5 pr-3 font-semibold">Status</th>
            <th className="py-2.5 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-brand-forest/8 text-[12.5px]">
              <td className="py-3 pr-3">
                <div className="flex items-center gap-3">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt=""
                      className="h-10 w-10 rounded-md bg-brand-cream object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-md bg-brand-cream" />
                  )}
                  <div>
                    <p className="font-semibold text-brand-forest">{product.name}</p>
                    <p className="text-[11px] text-brand-forest/40">{product.weight}</p>
                  </div>
                </div>
              </td>
              <td className="py-3 pr-3 capitalize text-brand-forest/65">
                {String(product.category).replace(/-/g, " ")}
              </td>
              <td className="py-3 pr-3 font-medium text-brand-forest">{inr(product.price)}</td>
              <td className="py-3 pr-3 text-brand-forest/65">{product.stock}</td>
              <td className="py-3 pr-3">
                <StatusBadge status={product.status} />
              </td>
              <td className="py-3">
                <div className="flex items-center justify-end gap-3">
                  <Link
                    to="/admin/products/$id/edit"
                    params={{ id: product.id }}
                    aria-label={`Edit ${product.name}`}
                    className="text-brand-forest/40 hover:text-brand-forest"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => onDelete(product)}
                    aria-label={`Delete ${product.name}`}
                    className="text-brand-forest/40 hover:text-brand-chilli"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan={6} className="py-8 text-center text-[12.5px] text-brand-forest/45">
                No products match that search.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}