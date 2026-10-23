"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Customer, Order } from "@/types";
import { validateCustomer, ValidationErrors } from "@/lib/validation";
import { saveOrder } from "@/lib/orders";
import OrderStepper from "@/components/OrderStepper";

export default function CheckoutPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { items, isLoaded, itemCount, subtotal, tax, total, clearCart } = useCart();

  const [formData, setFormData] = useState<Customer>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<keyof Customer, boolean>>({
    name: false,
    email: false,
    phone: false,
    address: false,
  });

  // Guard: Redirect to cart if empty (only when not actively submitting an order)
  useEffect(() => {
    if (!isSubmitted && isLoaded && items.length === 0) {
      router.replace("/cart");
    }
  }, [isLoaded, items.length, isSubmitted, router]);

  const handleChange = (field: keyof Customer, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field: keyof Customer) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const result = validateCustomer(formData);
    if (result.errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: result.errors[field] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      name: true,
      email: true,
      phone: true,
      address: true,
    });

    const validation = validateCustomer(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const newOrder: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      customer: {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
      },
      items: [...items],
      subtotal,
      tax,
      total,
    };

    setIsSubmitted(true);
    saveOrder(newOrder);
    clearCart();

    startTransition(() => {
      router.push(`/invoice/${orderId}`);
    });
  };

  if (!isLoaded || (items.length === 0 && !isSubmitted)) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center px-4 py-16">
        <div className="flex flex-col items-center gap-3 text-ink-soft">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-ink border-t-transparent" />
          <p className="text-xs font-mono uppercase tracking-wider">Securing dispatch session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* 3-Step Checkout Stepper */}
      <OrderStepper currentStep={2} />

      {/* Checkout Title */}
      <div className="mb-8 border-b-2 border-ink pb-5">
        <Link
          href="/cart"
          className="type-label inline-flex items-center gap-1.5 text-xs text-ink-soft hover:text-ink transition-colors"
        >
          <span aria-hidden="true">←</span>
          <span>Return to Bag</span>
        </Link>
        <h1 className="type-display mt-2 text-3xl sm:text-4xl text-ink font-black tracking-tight">
          Dispatch Slip
        </h1>
        <p className="type-label mt-1 text-xs text-ink-soft">
          Direct courier delivery · Cash on delivery (COD) upon doorstep inspection
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Form Column */}
        <form onSubmit={handleSubmit} className="space-y-6 lg:col-span-7">
          {/* Customer & Address Details */}
          <div className="border border-ink/20 bg-paper/70 p-6 sm:p-8 backdrop-blur-sm shadow-sm">
            <div className="flex items-center justify-between border-b border-ink/15 pb-3">
              <h2 className="type-label text-sm uppercase tracking-widest text-ink font-bold">
                01. Delivery Coordinates
              </h2>
              <span className="font-mono text-[11px] text-ink-soft">
                All fields required
              </span>
            </div>

            <div className="mt-5 space-y-4">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="name"
                  className="type-label block text-xs uppercase tracking-wider text-ink font-semibold"
                >
                  Recipient Full Name <span className="text-ctrl-red">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  onBlur={() => handleBlur("name")}
                  placeholder="e.g. Alex Mercer"
                  className={`mt-1.5 w-full border bg-backdrop/40 px-3.5 py-3 font-mono text-xs text-ink placeholder-ink/40 focus:border-ink focus:bg-paper focus:outline-none transition-colors ${
                    touched.name && errors.name
                      ? "border-ctrl-red focus:border-ctrl-red"
                      : "border-ink/25 focus:border-ink"
                  }`}
                />
                {touched.name && errors.name && (
                  <p className="mt-1 font-mono text-[11px] text-ctrl-red">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="type-label block text-xs uppercase tracking-wider text-ink font-semibold"
                >
                  Email for Receipt &amp; Dispatch Tracking <span className="text-ctrl-red">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  placeholder="alex.mercer@atelier.com"
                  className={`mt-1.5 w-full border bg-backdrop/40 px-3.5 py-3 font-mono text-xs text-ink placeholder-ink/40 focus:border-ink focus:bg-paper focus:outline-none transition-colors ${
                    touched.email && errors.email
                      ? "border-ctrl-red focus:border-ctrl-red"
                      : "border-ink/25 focus:border-ink"
                  }`}
                />
                {touched.email && errors.email && (
                  <p className="mt-1 font-mono text-[11px] text-ctrl-red">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="type-label block text-xs uppercase tracking-wider text-ink font-semibold"
                >
                  Mobile Number (Courier Handoff Call) <span className="text-ctrl-red">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  onBlur={() => handleBlur("phone")}
                  placeholder="e.g. +1 555 019 2834"
                  className={`mt-1.5 w-full border bg-backdrop/40 px-3.5 py-3 font-mono text-xs text-ink placeholder-ink/40 focus:border-ink focus:bg-paper focus:outline-none transition-colors ${
                    touched.phone && errors.phone
                      ? "border-ctrl-red focus:border-ctrl-red"
                      : "border-ink/25 focus:border-ink"
                  }`}
                />
                {touched.phone && errors.phone && (
                  <p className="mt-1 font-mono text-[11px] text-ctrl-red">{errors.phone}</p>
                )}
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="address"
                  className="type-label block text-xs uppercase tracking-wider text-ink font-semibold"
                >
                  Street Address, Apartment &amp; Postal Code <span className="text-ctrl-red">*</span>
                </label>
                <textarea
                  id="address"
                  rows={3}
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  onBlur={() => handleBlur("address")}
                  placeholder="404 Industrial Blvd, Studio Suite 12B, Brooklyn, NY 11201"
                  className={`mt-1.5 w-full border bg-backdrop/40 px-3.5 py-3 font-mono text-xs text-ink placeholder-ink/40 focus:border-ink focus:bg-paper focus:outline-none transition-colors ${
                    touched.address && errors.address
                      ? "border-ctrl-red focus:border-ctrl-red"
                      : "border-ink/25 focus:border-ink"
                  }`}
                />
                {touched.address && errors.address && (
                  <p className="mt-1 font-mono text-[11px] text-ctrl-red">{errors.address}</p>
                )}
              </div>
            </div>
          </div>

          {/* Payment Terms */}
          <div className="border border-ink/20 bg-paper/70 p-6 sm:p-8 backdrop-blur-sm shadow-sm">
            <h2 className="type-label text-sm uppercase tracking-widest text-ink font-bold border-b border-ink/15 pb-3">
              02. Settlement Terms
            </h2>

            <div className="mt-4 flex items-center justify-between border-2 border-ink bg-backdrop/60 p-4">
              <div className="flex items-center gap-3.5">
                <div className="flex h-4 w-4 items-center justify-center border-2 border-ink">
                  <div className="h-2 w-2 bg-ctrl-red" />
                </div>
                <div>
                  <p className="font-mono text-xs font-bold uppercase tracking-wider text-ink">
                    Cash on Delivery (COD)
                  </p>
                  <p className="font-mono text-[11px] text-ink-soft">
                    Verify garment condition and packaging before paying courier in cash.
                  </p>
                </div>
              </div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest bg-ink text-paper px-2 py-0.5">
                Guaranteed
              </span>
            </div>
          </div>

          {/* Place Order CTA */}
          <button
            type="submit"
            disabled={isPending}
            className="type-label flex w-full items-center justify-center gap-2 bg-ink py-4 text-xs font-bold uppercase tracking-widest text-paper shadow-sm transition-all hover:bg-ink-soft active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            {isPending ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-paper border-t-transparent" />
                <span>Generating Dispatch Invoice...</span>
              </>
            ) : (
              <>
                <span>Confirm Acquisition (${total.toFixed(2)} USD)</span>
                <span aria-hidden="true">→</span>
              </>
            )}
          </button>
        </form>

        {/* Sidebar Order Review */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 space-y-4 border border-ink/20 bg-paper/70 p-6 backdrop-blur-sm shadow-sm">
            <div className="flex items-center justify-between border-b border-ink/15 pb-3">
              <h2 className="type-label text-xs uppercase tracking-widest text-ink font-bold">
                Order Review
              </h2>
              <span className="font-mono text-xs text-ink-soft">
                {itemCount} {itemCount === 1 ? "piece" : "pieces"}
              </span>
            </div>

            <div className="max-h-80 divide-y divide-ink/10 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center gap-3.5 py-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden border border-ink/15 bg-white p-1">
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      fill
                      sizes="56px"
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-xs font-semibold text-ink">
                      {item.title}
                    </p>
                    <p className="font-mono text-[11px] text-ink-soft">
                      Qty: {item.quantity} · ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <span className="font-mono text-xs font-bold text-ink">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2.5 border-t border-ink/15 pt-4 text-xs font-mono">
              <div className="flex justify-between text-ink-soft">
                <span>Subtotal</span>
                <span className="font-semibold text-ink">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-ink-soft">
                <span>Sales Tax (8%)</span>
                <span className="font-semibold text-ink">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-ink-soft">
                <span>Insured Courier Dispatch</span>
                <span className="font-bold text-ink uppercase text-[11px]">
                  Complimentary
                </span>
              </div>
              <div className="flex justify-between border-t-2 border-ink pt-3 text-sm">
                <span className="type-label font-bold text-ink">Total Payable</span>
                <span className="font-mono text-base font-black text-ink">
                  ${total.toFixed(2)} USD
                </span>
              </div>
            </div>

            <div className="mt-4 border border-ink/15 bg-backdrop/60 p-3 text-[11px] font-mono text-ink-soft">
              Official archive receipt with downloadable .HTML invoice generated immediately upon submission.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
