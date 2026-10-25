"use client";

import { useState, useRef, useEffect } from "react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { addItem, items } = useCart();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyBar(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const isOutOfStock = product.stock <= 0;
  const currentInCart = items.find((i) => i.productId === product.id)?.quantity || 0;
  const remainingStock = Math.max(0, product.stock - currentInCart);

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrement = () => {
    setQuantity((prev) => Math.min(product.stock, prev + 1));
  };

  const handleAddToCart = () => {
    if (isOutOfStock || quantity < 1) return;
    addItem(
      {
        productId: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
      },
      quantity,
      product.stock
    );
  };

  return (
    <div ref={containerRef} className="space-y-4">
      {/* Stock status indicator */}
      <div className="flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              isOutOfStock
                ? "bg-ink"
                : remainingStock <= 5
                ? "bg-ctrl-red"
                : "bg-ink"
            }`}
          />
          <span className="text-ink">
            {isOutOfStock
              ? "Sold Out in Batch"
              : remainingStock <= 5
              ? `Limited Inventory — Only ${remainingStock} Available`
              : "In Stock — Ready for Insured Dispatch"}
          </span>
        </div>

        {currentInCart > 0 && (
          <span className="text-[11px] text-ctrl-red font-bold">
            {currentInCart} currently in bag
          </span>
        )}
      </div>

      {/* Action controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Minimalist Stepper */}
        <div className="flex h-12 items-center border border-ink bg-paper">
          <button
            type="button"
            onClick={handleDecrement}
            disabled={isOutOfStock || quantity <= 1}
            aria-label="Decrease quantity"
            className="flex h-full w-12 items-center justify-center text-ink transition-colors hover:text-ctrl-red disabled:opacity-30 disabled:cursor-not-allowed font-mono text-base font-bold"
          >
            -
          </button>
          <span className="w-10 text-center font-mono text-sm font-bold text-ink">
            {quantity}
          </span>
          <button
            type="button"
            onClick={handleIncrement}
            disabled={isOutOfStock || quantity >= remainingStock}
            aria-label="Increase quantity"
            className="flex h-full w-12 items-center justify-center text-ink transition-colors hover:text-ctrl-red disabled:opacity-30 disabled:cursor-not-allowed font-mono text-base font-bold"
          >
            +
          </button>
        </div>

        {/* Add to Bag Button */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock || remainingStock <= 0}
          className="type-label flex h-12 flex-1 items-center justify-center gap-2 bg-ink px-6 text-xs text-paper uppercase tracking-widest shadow-sm transition-all hover:bg-ink-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ctrl-red disabled:bg-ink/40 disabled:cursor-not-allowed active:scale-[0.99]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <span>
            {isOutOfStock || remainingStock <= 0
              ? "Unavailable"
              : `Add to Bag • $${(product.price * quantity).toFixed(2)}`}
          </span>
        </button>
      </div>
      {/* Sticky Mobile Purchase Bar (Appears when primary button scrolls out of view) */}
      {showStickyBar && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-paper/95 backdrop-blur-md px-4 py-3 shadow-xl sm:hidden animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="type-display text-xs text-ink truncate font-semibold">
                {product.title}
              </p>
              <p className="text-xs font-mono font-bold text-terracotta mt-0.5">
                ${product.price.toFixed(2)} USD
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock || remainingStock <= 0}
              className="type-label h-11 px-5 bg-ink text-paper text-xs uppercase tracking-wider font-semibold shadow-sm hover:bg-ink-soft active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
            >
              <span>Add to Bag</span>
              <span>•</span>
              <span>${(product.price * quantity).toFixed(2)}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
