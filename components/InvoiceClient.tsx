"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Order } from "@/types";
import { getOrderById } from "@/lib/orders";
import { downloadInvoice } from "@/lib/downloadInvoice";
import OrderStepper from "@/components/OrderStepper";

interface InvoiceClientProps {
  orderId: string;
}

export default function InvoiceClient({ orderId }: InvoiceClientProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setIsLoading(false);
      return;
    }

    // Direct lookup
    const found = getOrderById(orderId);
    if (found) {
      setOrder(found);
      setIsLoading(false);
      return;
    }

    // Micro-delay retry to guarantee localStorage synchronization
    const timer = setTimeout(() => {
      const retryFound = getOrderById(orderId);
      setOrder(retryFound || null);
      setIsLoading(false);
    }, 120);

    return () => clearTimeout(timer);
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-4xl items-center justify-center px-4 py-16">
        <div className="flex flex-col items-center gap-3 text-ink-soft">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-ink border-t-transparent" />
          <p className="text-xs font-mono uppercase tracking-wider">Retrieving acquisition slip...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="border border-ink/20 bg-paper/60 p-10 shadow-sm">
          <span className="type-label text-xs uppercase tracking-widest text-ctrl-red">
            Slip Not Found
          </span>
          <h1 className="type-display mt-3 text-2xl font-black tracking-tight text-ink">
            Reference &ldquo;{orderId}&rdquo; Not In Local Registry
          </h1>
          <p className="mt-2 text-xs leading-relaxed text-ink-soft font-mono max-w-sm mx-auto">
            Orders are committed to local client memory. If you cleared your browser storage or opened a new private tab, the slip may not be loaded.
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <Link
              href="/"
              className="type-label inline-flex items-center gap-2 bg-ink px-6 py-3 text-xs uppercase tracking-widest text-paper hover:bg-ink-soft transition-colors"
            >
              <span>Return to Catalog</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      {/* 3-Step Checkout Stepper */}
      <OrderStepper currentStep={3} />

      {/* Confirmation Banner */}
      <div className="mb-6 border-2 border-ink bg-paper/90 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-ctrl-red text-white text-xs font-mono font-bold">
              ✓
            </div>
            <div>
              <h2 className="type-label text-xs uppercase tracking-widest text-ink font-bold">
                Acquisition Slip Recorded
              </h2>
              <p className="font-mono text-xs text-ink-soft mt-0.5">
                Cash payment of <strong className="text-ink">${order.total.toFixed(2)} USD</strong> is due upon doorstep inspection.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => window.print()}
              className="type-label inline-flex items-center justify-center border border-ink px-3 py-2 text-xs uppercase tracking-widest text-ink hover:bg-ink/5 transition-colors cursor-pointer"
            >
              Print
            </button>
            <button
              type="button"
              onClick={() => downloadInvoice(order)}
              className="type-label inline-flex items-center justify-center gap-2 bg-ink px-4 py-2 text-xs uppercase tracking-widest text-paper hover:bg-ink-soft transition-colors cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span>Download Invoice (.html)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Authentic Studio Receipt Card */}
      <div className="border-2 border-ink bg-paper/80 shadow-md">
        {/* Receipt Header */}
        <div className="border-b-2 border-ink p-6 sm:p-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 bg-ink text-paper">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-paper/70">
              Official Packing &amp; Dispatch Record
            </span>
            <h1 className="type-display mt-1 text-2xl sm:text-3xl font-black tracking-tight text-paper">
              CTRL — THE NEW ERA
            </h1>
            <p className="font-mono text-[11px] text-paper/60 mt-0.5">
              Limited Archive Release · Studio Dispatch Slip
            </p>
          </div>
          <div className="text-left sm:text-right">
            <span className="inline-block bg-ctrl-red text-white px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-widest">
              Cash on Delivery
            </span>
            <p className="mt-2 font-mono text-xs font-bold text-paper">
              {order.id}
            </p>
            <p className="font-mono text-[11px] text-paper/60">{formattedDate}</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="p-6 sm:p-8 space-y-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 border border-ink/20 bg-backdrop/60 p-5">
            <div>
              <h3 className="type-label text-[10px] uppercase tracking-widest text-ink-soft">
                Billed To
              </h3>
              <p className="mt-2 text-xs font-bold text-ink">
                {order.customer.name}
              </p>
              <p className="font-mono text-xs text-ink-soft mt-0.5">{order.customer.email}</p>
              <p className="font-mono text-xs text-ink-soft mt-0.5">{order.customer.phone}</p>
            </div>

            <div>
              <h3 className="type-label text-[10px] uppercase tracking-widest text-ink-soft">
                Dispatch Destination
              </h3>
              <p className="mt-2 text-xs font-mono text-ink leading-relaxed whitespace-pre-line">
                {order.customer.address}
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border-t border-b border-ink/20">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-ink/20 bg-backdrop/40 font-mono text-[10px] font-bold uppercase tracking-wider text-ink">
                <tr>
                  <th className="py-3 px-3">Silhouette / Item</th>
                  <th className="py-3 px-3 text-center">Qty</th>
                  <th className="py-3 px-3 text-right">Unit Price</th>
                  <th className="py-3 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10 font-mono">
                {order.items.map((item) => (
                  <tr key={item.productId}>
                    <td className="py-3.5 px-3 font-semibold text-ink font-sans">
                      {item.title}
                    </td>
                    <td className="py-3.5 px-3 text-center text-ink-soft">
                      {item.quantity}
                    </td>
                    <td className="py-3.5 px-3 text-right text-ink-soft">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-3 text-right font-bold text-ink">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end pt-2">
            <div className="w-full max-w-xs space-y-2 text-xs font-mono">
              <div className="flex justify-between text-ink-soft">
                <span>Subtotal</span>
                <span className="font-semibold text-ink">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-ink-soft">
                <span>Sales Tax (8%)</span>
                <span className="font-semibold text-ink">${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-ink-soft">
                <span>Insured Courier Dispatch</span>
                <span className="font-bold text-ink uppercase text-[10px]">FREE</span>
              </div>
              <div className="flex justify-between border-t-2 border-ink pt-3 text-sm">
                <span className="type-label font-bold text-ink">Total Amount Due</span>
                <span className="font-mono text-base font-black text-ink">${order.total.toFixed(2)} USD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bottom */}
        <div className="border-t-2 border-ink bg-backdrop/50 p-5 flex items-center justify-between flex-wrap gap-4">
          <Link
            href="/"
            className="type-label inline-flex items-center gap-1.5 text-xs text-ink-soft hover:text-ink transition-colors"
          >
            <span aria-hidden="true">←</span>
            <span>Return to Catalog</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => downloadInvoice(order)}
              className="type-label inline-flex items-center gap-2 bg-ink px-5 py-2.5 text-xs uppercase tracking-widest text-paper hover:bg-ink-soft transition-colors cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span>Download Invoice (.html)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
