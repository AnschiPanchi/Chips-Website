import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { CreditCard, Loader2, Lock, Smartphone, Truck } from "lucide-react";
import { useCartStore } from "@/stores/cart";
import { useAuthStore } from "@/stores/auth";
import { useAdminStore } from "@/stores/admin";
import { cartTotals } from "@/lib/totals";
import { paymentsApi, couponsApi } from "@/api/apiClient";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  phone: z.string().min(10, "Enter a 10-digit phone number").regex(/^[0-9+\s-]{10,15}$/, "Enter a valid phone number"),
  name: z.string().min(2, "Enter the recipient's name"),
  line1: z.string().min(5, "Enter the street address"),
  line2: z.string().optional(),
  city: z.string().min(2, "Enter a city"),
  state: z.string().min(2, "Enter a state"),
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit PIN code"),
  delivery: z.enum(["standard", "express"]),
  payment: z.enum(["cod", "razorpay"]),
});

const field =
  "w-full rounded-md border border-brand-forest/20 bg-brand-paper px-3.5 py-3 text-[14px] text-brand-forest outline-none transition-colors placeholder:text-brand-forest/30 focus:border-brand-forest";
const label = "block text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-forest/50";

// Load Razorpay checkout.js dynamically
function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutForm() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const coupon = useCartStore((s) => s.coupon);
  const clear = useCartStore((s) => s.clear);
  const user = useAuthStore((s) => s.user);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
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
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const { discount, shipping, total } = cartTotals({ subtotal, coupon, express: delivery === "express" });

  const orderPayload = (values) => ({
    items: items.map((i) => ({
      productId: i.productId,
      slug: i.slug,
      name: i.name,
      image: i.image,
      weight: i.weight,
      qty: i.qty,
      price: i.price,
      mrp: i.mrp,
    })),
    address: {
      name: values.name,
      phone: values.phone,
      line1: values.line1,
      line2: values.line2 || "",
      city: values.city,
      state: values.state,
      pincode: values.pincode,
    },
    email: values.email,
    phone: values.phone,
    name: values.name,
    delivery: values.delivery,
    couponCode: coupon?.code,
    subtotal,
    discount,
    shipping,
    total,
  });

  // ── COD flow ──────────────────────────────────────────────
  const handleCOD = async (values) => {
    setSubmitting(true);
    try {
      const res = await paymentsApi.cod(orderPayload(values));
      useAdminStore.getState().addOrder({
        id: res.orderNumber,
        customer: values.name,
        email: values.email,
        phone: values.phone,
        items: items.map((i) => ({ productId: i.productId, name: i.name, weight: i.weight, qty: i.qty, price: i.price })),
        subtotal,
        shipping,
        discount,
        total,
        status: "placed",
        payment: "Cash on delivery (COD)",
        placedAt: new Date().toISOString(),
        address: { ...values },
      });
      clear();
      toast.success("Order placed! We'll confirm via email.");
      navigate({ to: "/order-confirmation/$orderNumber", params: { orderNumber: res.orderNumber } });
    } catch (err) {
      toast.error(err.message || "Could not place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Razorpay flow ─────────────────────────────────────────
  const handleRazorpay = async (values) => {
    setSubmitting(true);
    const loaded = await loadRazorpay();
    if (!loaded) {
      toast.error("Could not load payment gateway. Check your internet connection.");
      setSubmitting(false);
      return;
    }

    try {
      const { orderId, orderNumber, amount, currency, keyId } = await paymentsApi.createRazorpayOrder(orderPayload(values));

      const rzpOptions = {
        key: keyId,
        amount,
        currency,
        name: "MORO Snacks",
        description: `Order ${orderNumber}`,
        order_id: orderId,
        prefill: { name: values.name, email: values.email, contact: values.phone },
        theme: { color: "#173F32" },
        handler: async (response) => {
          try {
            await paymentsApi.verify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderNumber,
            });
            useAdminStore.getState().addOrder({
              id: orderNumber,
              customer: values.name,
              email: values.email,
              phone: values.phone,
              items: items.map((i) => ({ productId: i.productId, name: i.name, weight: i.weight, qty: i.qty, price: i.price })),
              subtotal,
              shipping,
              discount,
              total,
              status: "placed",
              payment: "Online (Razorpay)",
              placedAt: new Date().toISOString(),
              address: { ...values },
            });
            clear();
            toast.success("Payment successful! Order confirmed.");
            navigate({ to: "/order-confirmation/$orderNumber", params: { orderNumber } });
          } catch {
            toast.error("Payment verification failed. Contact support with order ID: " + orderNumber);
          } finally {
            setSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => {
            setSubmitting(false);
            toast("Payment cancelled. Your order has not been placed.");
          },
        },
      };

      new window.Razorpay(rzpOptions).open();
    } catch (err) {
      toast.error(err.message || "Could not initiate payment.");
      setSubmitting(false);
    }
  };

  const onSubmit = (values) =>
    values.payment === "cod" ? handleCOD(values) : handleRazorpay(values);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">

      {/* Contact */}
      <section>
        <h2 className="font-heading text-base font-extrabold uppercase tracking-[0.14em] text-brand-forest">
          1 · Contact
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className={label}>Email</label>
            <input id="email" type="email" className={`mt-2 ${field}`} {...register("email")} />
            {errors.email && <p className="mt-1.5 text-[12px] text-brand-chilli">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="phone" className={label}>Phone</label>
            <input id="phone" type="tel" className={`mt-2 ${field}`} {...register("phone")} />
            {errors.phone && <p className="mt-1.5 text-[12px] text-brand-chilli">{errors.phone.message}</p>}
          </div>
        </div>
      </section>

      {/* Shipping */}
      <section>
        <h2 className="font-heading text-base font-extrabold uppercase tracking-[0.14em] text-brand-forest">
          2 · Shipping address
        </h2>
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="name" className={label}>Full name</label>
            <input id="name" className={`mt-2 ${field}`} {...register("name")} />
            {errors.name && <p className="mt-1.5 text-[12px] text-brand-chilli">{errors.name.message}</p>}
          </div>
          <div>
            <label htmlFor="line1" className={label}>Address line 1</label>
            <input id="line1" className={`mt-2 ${field}`} {...register("line1")} />
            {errors.line1 && <p className="mt-1.5 text-[12px] text-brand-chilli">{errors.line1.message}</p>}
          </div>
          <div>
            <label htmlFor="line2" className={label}>Address line 2 (optional)</label>
            <input id="line2" className={`mt-2 ${field}`} {...register("line2")} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="city" className={label}>City</label>
              <input id="city" className={`mt-2 ${field}`} {...register("city")} />
              {errors.city && <p className="mt-1.5 text-[12px] text-brand-chilli">{errors.city.message}</p>}
            </div>
            <div>
              <label htmlFor="state" className={label}>State</label>
              <input id="state" className={`mt-2 ${field}`} {...register("state")} />
              {errors.state && <p className="mt-1.5 text-[12px] text-brand-chilli">{errors.state.message}</p>}
            </div>
            <div>
              <label htmlFor="pincode" className={label}>PIN code</label>
              <input id="pincode" className={`mt-2 ${field}`} maxLength={6} {...register("pincode")} />
              {errors.pincode && <p className="mt-1.5 text-[12px] text-brand-chilli">{errors.pincode.message}</p>}
            </div>
          </div>
        </div>
      </section>

      {/* Delivery speed */}
      <section>
        <h2 className="font-heading text-base font-extrabold uppercase tracking-[0.14em] text-brand-forest">
          3 · Delivery
        </h2>
        <div className="mt-4 space-y-3">
          {[
            { value: "standard", label: "Standard (5–7 days)", price: shipping === 0 ? "Free" : `+₹${shipping}` },
            { value: "express", label: "Express (1–2 days)", price: `+₹${shipping + 99}` },
          ].map((opt) => (
            <label key={opt.value} className={`flex cursor-pointer items-center justify-between rounded-xl border-2 p-4 transition-colors ${delivery === opt.value ? "border-brand-forest bg-brand-forest/5" : "border-brand-forest/15 hover:border-brand-forest/35"}`}>
              <span className="flex items-center gap-3">
                <input type="radio" value={opt.value} className="accent-brand-forest" {...register("delivery")} />
                <span className="text-sm font-medium text-brand-forest">{opt.label}</span>
              </span>
              <span className="text-sm font-semibold text-brand-forest">{opt.price}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Payment method */}
      <section>
        <h2 className="font-heading text-base font-extrabold uppercase tracking-[0.14em] text-brand-forest">
          4 · Payment
        </h2>
        <div className="mt-4 space-y-3">
          <label className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-colors ${payment === "razorpay" ? "border-brand-forest bg-brand-forest/5" : "border-brand-forest/15 hover:border-brand-forest/35"}`}>
            <input type="radio" value="razorpay" className="accent-brand-forest" {...register("payment")} />
            <CreditCard className="h-5 w-5 text-brand-forest" strokeWidth={1.5} />
            <span className="flex flex-col">
              <span className="text-sm font-semibold text-brand-forest">Pay online</span>
              <span className="text-[12px] text-brand-forest/55">UPI · Cards · Netbanking · Wallets (Razorpay)</span>
            </span>
          </label>
          <label className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-colors ${payment === "cod" ? "border-brand-forest bg-brand-forest/5" : "border-brand-forest/15 hover:border-brand-forest/35"}`}>
            <input type="radio" value="cod" className="accent-brand-forest" {...register("payment")} />
            <Truck className="h-5 w-5 text-brand-forest" strokeWidth={1.5} />
            <span className="flex flex-col">
              <span className="text-sm font-semibold text-brand-forest">Cash on delivery</span>
              <span className="text-[12px] text-brand-forest/55">Pay when your order arrives</span>
            </span>
          </label>
        </div>
      </section>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-3 rounded-xl bg-brand-forest py-4 font-heading text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand-paper transition-colors hover:bg-brand-chilli disabled:opacity-60"
      >
        {submitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Lock className="h-4 w-4" strokeWidth={2} />
        )}
        {payment === "razorpay" ? `Pay ₹${total}` : `Place order · ₹${total}`}
      </button>

      <p className="text-center text-[11px] text-brand-forest/40">
        Your data is encrypted and secure. We never store card details.
      </p>
    </form>
  );
}
