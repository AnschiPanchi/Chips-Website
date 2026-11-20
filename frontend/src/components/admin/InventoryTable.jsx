import { inr } from "@/lib/format";

export default function InventoryTable({ products, onStock, lowStock = 15 }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[620px] border-collapse text-left">
        <thead>
          <tr className="border-b border-brand-forest/12 text-[10px] uppercase tracking-[0.12em] text-brand-forest/40">
            <th className="py-2.5 pr-3 font-semibold">Product</th>
            <th className="py-2.5 pr-3 font-semibold">Price</th>
            <th className="py-2.5 pr-3 font-semibold">Units in stock</th>
            <th className="py-2.5 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const low = product.stock <= lowStock;
            return (
              <tr key={product.id} className="border-b border-brand-forest/8 text-[12.5px]">
                <td className="py-3 pr-3">
                  <p className="font-semibold text-brand-forest">{product.name}</p>
                  <p className="text-[11px] text-brand-forest/40">{product.weight}</p>
                </td>
                <td className="py-3 pr-3 text-brand-forest/65">{inr(product.price)}</td>
                <td className="py-3 pr-3">
                  <input
                    type="number"
                    min="0"
                    value={product.stock}
                    onChange={(e) => onStock(product.id, e.target.value)}
                    aria-label={`Stock for ${product.name}`}
                    className="w-20 rounded-md border border-brand-forest/20 bg-transparent px-2 py-1.5 text-[12px] text-brand-forest outline-none focus:border-brand-forest"
                  />
                </td>
                <td className="py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] ${
                      product.stock === 0
                        ? "bg-brand-ink/10 text-brand-ink/60"
                        : low
                        ? "bg-brand-chilli/12 text-brand-chilli"
                        : "bg-brand-olive/15 text-brand-olive"
                    }`}
                  >
                    {product.stock === 0 ? "Out of stock" : low ? "Low stock" : "Healthy"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}