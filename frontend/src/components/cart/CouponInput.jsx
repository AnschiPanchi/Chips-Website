import { useState } from "react";
import { Tag, X } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cart";

export default function CouponInput() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const coupon = useCartStore((s) => s.coupon);
  const applyCoupon = useCartStore((s) => s.applyCoupon);
  const removeCoupon = useCartStore((s) => s.removeCoupon);

  const submit = (event) => {
    event.preventDefault();
    if (!code.trim()) {
      setError("Enter a coupon code.");
      return;
    }
    const result = applyCoupon(code);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setError("");
    setCode("");
    toast.success(result.message);
  };

  if (coupon) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-lg border border-brand-olive/40 bg-brand-olive/10 px-4 py-3">
        <p className="flex items-center gap-2 text-[12.5px] font-semibold text-brand-forest">
          <Tag className="h-4 w-4 text-brand-olive" />
          {coupon.code}
          <span className="font-normal text-brand-forest/60">· {coupon.description}</span>
        </p>
        <button
          type="button"
          onClick={removeCoupon}
          aria-label="Remove coupon"
          className="text-brand-forest/40 transition-colors hover:text-brand-chilli"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className="flex gap-2">
        <input
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError("");
          }}
          placeholder="Coupon code"
          aria-label="Coupon code"
          className="w-full rounded-md border border-brand-forest/20 bg-transparent px-3.5 py-2.5 text-[13px] uppercase tracking-wide text-brand-forest outline-none placeholder:normal-case placeholder:tracking-normal placeholder:text-brand-forest/35 focus:border-brand-forest"
        />
        <button
          type="submit"
          className="shrink-0 rounded-md border border-brand-forest/25 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-forest transition-colors hover:border-brand-forest hover:bg-brand-forest hover:text-brand-paper"
        >
          Apply
        </button>
      </div>
      {error && <p className="mt-2 text-[12px] text-brand-chilli">{error}</p>}
      <p className="mt-2 text-[11px] text-brand-forest/40">Try WELCOME10 or FREESHIP.</p>
    </form>
  );
}