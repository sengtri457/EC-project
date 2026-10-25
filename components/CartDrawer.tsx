"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { toKhr } from "@/lib/cambodiaLocations";

export default function CartDrawer() {
  const {
    items,
    itemCount,
    subtotal,
    isDrawerOpen,
    closeDrawer,
    updateQty,
    removeItem,
  } = useCart();

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDrawerOpen) {
        closeDrawer();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  // Lock body scroll when open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Slide-over panel */}
      <div className="relative z-10 flex h-[100dvh] w-full max-w-md flex-col bg-paper border-l border-border shadow-2xl transition-transform duration-300">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="type-label text-xs uppercase tracking-widest text-ink font-semibold">
              Shopping Bag
            </span>
            <span className="font-mono text-xs text-ink-soft">
              ({itemCount} {itemCount === 1 ? "item" : "items"})
            </span>
          </div>
          <button
            onClick={closeDrawer}
            className="p-1.5 text-ink-soft hover:text-ink transition-colors cursor-pointer"
            aria-label="Close bag"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Free shipping banner */}
        <div className="bg-canvas px-6 py-2.5 text-center text-[11px] font-mono text-ink-soft border-b border-border">
          {subtotal >= 30 ? (
            <span className="text-forest font-medium">✓ You qualify for Free Delivery in Phnom Penh</span>
          ) : (
            <span>
              Add <strong className="text-ink font-semibold">${(30 - subtotal).toFixed(2)}</strong> more for free delivery in Phnom Penh
            </span>
          )}
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-border">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center py-12">
              <span className="font-serif text-2xl text-ink-soft/40 italic">Your bag is empty</span>
              <p className="mt-2 text-xs font-mono text-ink-soft">Discover our catalog and select your pieces.</p>
              <button
                onClick={closeDrawer}
                className="mt-6 border border-ink px-5 py-2 text-xs font-mono uppercase tracking-wider text-ink hover:bg-ink hover:text-paper transition-all cursor-pointer"
              >
                Continue Browsing
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.productId} className="py-4 flex gap-4">
                <div className="relative h-20 w-20 shrink-0 border border-border bg-backdrop p-2 flex items-center justify-center">
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    sizes="80px"
                    className="object-contain p-1"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-xs font-medium text-ink line-clamp-1">{item.title}</h4>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-ink-soft hover:text-ctrl-red transition-colors cursor-pointer p-0.5"
                        title="Remove piece"
                        aria-label={`Remove ${item.title}`}
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <span className="font-mono text-xs text-ink-soft mt-0.5 block">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-border bg-paper">
                      <button
                        type="button"
                        onClick={() => updateQty(item.productId, item.quantity - 1)}
                        className="h-7 w-7 flex items-center justify-center text-xs text-ink hover:bg-canvas transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="h-7 w-8 flex items-center justify-center text-xs font-mono text-ink border-x border-border">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQty(item.productId, item.quantity + 1)}
                        className="h-7 w-7 flex items-center justify-center text-xs text-ink hover:bg-canvas transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-mono text-xs font-semibold text-ink">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer actions */}
        {items.length > 0 && (
          <div className="border-t border-border bg-paper p-6 space-y-4">
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-ink-soft">
                <span>Subtotal</span>
                <div className="text-right">
                  <span className="text-ink font-semibold">${subtotal.toFixed(2)} USD</span>
                  <span className="text-[10px] text-ink-soft block">≈ {toKhr(subtotal)}</span>
                </div>
              </div>
              <div className="flex justify-between text-ink-soft text-[11px]">
                <span>Cambodia Delivery</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link
                href="/cart"
                onClick={closeDrawer}
                className="type-label flex items-center justify-center border border-ink py-3 text-xs uppercase tracking-widest text-ink hover:bg-canvas transition-colors text-center"
              >
                Review Bag
              </Link>
              <Link
                href="/checkout"
                onClick={closeDrawer}
                className="type-label flex items-center justify-center bg-ink py-3 text-xs uppercase tracking-widest text-paper hover:bg-ink-soft transition-colors text-center font-semibold"
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
