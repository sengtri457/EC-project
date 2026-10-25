"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import CartItemRow from "@/components/CartItemRow";
import OrderSummary from "@/components/OrderSummary";
import OrderStepper from "@/components/OrderStepper";

export default function CartPage() {
  const {
    items,
    isLoaded,
    itemCount,
    clearCart,
    selectedItemCount,
    selectedSubtotal,
    selectedTax,
    selectedTotal,
    isAllSelected,
    toggleSelectAll,
  } = useCart();

  if (!isLoaded) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center px-4 py-16">
        <div className="flex flex-col items-center gap-3 text-ink-soft">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-ink border-t-transparent" />
          <p className="text-xs font-mono uppercase tracking-wider">Loading shopping bag...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
        <div className="flex min-h-[50vh] flex-col items-center justify-center border border-border bg-paper p-10 text-center shadow-sm">
          <span className="type-label text-xs uppercase tracking-widest text-ink-soft">
            Bag Empty
          </span>
          <h1 className="type-display mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Your Shopping Bag is Empty
          </h1>
          <p className="mt-2 max-w-sm text-xs leading-relaxed text-ink-soft">
            You have not added any items yet. Browse our full catalog to discover new arrivals and essentials.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/catalog"
              className="type-label inline-flex items-center gap-2 bg-ink px-7 py-3.5 text-xs text-paper uppercase tracking-widest transition-all hover:bg-ink-soft shadow-sm"
            >
              <span>Explore The Catalog</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Progress Stepper */}
      <OrderStepper currentStep={1} />

      {/* Title Bar */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between border-b-2 border-ink pb-5">
        <div>
          <span className="type-label text-xs uppercase tracking-widest text-ink-soft block">
            Step 1 of 3
          </span>
          <h1 className="type-display text-3xl text-ink sm:text-4xl font-semibold">
            Review Shopping Bag
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-mono">
          {/* Select All Toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none py-1 text-ink hover:text-ctrl-red transition-colors">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={(e) => toggleSelectAll(e.target.checked)}
              className="h-4 w-4 rounded-none accent-ink cursor-pointer"
            />
            <span className="font-semibold">
              Select All ({selectedItemCount}/{itemCount} pieces)
            </span>
          </label>

          <span className="hidden sm:inline text-border">|</span>

          <button
            onClick={clearCart}
            className="font-medium text-ink-soft hover:text-ctrl-red transition-colors underline underline-offset-2 cursor-pointer"
          >
            Clear all
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Item Rows */}
        <div className="space-y-4 lg:col-span-8">
          {items.map((item) => (
            <CartItemRow key={item.productId} item={item} />
          ))}

          <div className="pt-6 flex items-center justify-between border-t border-border">
            <Link
              href="/catalog"
              className="type-label inline-flex items-center gap-1.5 text-xs text-ink hover:text-ctrl-red transition-colors underline underline-offset-4 decoration-ctrl-red"
            >
              <span>&larr; Back to Catalog</span>
            </Link>

            <span className="text-[11px] text-ink-soft font-mono">
              Clothes™ Cambodia Delivery
            </span>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4">
          <OrderSummary
            subtotal={selectedSubtotal}
            tax={selectedTax}
            total={selectedTotal}
            itemCount={selectedItemCount}
            showCheckoutButton
            disabledCheckout={selectedItemCount === 0}
          />
        </div>
      </div>
    </div>
  );
}
