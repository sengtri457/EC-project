"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import CartItemRow from "@/components/CartItemRow";
import OrderSummary from "@/components/OrderSummary";
import OrderStepper from "@/components/OrderStepper";

export default function CartPage() {
  const { items, isLoaded, itemCount, subtotal, tax, total, clearCart } = useCart();

  if (!isLoaded) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center px-4 py-16">
        <div className="flex flex-col items-center gap-3 text-ink-soft">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-ink border-t-transparent" />
          <p className="text-xs font-mono uppercase tracking-wider">Retrieving bag...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
        <div className="flex min-h-[50vh] flex-col items-center justify-center border border-ink/20 bg-paper/60 p-10 text-center">
          <span className="type-label text-xs uppercase tracking-widest text-ink-soft">
            Bag Empty
          </span>
          <h1 className="type-display mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            No Pieces on Your Slip
          </h1>
          <p className="mt-2 max-w-sm text-xs leading-relaxed text-ink-soft">
            Items added to your bag will be held for this drop. Explore the rail to select your silhouette.
          </p>
          <div className="mt-8">
            <Link
              href="/#pieces"
              className="type-label inline-flex items-center gap-2 bg-ink px-7 py-3.5 text-xs text-paper uppercase tracking-widest transition-all hover:bg-ink-soft"
            >
              <span>See the Collection</span>
              <span aria-hidden="true">→</span>
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
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between border-b-2 border-ink pb-5">
        <div>
          <span className="type-label text-xs uppercase tracking-widest text-ink-soft block">
            Review Bag
          </span>
          <h1 className="type-display text-3xl text-ink sm:text-4xl">
            Acquisition Slip
          </h1>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-ink-soft">
            {itemCount} {itemCount === 1 ? "piece" : "pieces"}
          </span>
          <button
            onClick={clearCart}
            className="font-medium text-ink-soft hover:text-ctrl-red transition-colors underline underline-offset-2"
          >
            Clear slip
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Item Rows */}
        <div className="space-y-4 lg:col-span-8">
          {items.map((item) => (
            <CartItemRow key={item.productId} item={item} />
          ))}

          <div className="pt-6 flex items-center justify-between border-t border-ink/15">
            <Link
              href="/#pieces"
              className="type-label inline-flex items-center gap-1.5 text-xs text-ink hover:text-ctrl-red transition-colors underline underline-offset-4 decoration-ctrl-red"
            >
              <span>← Back to the Collection</span>
            </Link>

            <span className="text-[11px] text-ink-soft font-mono">
              CTRL Limited Release
            </span>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4">
          <OrderSummary
            subtotal={subtotal}
            tax={tax}
            total={total}
            itemCount={itemCount}
            showCheckoutButton
          />
        </div>
      </div>
    </div>
  );
}
