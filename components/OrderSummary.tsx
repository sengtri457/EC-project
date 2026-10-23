import Link from "next/link";

interface OrderSummaryProps {
  subtotal: number;
  tax: number;
  total: number;
  itemCount: number;
  showCheckoutButton?: boolean;
}

export default function OrderSummary({
  subtotal,
  tax,
  total,
  itemCount,
  showCheckoutButton = false,
}: OrderSummaryProps) {
  const freeShippingThreshold = 100;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="border border-ink/25 bg-paper/70 p-6 shadow-sm">
      <h2 className="type-label text-base text-ink">Order Summary</h2>

      {/* Free Shipping Indicator */}
      <div className="mt-4 border border-ink/15 bg-backdrop/60 p-3.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono text-ink">
            {subtotal >= freeShippingThreshold ? (
              <span className="text-ink font-semibold">
                ✓ Worldwide Insured Dispatch Unlocked
              </span>
            ) : (
              <span>
                Add <span className="font-bold text-ctrl-red font-mono">${(freeShippingThreshold - subtotal).toFixed(2)}</span> for free dispatch
              </span>
            )}
          </span>
          <span className="text-[11px] font-mono font-semibold text-ink-soft">
            {progressPercent}%
          </span>
        </div>
        <div className="mt-2 h-1 w-full overflow-hidden bg-ink/20">
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
            {subtotal >= freeShippingThreshold ? "Complimentary" : "$15.00"}
          </span>
        </div>

        <div className="border-t border-ink/20 pt-3">
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
          <Link
            href="/checkout"
            className="type-label flex h-13 w-full items-center justify-center bg-ink py-3.5 text-center text-xs text-paper uppercase tracking-widest shadow-sm transition-all hover:bg-ink-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ctrl-red"
          >
            <span>Proceed to Express Checkout</span>
          </Link>
        </div>
      )}
    </div>
  );
}
