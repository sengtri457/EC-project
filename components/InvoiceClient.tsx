"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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
          <p className="text-xs font-mono uppercase tracking-wider">Retrieving order invoice...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="border border-border bg-paper p-10 shadow-sm">
          <span className="type-label text-xs uppercase tracking-widest text-ctrl-red">
            Invoice Not Found
          </span>
          <h1 className="type-display mt-3 text-2xl font-bold tracking-tight text-ink">
            Order Reference &ldquo;{orderId}&rdquo; Not Found
          </h1>
          <p className="mt-2 text-xs leading-relaxed text-ink-soft font-mono max-w-sm mx-auto">
            Orders are committed to local client memory. If you cleared your browser storage or opened a new private session, the invoice may not be accessible.
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <Link
              href="/"
              className="type-label inline-flex items-center gap-2 bg-ink px-6 py-3 text-xs uppercase tracking-widest text-paper hover:bg-ink-soft transition-colors"
            >
              <span>Return to Catalog</span>
              <span aria-hidden="true">&rarr;</span>
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
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      {/* 3-Step Checkout Stepper */}
      <OrderStepper currentStep={3} />

      {/* Confirmation Banner */}
      <div className="mb-6 border border-border bg-paper p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sage/10 text-sage text-xs font-mono font-bold">
              ✓
            </div>
            <div>
              <h2 className="type-label text-xs uppercase tracking-wider text-ink font-semibold">
                Order Confirmed
              </h2>
              <p className="font-mono text-xs text-ink-soft mt-0.5">
                Cash payment of <strong className="text-ink font-semibold">${order.total.toFixed(2)} USD</strong> is due upon doorstep delivery.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => window.print()}
              className="type-label inline-flex items-center justify-center border border-border px-3.5 py-1.5 text-xs uppercase tracking-wider text-ink hover:border-ink hover:bg-canvas transition-colors cursor-pointer"
            >
              Print
            </button>
            <button
              type="button"
              onClick={() => downloadInvoice(order)}
              className="type-label inline-flex items-center justify-center gap-2 bg-ink px-4 py-1.5 text-xs uppercase tracking-wider text-paper hover:bg-ink-soft transition-colors cursor-pointer"
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
              <span>Download (.html)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Clean Minimal Luxury Invoice Card */}
      <div className="border border-border bg-paper shadow-sm">
        {/* Refined Minimalist Header */}
        <div className="border-b border-border p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 bg-canvas/40">
          <div className="flex items-center gap-3.5">
            <div className="relative h-8 w-10 shrink-0">
              <Image
                src="/images/logoDevs.png"
                alt="Clothes™ Logo"
                fill
                sizes="40px"
                className="object-contain"
              />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="type-display text-lg font-medium tracking-tight text-ink">
                  Clothes<span className="text-xs align-super font-sans text-ink-soft">™</span>
                </span>
                <span className="text-[11px] font-mono tracking-wider text-ink-soft uppercase">
                  Apparel Co.
                </span>
              </div>
              <p className="text-[11px] text-ink-soft tracking-wide mt-0.5">
                Accessible Conscious Luxury · Official Order Invoice
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:items-end text-left sm:text-right">
            <span className="inline-flex items-center rounded border border-terracotta/30 bg-terracotta/5 px-2 py-0.5 text-[10px] font-mono font-medium text-terracotta uppercase tracking-wider">
              Cash on Delivery
            </span>
            <p className="mt-1.5 font-mono text-xs font-semibold text-ink">
              {order.id}
            </p>
            <p className="font-mono text-[11px] text-ink-soft">{formattedDate}</p>
          </div>
        </div>

        {/* Details Grid - Clean & Minimal */}
        <div className="p-6 sm:p-8 space-y-7">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 border-b border-border pb-6">
            <div>
              <h3 className="text-[10px] font-mono uppercase tracking-widest text-ink-soft">
                Billed To
              </h3>
              <p className="mt-2 text-xs font-medium text-ink">
                {order.customer.name}
              </p>
              <p className="text-xs text-ink-soft mt-0.5">{order.customer.email}</p>
              <p className="text-xs font-mono text-ink-soft mt-0.5">{order.customer.phone}</p>
            </div>

            <div>
              <h3 className="text-[10px] font-mono uppercase tracking-widest text-ink-soft">
                Dispatch Destination
              </h3>
              <p className="mt-2 text-xs text-ink leading-relaxed whitespace-pre-line">
                {order.customer.address}
              </p>
            </div>

            <div>
              <h3 className="text-[10px] font-mono uppercase tracking-widest text-ink-soft">
                Delivery &amp; Care
              </h3>
              <p className="mt-2 text-xs text-ink">
                Doorstep Inspection Permitted
              </p>
              <p className="text-xs text-ink-soft mt-0.5">
                Concierge: concierge@clothes.com
              </p>
              <p className="text-[11px] text-sage font-medium mt-1">
                30-Day Hassle-Free Returns
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border font-mono text-[10px] font-medium uppercase tracking-wider text-ink-soft">
                <tr>
                  <th className="py-2.5 px-3">Item / Silhouette</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Unit Price</th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {order.items.map((item) => (
                  <tr key={item.productId} className="hover:bg-canvas/30 transition-colors">
                    <td className="py-3 px-3 font-medium text-ink font-sans">
                      {item.title}
                    </td>
                    <td className="py-3 px-3 text-center text-ink-soft font-mono">
                      {item.quantity}
                    </td>
                    <td className="py-3 px-3 text-right text-ink-soft font-mono">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right font-medium text-ink font-mono">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Breakdown */}
          <div className="flex justify-end pt-1">
            <div className="w-full max-w-xs space-y-2 text-xs font-mono">
              <div className="flex justify-between text-ink-soft">
                <span>Subtotal</span>
                <span className="font-medium text-ink">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-ink-soft">
                <span>Estimated Sales Tax (8%)</span>
                <span className="font-medium text-ink">${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-ink-soft">
                <span>Standard Shipping</span>
                <span className="font-medium text-sage uppercase text-[10px]">FREE</span>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-sm">
                <span className="font-medium text-ink font-sans">Total Payable</span>
                <span className="font-mono text-base font-semibold text-ink">${order.total.toFixed(2)} USD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bottom */}
        <div className="border-t border-border bg-canvas/30 p-4 sm:p-5 flex items-center justify-between flex-wrap gap-4">
          <Link
            href="/"
            className="type-label inline-flex items-center gap-1.5 text-xs text-ink-soft hover:text-ink transition-colors"
          >
            <span aria-hidden="true">&larr;</span>
            <span>Return to Catalog</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => downloadInvoice(order)}
              className="type-label inline-flex items-center gap-2 bg-ink px-4 py-2 text-xs uppercase tracking-wider text-paper hover:bg-ink-soft transition-colors cursor-pointer"
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
