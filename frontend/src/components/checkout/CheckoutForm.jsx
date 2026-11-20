import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Loader2, Lock } from "lucide-react";
import { useCartStore } from "@/stores/cart";
import { useAuthStore } from "@/stores/auth";
import { useAdminStore } from "@/stores/admin";
import { cartTotals } from "@/lib/totals";
import { orderNo } from "@/lib/format";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  phone: z
    .string()
    .min(10, "Enter a 10-digit phone number")
    .regex(/^[0-9+\s-]{10,15}$/, "Enter a valid phone number"),
  name: z.string().min(2, "Enter the recipient's name"),
  line1: z.string().min(5, "Enter the street address"),
  line2: z.string().optional(),
  city: z.string().min(2, "Enter a city"),
  state: z.string().min(2, "Enter a state"),
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit PIN code"),
  delivery: z.enum(["standard", "express"]),
  payment: z.enum(["cod", "upi", "card"]),
});

const field =
  "w-full rounded-md border border-brand-forest/20 bg-brand-paper px-3.5 py-3 text-[14px] text-brand-forest outline-none transition-colors placeholder:text-brand-forest/30 focus:border-brand-forest";
const label = "block text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-forest/50";

export default function CheckoutForm() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const coupon = useCartStore((s) => s.coupon);
  const clear = useCartStore((s) => s.clear);
  const user = useAuthStore((s) => s.user);
  const addOrder = useAdminStore((s) => s.addOrder);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: user?.email || "",
      phone: user?.phone || "",
      name: user?.name || "",
      line1: user?.addresses?.[0]?.line1 || "",
      line2: user?.addresses?.[0]?.line2 || "",
      city: user?.addresses?.[0]?.city || "",
      state: user?.addresses?.[0]?.state || "",
      pincode: user?.addresses?.[0]?.pincode || "",
      delivery: "standard",
      payment: "cod",
    },
  });

  const delivery = watch("delivery");
  const payment = watch("payment");
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const { discount, shipping, total } = cartTotals({
    subtotal,
    coupon,
    express: delivery === "express",
  });

  const onSubmit = (values) => {
    if (items.length === 0) {
      toast.error("Your bag is empty.");
      return;
    }
    setSubmitting(true);
    const id = orderNo(10700 + Math.floor(Math.random() * 200));
    const order = {
      id,
      customer: values.name,
      email: values.email,
      phone: values.phone,
      items: items.map((i) => ({
        productId: i.productId,
        name: i.name,
        weight: i.weight,
        qty: i.qty,
        price: i.price,
      })),
      subtotal,
      shipping,
      discount,
      total,
      status: "placed",
      payment:
        values.payment === "cod" ? "COD (demo)" : values.payment === "upi" ? "UPI (demo)" : "Card (demo)",
      placedAt: new Date().toISOString(),
      address: {
        name: values.name,
        phone: values.phone,
        line1: values.line1,
        line2: values.line2 || "",
        city: values.city,
        state: values.state,
        pincode: values.pincode,
      },
      delivery: values.delivery,
    };
    setTimeout(() => {
      addOrder(order);
      clear();
      setSubmitting(false);
      toast.success("Order placed — this is a demo checkout.");
      navigate({ to: "/order-confirmation/$orderNumber", params: { orderNumber: id } });
    }, 700);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
      <section>
        <h2 className="font-heading text-base font-extrabold uppercase tracking-[0.14em] text-brand-forest">
          1 · Contact
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className={label}>
              Email
            </label>
            <input id="email" type="email" className={`mt-2 ${field}`} {...register("email")} />
            {errors.email && <p className="mt-1.5 text-[12px] text-brand-chilli">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="phone" className={label}>
              Phone
            </label>
            <input id="phone" type="tel" className={`mt-2 ${field}`} {...register("phone")} />
            {errors.phone && <p className="mt-1.5 text-[12px] text-brand-chilli">{errors.phone.message}</p>}
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-heading text-base font-extrabold uppercase tracking-[0.14em] text-brand-forest">
          2 · Delivery address
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="name" className={label}>
              Full name
            </label>
            <input id="name" className={`mt-2 ${field}`} {...register("name")} />
            {errors.name && <p className="mt-1.5 text-[12px] text-brand-chilli">{errors.name.message}</p>}
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="line1" className={label}>
              Address
            </label>
            <input id="line1" className={`mt-2 ${field}`} {...register("line1")} />
            {errors.line1 && <p className="mt-1.5 text-[12px] text-brand-chilli">{errors.line1.message}</p>}
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="line2" className={label}>
              Landmark (optional)
            </label>
            <input id="line2" className={`mt-2 ${field}`} {...register("line2")} />
          </div>
          <div>
            <label htmlFor="city" className={label}>
              City
            </label>
            <input id="city" className={`mt-2 ${field}`} {...register("city")} />
            {errors.city && <p className="mt-1.5 text-[12px] text-brand-chilli">{errors.city.message}</p>}
          </div>
          <div>
            <label htmlFor="state" className={label}>
              State
            </label>
            <input id="state" className={`mt-2 ${field}`} {...register("state")} />
            {errors.state && <p className="mt-1.5 text-[12px] text-brand-chilli">{errors.state.message}</p>}
          </div>
          <div>
            <label htmlFor="pincode" className={label}>
              PIN code
            </label>
            <input id="pincode" inputMode="numeric" className={`mt-2 ${field}`} {...register("pincode")} />
            {errors.pincode && (
              <p className="mt-1.5 text-[12px] text-brand-chilli">{errors.pincode.message}</p>
            )}
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-heading text-base font-extrabold uppercase tracking-[0.14em] text-brand-forest">
          3 · Delivery method
        </h2>
        <div className="mt-4 space-y-2">
          {[
            { id: "standard", title: "Standard", copy: "3–5 working days", price: "Free over ₹499" },
            { id: "express", title: "Express", copy: "1–2 working days", price: "+ ₹99" },
          ].map((option) => (
            <label
              key={option.id}
              className={`flex cursor-pointer items-center justify-between gap-4 rounded-lg border px-4 py-3.5 transition-colors ${
                delivery === option.id
                  ? "border-brand-forest bg-brand-forest/5"
                  : "border-brand-forest/15 hover:border-brand-forest/30"
              }`}
            >
              <span className="flex items-center gap-3">
                <input
                  type="radio"
                  value={option.id}
                  {...register("delivery")}
                  className="h-4 w-4 accent-brand-forest"
                />
                <span>
                  <span className="block text-[13.5px] font-semibold text-brand-forest">
                    {option.title}
                  </span>
                  <span className="block text-[11.5px] text-brand-forest/55">{option.copy}</span>
                </span>
              </span>
              <span className="text-[12px] font-medium text-brand-forest/70">{option.price}</span>
            </label>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-heading text-base font-extrabold uppercase tracking-[0.14em] text-brand-forest">
          4 · Payment
        </h2>
        <div className="mt-4 space-y-2">
          {[
            { id: "cod", title: "Cash on delivery", copy: "Pay the courier when it arrives" },
            { id: "upi", title: "UPI", copy: "Demo only — no payment is taken" },
            { id: "card", title: "Card", copy: "Demo only — no payment is taken" },
          ].map((option) => (
            <label
              key={option.id}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3.5 transition-colors ${
                payment === option.id
                  ? "border-brand-forest bg-brand-forest/5"
                  : "border-brand-forest/15 hover:border-brand-forest/30"
              }`}
            >
              <input
                type="radio"
                value={option.id}
                {...register("payment")}
                className="h-4 w-4 accent-brand-forest"
              />
              <span>
                <span className="block text-[13.5px] font-semibold text-brand-forest">
                  {option.title}
                </span>
                <span className="block text-[11.5px] text-brand-forest/55">{option.copy}</span>
              </span>
            </label>
          ))}
        </div>
      </section>

      <div className="rounded-lg border border-brand-chilli/30 bg-brand-chilli/8 px-4 py-3">
        <p className="flex items-center gap-2 text-[12px] font-medium text-brand-forest">
          <Lock className="h-3.5 w-3.5" /> Demo checkout — no payment is processed.
        </p>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-forest px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-paper transition-colors hover:bg-brand-ink disabled:opacity-60"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Placing demo order
          </>
        ) : (
          <>Place demo order · ₹{total.toLocaleString("en-IN")}</>
        )}
      </button>
    </form>
  );
}