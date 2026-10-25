"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth, DEMO_USERS } from "@/context/AuthContext";
import { Customer, Order, ShippingMethod, PaymentMethod } from "@/types";
import { validateCustomer, ValidationErrors, CheckoutFormState } from "@/lib/validation";
import { saveOrder } from "@/lib/orders";
import { CAMBODIA_PROVINCES, PHNOM_PENH_KHANS, toKhr, KHR_RATE } from "@/lib/cambodiaLocations";
import OrderStepper from "@/components/OrderStepper";

export default function CheckoutPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { items, isLoaded, itemCount, subtotal, clearCart } = useCart();
  const { user, loginWithDemo } = useAuth();

  const [formData, setFormData] = useState<CheckoutFormState>({
    name: "",
    email: "",
    phone: "",
    telegram: "",
    address: "",
    cityProvince: "Phnom Penh",
    khanDistrict: "Boeng Keng Kang (BKK)",
    sangkatCommune: "Boeung Keng Kang 1",
    streetAddress: "",
    landmark: "",
    shippingMethod: "phnom_penh_express",
    paymentMethod: "khqr",
    cardNumber: "4242 •••• •••• 4242",
    cardExpiry: "12/28",
    cardCvc: "888",
    orderNotes: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Auto-fill from logged-in user
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name,
        email: prev.email || user.email,
        phone: prev.phone || user.phone || "",
        telegram: prev.telegram || user.telegram || "",
        cityProvince: user.address?.cityProvince || prev.cityProvince || "Phnom Penh",
        khanDistrict: user.address?.khanDistrict || prev.khanDistrict || "Boeng Keng Kang (BKK)",
        sangkatCommune: user.address?.sangkatCommune || prev.sangkatCommune || "",
        streetAddress: user.address?.streetAddress || user.address?.street || prev.streetAddress || "",
        landmark: user.address?.landmark || prev.landmark || "",
      }));
    }
  }, [user]);

  // Adjust shipping method automatically if province changes
  useEffect(() => {
    if (formData.cityProvince !== "Phnom Penh") {
      setFormData((prev) => ({ ...prev, shippingMethod: "provincial" }));
    } else if (formData.shippingMethod === "provincial") {
      setFormData((prev) => ({ ...prev, shippingMethod: "phnom_penh_express" }));
    }
  }, [formData.cityProvince]);

  // Guard: Redirect to cart if empty
  useEffect(() => {
    if (!isSubmitted && isLoaded && items.length === 0) {
      router.replace("/cart");
    }
  }, [isLoaded, items.length, isSubmitted, router]);

  // Cambodia shipping rates
  const getShippingCost = (method: ShippingMethod) => {
    if (method === "phnom_penh_express") {
      return subtotal >= 30 ? 0 : 1.5;
    }
    if (method === "phnom_penh_standard") {
      return subtotal >= 30 ? 0 : 1.0;
    }
    if (method === "provincial") {
      return 2.5;
    }
    return 1.5;
  };

  const currentShippingCost = getShippingCost(formData.shippingMethod || "phnom_penh_express");
  const calculatedTotal = Number((subtotal + currentShippingCost).toFixed(2));
  const calculatedTotalKhr = Math.round(calculatedTotal * KHR_RATE);

  const handleChange = (field: keyof CheckoutFormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field: keyof CheckoutFormState) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const result = validateCustomer(formData);
    if (result.errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: result.errors[field] }));
    }
  };

  const handleApplyDemoProfile = (demoIndex: number) => {
    const demo = DEMO_USERS[demoIndex];
    if (!demo) return;
    loginWithDemo(demoIndex);
    setFormData((prev) => ({
      ...prev,
      name: demo.name,
      email: demo.email,
      phone: demo.phone || "",
      telegram: demo.telegram || "",
      cityProvince: demo.address?.cityProvince || "Phnom Penh",
      khanDistrict: demo.address?.khanDistrict || "",
      sangkatCommune: demo.address?.sangkatCommune || "",
      streetAddress: demo.address?.streetAddress || "",
      landmark: demo.address?.landmark || "",
      shippingMethod: demo.address?.cityProvince === "Phnom Penh" ? "phnom_penh_express" : "provincial",
    }));
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const allTouched: Record<string, boolean> = {
      name: true,
      phone: true,
      cityProvince: true,
      streetAddress: true,
    };
    if (formData.cityProvince === "Phnom Penh") {
      allTouched.khanDistrict = true;
    }
    if (formData.paymentMethod === "card") {
      allTouched.cardNumber = true;
      allTouched.cardExpiry = true;
      allTouched.cardCvc = true;
    }
    setTouched(allTouched);

    const validation = validateCustomer(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      const firstErrorKey = Object.keys(validation.errors)[0];
      const elem = document.getElementById(`field-${firstErrorKey}`);
      if (elem) elem.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const trackingNumber = `KH-${Math.floor(1000000 + Math.random() * 9000000)}`;

    const fullAddressParts = [
      formData.streetAddress?.trim(),
      formData.sangkatCommune ? `Sangkat ${formData.sangkatCommune.trim()}` : null,
      formData.khanDistrict ? `Khan ${formData.khanDistrict.trim()}` : null,
      formData.cityProvince,
      formData.landmark ? `(Landmark: ${formData.landmark.trim()})` : null,
      "Cambodia",
    ].filter(Boolean);

    const fullAddressString = fullAddressParts.join(", ");

    const newCustomer: Customer = {
      name: formData.name.trim(),
      email: formData.email?.trim() || "customer@clothes-shop.com",
      phone: formData.phone.trim(),
      telegram: formData.telegram?.trim() || undefined,
      address: fullAddressString,
      cityProvince: formData.cityProvince,
      khanDistrict: formData.khanDistrict?.trim() || undefined,
      sangkatCommune: formData.sangkatCommune?.trim() || undefined,
      streetAddress: formData.streetAddress.trim(),
      landmark: formData.landmark?.trim() || undefined,
      shippingMethod: formData.shippingMethod,
      shippingCost: currentShippingCost,
      paymentMethod: formData.paymentMethod,
      cardNumberLast4:
        formData.paymentMethod === "card"
          ? (formData.cardNumber || "4242").replace(/\D/g, "").slice(-4) || "4242"
          : undefined,
      orderNotes: formData.orderNotes?.trim(),
    };

    const newOrder: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      customer: newCustomer,
      items: [...items],
      subtotal,
      shippingCost: currentShippingCost,
      tax: 0, // Cambodia local retail includes VAT in listing
      total: calculatedTotal,
      totalKhr: calculatedTotalKhr,
      trackingNumber,
      status: "confirmed",
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
          <p className="text-xs font-mono uppercase tracking-wider">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* 3-Step Stepper */}
      <OrderStepper currentStep={2} />

      {/* Title Header */}
      <div className="mb-6 border-b-2 border-ink pb-4 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
        <div>
          <span className="type-label text-xs uppercase tracking-widest text-ink-soft block">
            Step 2 of 3
          </span>
          <h1 className="type-display text-2xl sm:text-3xl font-semibold text-ink mt-0.5">
            Delivery &amp; Payment Details
          </h1>
        </div>
        <div className="text-xs font-mono text-ink-soft flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-forest" />
          <span>Cambodia Direct Delivery (Doorstep &amp; Express)</span>
        </div>
      </div>

      {/* 1-Click Cambodian Profile Test Drive */}
      <div className="mb-8 border border-border bg-paper p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div className="text-xs">
          <span className="font-semibold text-ink">Cambodia Express Autofill:</span>{" "}
          <span className="text-ink-soft font-mono">
            {user ? `Active account: ${user.name}` : "Pre-fill realistic Cambodia address"}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleApplyDemoProfile(0)}
            className="border border-border bg-canvas px-3 py-1.5 text-[11px] font-mono text-ink hover:border-ink hover:bg-paper transition-all cursor-pointer"
          >
            Sophea (Phnom Penh - BKK1)
          </button>
          <button
            type="button"
            onClick={() => handleApplyDemoProfile(1)}
            className="border border-border bg-canvas px-3 py-1.5 text-[11px] font-mono text-ink hover:border-ink hover:bg-paper transition-all cursor-pointer"
          >
            Vireak (Siem Reap - Wat Bo)
          </button>
          {!user && (
            <Link
              href="/login?redirect=/checkout"
              className="text-[11px] font-mono text-ink-soft hover:text-ink underline ml-1"
            >
              Sign In →
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Left Form: Real Cambodia Flow */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} noValidate className="space-y-8">
            {/* 1. Contact & Courier Communication */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border pb-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] font-mono font-bold text-paper">
                  1
                </span>
                <h2 className="type-label text-xs uppercase tracking-widest text-ink font-semibold">
                  Customer &amp; Courier Contact
                </h2>
              </div>

              <div>
                <label className="type-label block text-xs uppercase tracking-wider text-ink mb-1">
                  Recipient Full Name <span className="text-ctrl-red">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  onBlur={() => handleBlur("name")}
                  placeholder="e.g. Sophea Chan"
                  className={`w-full border bg-paper px-3.5 py-2.5 text-xs text-ink placeholder:text-ink-soft/40 focus:outline-none font-mono ${
                    touched.name && errors.name ? "border-ctrl-red" : "border-border focus:border-ink"
                  }`}
                />
                {touched.name && errors.name && (
                  <p className="mt-1 text-[11px] text-ctrl-red font-mono">{errors.name}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div id="field-phone">
                  <label className="type-label block text-xs uppercase tracking-wider text-ink mb-1">
                    Phone Number (Cellcard / Smart / Metfone) <span className="text-ctrl-red">*</span>
                  </label>
                  <input
                    inputMode="tel"
                    autoComplete="tel"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    onBlur={() => handleBlur("phone")}
                    placeholder="e.g. 012 345 678"
                    className={`w-full border bg-paper px-3.5 py-2.5 text-xs text-ink placeholder:text-ink-soft/40 focus:outline-none font-mono ${
                      touched.phone && errors.phone ? "border-ctrl-red" : "border-border focus:border-ink"
                    }`}
                  />
                  {touched.phone && errors.phone && (
                    <p className="mt-1 text-[11px] text-ctrl-red font-mono">{errors.phone}</p>
                  )}
                  <span className="text-[10px] text-ink-soft/80 font-mono mt-0.5 block">
                    The rider will call this number when arriving at your location.
                  </span>
                </div>

                <div>
                  <label className="type-label block text-xs uppercase tracking-wider text-ink mb-1">
                    Telegram Username / Number <span className="text-ink-soft text-[10px] lowercase">(recommended)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.telegram || ""}
                    onChange={(e) => handleChange("telegram", e.target.value)}
                    placeholder="e.g. @sopheachan or 012345678"
                    className="w-full border border-border bg-paper px-3.5 py-2.5 text-xs text-ink placeholder:text-ink-soft/40 focus:border-ink focus:outline-none font-mono"
                  />
                  <span className="text-[10px] text-ink-soft/80 font-mono mt-0.5 block">
                    Couriers can send location pin drops or drop-off photos via Telegram.
                  </span>
                </div>
              </div>

              <div>
                <label className="type-label block text-xs uppercase tracking-wider text-ink mb-1">
                  Email Address <span className="text-ink-soft text-[10px] lowercase">(for digital invoice)</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  placeholder="receipt@gmail.com"
                  className="w-full border border-border bg-paper px-3.5 py-2.5 text-xs text-ink placeholder:text-ink-soft/40 focus:border-ink focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* 2. Cambodian Address Breakdown */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border pb-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] font-mono font-bold text-paper">
                  2
                </span>
                <h2 className="type-label text-xs uppercase tracking-widest text-ink font-semibold">
                  Delivery Destination in Cambodia
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div id="field-cityProvince">
                  <label className="type-label block text-xs uppercase tracking-wider text-ink mb-1">
                    City / Province <span className="text-ctrl-red">*</span>
                  </label>
                  <select
                    value={formData.cityProvince}
                    onChange={(e) => handleChange("cityProvince", e.target.value)}
                    className="w-full border border-border bg-paper px-3.5 py-2.5 text-xs text-ink focus:border-ink focus:outline-none font-mono"
                  >
                    {CAMBODIA_PROVINCES.map((prov) => (
                      <option key={prov} value={prov}>
                        {prov}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.cityProvince === "Phnom Penh" ? (
                  <div id="field-khanDistrict">
                    <label className="type-label block text-xs uppercase tracking-wider text-ink mb-1">
                      Khan / District <span className="text-ctrl-red">*</span>
                    </label>
                    <select
                      value={formData.khanDistrict}
                      onChange={(e) => handleChange("khanDistrict", e.target.value)}
                      className="w-full border border-border bg-paper px-3.5 py-2.5 text-xs text-ink focus:border-ink focus:outline-none font-mono"
                    >
                      {PHNOM_PENH_KHANS.map((khan) => (
                        <option key={khan} value={khan}>
                          {khan}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="type-label block text-xs uppercase tracking-wider text-ink mb-1">
                      District / Krong
                    </label>
                    <input
                      type="text"
                      value={formData.khanDistrict || ""}
                      onChange={(e) => handleChange("khanDistrict", e.target.value)}
                      placeholder="e.g. Krong Siem Reap"
                      className="w-full border border-border bg-paper px-3.5 py-2.5 text-xs text-ink placeholder:text-ink-soft/40 focus:border-ink focus:outline-none font-mono"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="type-label block text-xs uppercase tracking-wider text-ink mb-1">
                    Sangkat / Commune
                  </label>
                  <input
                    type="text"
                    value={formData.sangkatCommune || ""}
                    onChange={(e) => handleChange("sangkatCommune", e.target.value)}
                    placeholder="e.g. Boeung Keng Kang 1 / Sala Kamreuk"
                    className="w-full border border-border bg-paper px-3.5 py-2.5 text-xs text-ink placeholder:text-ink-soft/40 focus:border-ink focus:outline-none font-mono"
                  />
                </div>

                <div id="field-streetAddress">
                  <label className="type-label block text-xs uppercase tracking-wider text-ink mb-1">
                    Street &amp; House Number <span className="text-ctrl-red">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.streetAddress}
                    onChange={(e) => handleChange("streetAddress", e.target.value)}
                    onBlur={() => handleBlur("streetAddress")}
                    placeholder="e.g. House #42, Street 310"
                    className={`w-full border bg-paper px-3.5 py-2.5 text-xs text-ink placeholder:text-ink-soft/40 focus:outline-none font-mono ${
                      touched.streetAddress && errors.streetAddress ? "border-ctrl-red" : "border-border focus:border-ink"
                    }`}
                  />
                  {touched.streetAddress && errors.streetAddress && (
                    <p className="mt-1 text-[11px] text-ctrl-red font-mono">{errors.streetAddress}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="type-label block text-xs uppercase tracking-wider text-ink mb-1">
                  Nearby Landmark / Building Name <span className="text-ink-soft text-[10px] lowercase">(helps courier find you)</span>
                </label>
                <input
                  type="text"
                  value={formData.landmark || ""}
                  onChange={(e) => handleChange("landmark", e.target.value)}
                  placeholder="e.g. Near Brown Coffee BKK57, Behind Russian Market, or Vattanac Tower"
                  className="w-full border border-border bg-paper px-3.5 py-2.5 text-xs text-ink placeholder:text-ink-soft/40 focus:border-ink focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* 3. Delivery Method */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border pb-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] font-mono font-bold text-paper">
                  3
                </span>
                <h2 className="type-label text-xs uppercase tracking-widest text-ink font-semibold">
                  Delivery Method
                </h2>
              </div>

              <div className="space-y-3">
                {formData.cityProvince === "Phnom Penh" ? (
                  <>
                    <label
                      className={`flex items-center justify-between p-3.5 border transition-all cursor-pointer ${
                        formData.shippingMethod === "phnom_penh_express"
                          ? "border-ink bg-canvas shadow-xs"
                          : "border-border bg-paper hover:border-ink/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shippingMethod"
                          value="phnom_penh_express"
                          checked={formData.shippingMethod === "phnom_penh_express"}
                          onChange={() => handleChange("shippingMethod", "phnom_penh_express")}
                          className="accent-ink"
                        />
                        <div>
                          <span className="text-xs font-semibold text-ink block">
                            Phnom Penh Express (Same-Day Rider)
                          </span>
                          <span className="text-[11px] text-ink-soft font-mono">
                            Delivered in 1 to 3 hours via direct courier rider
                          </span>
                        </div>
                      </div>
                      <div className="text-right font-mono">
                        <span className="text-xs font-semibold text-ink">
                          {subtotal >= 30 ? "FREE" : "$1.50"}
                        </span>
                        <span className="block text-[10px] text-ink-soft">
                          {subtotal >= 30 ? "(Order over $30)" : `≈ ${toKhr(1.5)}`}
                        </span>
                      </div>
                    </label>

                    <label
                      className={`flex items-center justify-between p-3.5 border transition-all cursor-pointer ${
                        formData.shippingMethod === "phnom_penh_standard"
                          ? "border-ink bg-canvas shadow-xs"
                          : "border-border bg-paper hover:border-ink/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shippingMethod"
                          value="phnom_penh_standard"
                          checked={formData.shippingMethod === "phnom_penh_standard"}
                          onChange={() => handleChange("shippingMethod", "phnom_penh_standard")}
                          className="accent-ink"
                        />
                        <div>
                          <span className="text-xs font-semibold text-ink block">
                            Phnom Penh Standard (Next Day)
                          </span>
                          <span className="text-[11px] text-ink-soft font-mono">
                            Scheduled delivery next afternoon
                          </span>
                        </div>
                      </div>
                      <div className="text-right font-mono">
                        <span className="text-xs font-semibold text-ink">
                          {subtotal >= 30 ? "FREE" : "$1.00"}
                        </span>
                        <span className="block text-[10px] text-ink-soft">
                          {subtotal >= 30 ? "(Order over $30)" : `≈ ${toKhr(1.0)}`}
                        </span>
                      </div>
                    </label>
                  </>
                ) : (
                  <label className="flex items-center justify-between p-3.5 border border-ink bg-canvas shadow-xs cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value="provincial"
                        checked={true}
                        readOnly
                        className="accent-ink"
                      />
                      <div>
                        <span className="text-xs font-semibold text-ink block">
                          Provincial Express Delivery (Virak Buntham / J&amp;T)
                        </span>
                        <span className="text-[11px] text-ink-soft font-mono">
                          Dispatched to {formData.cityProvince} (1–2 days delivery)
                        </span>
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-xs font-semibold text-ink">$2.50</span>
                      <span className="block text-[10px] text-ink-soft">≈ {toKhr(2.5)}</span>
                    </div>
                  </label>
                )}
              </div>
            </div>

            {/* 4. Payment Methods: KHQR, Cash on Delivery, or Card */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border pb-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] font-mono font-bold text-paper">
                  4
                </span>
                <h2 className="type-label text-xs uppercase tracking-widest text-ink font-semibold">
                  Payment Method
                </h2>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleChange("paymentMethod", "khqr")}
                  className={`p-3 border text-center transition-all cursor-pointer ${
                    formData.paymentMethod === "khqr"
                      ? "border-ink bg-canvas font-semibold text-ink"
                      : "border-border bg-paper text-ink-soft hover:text-ink"
                  }`}
                >
                  <span className="text-xs block font-bold text-ctrl-red">KHQR</span>
                  <span className="text-[9px] font-mono text-ink-soft">ABA / Bakong / Wing</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleChange("paymentMethod", "cod")}
                  className={`p-3 border text-center transition-all cursor-pointer ${
                    formData.paymentMethod === "cod"
                      ? "border-ink bg-canvas font-semibold text-ink"
                      : "border-border bg-paper text-ink-soft hover:text-ink"
                  }`}
                >
                  <span className="text-xs block">Cash On Delivery</span>
                  <span className="text-[9px] font-mono text-ink-soft">Pay Driver ($ or ៛)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleChange("paymentMethod", "card")}
                  className={`p-3 border text-center transition-all cursor-pointer ${
                    formData.paymentMethod === "card"
                      ? "border-ink bg-canvas font-semibold text-ink"
                      : "border-border bg-paper text-ink-soft hover:text-ink"
                  }`}
                >
                  <span className="text-xs block">Debit / Credit</span>
                  <span className="text-[9px] font-mono text-ink-soft">Visa / Mastercard</span>
                </button>
              </div>

              {/* KHQR Explainer Box */}
              {formData.paymentMethod === "khqr" && (
                <div className="border border-border bg-paper p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-block bg-ctrl-red text-paper font-bold text-[10px] px-2 py-0.5 rounded-xs font-mono">
                        KHQR
                      </span>
                      <span className="text-xs font-semibold text-ink">National Bank of Cambodia Bakong</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-ink">
                      ${calculatedTotal.toFixed(2)} USD
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="h-24 w-24 border border-border bg-white p-1.5 shrink-0 flex flex-col items-center justify-center">
                      {/* Crisp SVG QR Icon Simulation */}
                      <svg viewBox="0 0 24 24" className="h-full w-full text-ink fill-current">
                        <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm8-2h2v2h-2v-2zm4 0h2v2h-2v-2zm-4 4h2v2h-2v-2zm4 0h2v2h-2v-2zm2-2h2v2h-2v-2zm0 4h2v2h-2v-2zm-8 2h2v2h-2v-2zm4 0h2v2h-2v-2zm6-10h2v2h-2v-2z" />
                      </svg>
                    </div>

                    <div className="space-y-1 text-xs font-mono text-ink-soft">
                      <p className="text-ink font-semibold">Instant Scan &amp; Pay</p>
                      <p className="text-[11px]">
                        Scan via <strong>ABA Mobile</strong>, <strong>ACLEDA mobile</strong>, <strong>Wing Bank</strong>, or any Bakong-enabled app.
                      </p>
                      <p className="text-[11px] text-forest font-medium">
                        ✓ No extra transaction fees
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Cash on Delivery Box */}
              {formData.paymentMethod === "cod" && (
                <div className="border border-border bg-paper p-4 text-xs font-mono text-ink-soft space-y-2">
                  <p className="text-ink font-semibold">Pay upon parcel arrival:</p>
                  <p>
                    Please prepare exact cash of{" "}
                    <strong className="text-ink font-bold">${calculatedTotal.toFixed(2)} USD</strong> or{" "}
                    <strong className="text-ink font-bold">{toKhr(calculatedTotal)}</strong> for the delivery driver.
                  </p>
                  <p className="text-[11px]">
                    ✓ You may inspect package contents before handing payment to the rider.
                  </p>
                </div>
              )}

              {/* Card Box */}
              {formData.paymentMethod === "card" && (
                <div className="border border-border bg-canvas p-4 space-y-3">
                  <div>
                    <label className="type-label block text-[11px] uppercase tracking-wider text-ink mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={formData.cardNumber}
                      onChange={(e) => handleChange("cardNumber", e.target.value)}
                      placeholder="4242 •••• •••• 4242"
                      className="w-full border border-border bg-paper px-3 py-2 text-xs text-ink font-mono focus:border-ink focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="type-label block text-[11px] uppercase tracking-wider text-ink mb-1">
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        value={formData.cardExpiry}
                        onChange={(e) => handleChange("cardExpiry", e.target.value)}
                        placeholder="12/28"
                        className="w-full border border-border bg-paper px-3 py-2 text-xs text-ink font-mono focus:border-ink focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="type-label block text-[11px] uppercase tracking-wider text-ink mb-1">
                        CVC
                      </label>
                      <input
                        type="text"
                        value={formData.cardCvc}
                        onChange={(e) => handleChange("cardCvc", e.target.value)}
                        placeholder="888"
                        className="w-full border border-border bg-paper px-3 py-2 text-xs text-ink font-mono focus:border-ink focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 5. Special Notes */}
            <div>
              <label className="type-label block text-xs uppercase tracking-wider text-ink mb-1">
                Special Delivery Notes <span className="text-ink-soft text-[10px] lowercase">(optional)</span>
              </label>
              <textarea
                value={formData.orderNotes || ""}
                onChange={(e) => handleChange("orderNotes", e.target.value)}
                rows={2}
                placeholder="e.g. Call before coming, leave with building security guard, etc."
                className="w-full border border-border bg-paper px-3.5 py-2 text-xs text-ink placeholder:text-ink-soft/40 focus:border-ink focus:outline-none font-mono"
              />
            </div>

            {/* Action buttons */}
            <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                href="/cart"
                className="type-label inline-flex items-center gap-1.5 text-xs text-ink hover:text-ctrl-red transition-colors underline underline-offset-4"
              >
                &larr; Return to Shopping Bag
              </Link>

              <button
                type="submit"
                disabled={isPending}
                className="type-label w-full sm:w-auto bg-ink px-8 py-3.5 text-xs uppercase tracking-widest text-paper hover:bg-ink-soft transition-all shadow-sm cursor-pointer font-semibold disabled:opacity-50"
              >
                {isPending ? "Placing Order..." : `Confirm Order — $${calculatedTotal.toFixed(2)} USD`}
              </button>
            </div>
          </form>
        </div>

        {/* Right Summary */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 border border-border bg-paper p-6 shadow-sm space-y-5">
            <div className="border-b border-border pb-3 flex justify-between items-baseline">
              <h3 className="type-display text-lg text-ink font-medium">Order Summary</h3>
              <span className="font-mono text-xs text-ink-soft">{itemCount} items</span>
            </div>

            {/* Items list */}
            <div className="divide-y divide-border/60 max-h-64 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.productId} className="py-2.5 flex justify-between items-center text-xs">
                  <div>
                    <h4 className="font-medium text-ink line-clamp-1">{item.title}</h4>
                    <span className="text-[11px] font-mono text-ink-soft">
                      Qty: {item.quantity} × ${item.price.toFixed(2)}
                    </span>
                  </div>
                  <span className="font-mono font-semibold text-ink">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Pricing breakdown */}
            <div className="space-y-2 border-t border-border pt-4 font-mono text-xs">
              <div className="flex justify-between text-ink-soft">
                <span>Subtotal</span>
                <span className="text-ink">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-ink-soft">
                <span>Delivery</span>
                <span className="text-ink">
                  {currentShippingCost === 0 ? "FREE" : `$${currentShippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="border-t-2 border-ink pt-3 flex justify-between items-baseline">
                <div>
                  <span className="font-sans text-xs uppercase tracking-wider font-bold text-ink block">
                    Total Due
                  </span>
                  <span className="text-[11px] text-ink-soft">
                    ≈ {toKhr(calculatedTotal)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="type-display text-2xl font-bold text-ink">
                    ${calculatedTotal.toFixed(2)}
                  </span>
                  <span className="block text-[10px] font-mono text-ink-soft">USD</span>
                </div>
              </div>
            </div>

            {/* Local Cambodia Service Notice */}
            <div className="border-t border-border pt-4 space-y-2 text-[11px] font-mono text-ink-soft">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-forest">✓</span>
                <span>Direct delivery via local Cambodian express riders</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-forest">✓</span>
                <span>Both USD ($) and Khmer Riel (៛) accepted</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-forest">✓</span>
                <span>Customer service via Telegram and direct phone call</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
