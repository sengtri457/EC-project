import Link from "next/link";

interface OrderSummaryProps {
  subtotal: number;
  tax: number;
  total: number;
  itemCount: number;
  showCheckoutButton?: boolean;
  disabledCheckout?: boolean;
}

export default function OrderSummary({
  subtotal,
  tax,
  total,
  itemCount,
  showCheckoutButton = false,
  disabledCheckout = false,
}: OrderSummaryProps) {
  const freeShippingThreshold = 100;
  const progressPercent =
    subtotal > 0 ? Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100)) : 0;

  const isDisabled = disabledCheckout || itemCount === 0;

  return (
    <div className="border border-border bg-paper p-6 shadow-sm">
      <h2 className="type-label text-base text-ink">Order Summary</h2>

      {/* Free Shipping Indicator */}
      <div className="mt-4 border border-border bg-backdrop p-3.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono text-ink">
            {subtotal >= freeShippingThreshold ? (
              <span className="text-sage font-semibold flex items-center gap-1">
                <span>✓</span> Complimentary Standard Shipping Unlocked
              </span>
            ) : subtotal > 0 ? (
              <span>
                Add <span className="font-bold text-ctrl-red font-mono">${(freeShippingThreshold - subtotal).toFixed(2)}</span> for complimentary shipping
              </span>
            ) : (
              <span className="text-ink-soft">
                Add $100.00 for complimentary shipping
              </span>
            )}
          </span>
          <span className="text-[11px] font-mono font-semibold text-ink-soft">
            {progressPercent}%
          </span>
        </div>
        <div className="mt-2 h-1 w-full overflow-hidden bg-border-strong">
          <div
            className="h-full bg-ink transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="mt-5 space-y-3 text-xs font-mono">
        <div className="flex justify-between text-ink-soft">
          <span>Subtotal ({itemCount} {itemCount === 1 ? "piece" : "pieces"})</span>
          <span className="font-semibold text-ink">${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-ink-soft">
          <span>Estimated Sales Tax (8%)</span>
          <span className="font-semibold text-ink">${tax.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-ink-soft">
          <span>Courier Shipping</span>
          <span className="font-semibold text-ink">
            {subtotal === 0
              ? "$0.00"
              : subtotal >= freeShippingThreshold
              ? "Complimentary"
              : "$15.00"}
          </span>
        </div>

        <div className="border-t border-border pt-3">
          <div className="flex justify-between text-sm">
            <span className="type-label text-sm text-ink">Total Due</span>
            <span className="font-mono font-bold text-ink text-base">
              ${total.toFixed(2)} USD
            </span>
          </div>
          <p className="mt-1 text-[11px] text-ink-soft">
            Includes customs fees &amp; white-glove packaging.
          </p>
        </div>
      </div>

      {showCheckoutButton && (
        <div className="mt-6">
          {isDisabled ? (
            <button
              type="button"
              disabled
              className="type-label flex h-13 w-full items-center justify-center bg-border py-3.5 text-center text-xs uppercase tracking-widest text-ink-soft/70 cursor-not-allowed select-none font-semibold"
            >
              <span>Select Items to Checkout</span>
            </button>
          ) : (
            <Link
              href="/checkout"
              className="type-label flex h-13 w-full items-center justify-center bg-ink py-3.5 text-center text-xs text-paper uppercase tracking-widest shadow-sm transition-all hover:bg-ink-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ctrl-red"
            >
              <span>Proceed to Express Checkout ({itemCount})</span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
