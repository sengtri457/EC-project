"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Product, ProductVariant } from "@/types";
import { useCart, getCartItemKey } from "@/context/CartContext";

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { addItem, items } = useCart();

  // Determine available sizes from variants or sizes array
  const availableSizes = useMemo(() => {
    if (product.variants && product.variants.length > 0) {
      const sizes = product.variants.map((v) => v.size).filter((s): s is string => Boolean(s));
      return Array.from(new Set(sizes));
    }
    return product.sizes || [];
  }, [product]);

  // Determine initial selected size: pick first with stock if available, else first size
  const initialSize = useMemo(() => {
    if (availableSizes.length === 0) return null;
    if (product.variants && product.variants.length > 0) {
      const inStockVariant = product.variants.find((v) => v.stock > 0 && v.size);
      if (inStockVariant?.size) return inStockVariant.size;
    }
    return availableSizes[0];
  }, [availableSizes, product.variants]);

  const [selectedSize, setSelectedSize] = useState<string | null>(initialSize);
  const [sizeError, setSizeError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Active variant resolution
  const selectedVariant = useMemo<ProductVariant | undefined>(() => {
    if (!product.variants || product.variants.length === 0) return undefined;
    if (selectedSize) {
      return product.variants.find((v) => v.size === selectedSize);
    }
    return product.variants[0];
  }, [product.variants, selectedSize]);

  // Active stock calculation
  const variantStock = selectedVariant ? selectedVariant.stock : product.stock;
  const isOutOfStock = variantStock <= 0;

  // Cart quantity check for this exact variant
  const activeItemKey = selectedVariant
    ? `${product.id}-${selectedVariant.id}-${selectedSize || ""}`
    : `${product.id}`;

  const currentInCart = useMemo(() => {
    const existing = items.find((i) => {
      if (selectedVariant) {
        return (
          i.productId === product.id &&
          (i.variantId === selectedVariant.id || i.selectedSize === selectedSize)
        );
      }
      return i.productId === product.id;
    });
    return existing?.quantity || 0;
  }, [items, product.id, selectedVariant, selectedSize]);

  const remainingStock = Math.max(0, variantStock - currentInCart);

  // Adjust quantity when remainingStock changes
  useEffect(() => {
    if (remainingStock <= 0) {
      setQuantity(1);
    } else if (quantity > remainingStock) {
      setQuantity(remainingStock);
    }
  }, [remainingStock, quantity]);

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

  const handleSelectSize = (size: string) => {
    setSelectedSize(size);
    setSizeError(false);
    setQuantity(1);
  };

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrement = () => {
    setQuantity((prev) => Math.min(remainingStock, prev + 1));
  };

  const handleAddToCart = () => {
    if (availableSizes.length > 0 && !selectedSize) {
      setSizeError(true);
      return;
    }

    if (isOutOfStock || remainingStock <= 0 || quantity < 1) return;

    addItem(
      {
        id: activeItemKey,
        productId: product.id,
        variantId: selectedVariant?.id,
        sku: selectedVariant?.sku || `CLO-${product.id.toString().padStart(4, "0")}`,
        selectedSize: selectedSize || undefined,
        title: product.title,
        price: selectedVariant?.price ?? product.price,
        thumbnail: selectedVariant?.thumbnail || product.thumbnail,
      },
      quantity,
      variantStock
    );
  };

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Size Selection Section */}
      {availableSizes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="type-label uppercase tracking-wider text-ink font-semibold">
              Select Size:{" "}
              {selectedSize ? (
                <span className="text-ctrl-red font-bold">{selectedSize}</span>
              ) : (
                <span className="text-ink-soft">Required</span>
              )}
            </span>
            <span className="text-ink-soft text-[11px] underline underline-offset-2 cursor-pointer hover:text-ink">
              Fit &amp; Size Guide
            </span>
          </div>

          {/* Size Pills Grid */}
          <div className="flex flex-wrap gap-2.5">
            {availableSizes.map((size) => {
              const variantForSize = product.variants?.find((v) => v.size === size);
              const sizeStock = variantForSize ? variantForSize.stock : product.stock;
              const isSizeSoldOut = sizeStock <= 0;
              const isSelected = selectedSize === size;
              const isLowStock = sizeStock > 0 && sizeStock <= 3;

              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSelectSize(size)}
                  disabled={isSizeSoldOut}
                  aria-label={`Size ${size}${isSizeSoldOut ? " (Sold Out)" : ""}`}
                  className={`relative flex h-11 min-w-[50px] items-center justify-center px-4 border text-xs font-mono font-bold transition-all ${
                    isSelected
                      ? "border-ink bg-ink text-paper shadow-xs scale-102"
                      : isSizeSoldOut
                      ? "border-border/50 bg-backdrop text-ink/30 line-through cursor-not-allowed"
                      : "border-border bg-paper text-ink hover:border-ink hover:bg-canvas"
                  }`}
                >
                  <span>{size}</span>
                  {/* Micro indicator for low stock */}
                  {isLowStock && !isSizeSoldOut && (
                    <span
                      title={`Only ${sizeStock} pieces left in ${size}`}
                      className={`absolute -top-1 -right-1 h-2 w-2 rounded-full ${
                        isSelected ? "bg-paper ring-1 ring-ink" : "bg-ctrl-red"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Validation Alert */}
          {sizeError && (
            <p className="text-xs font-mono text-ctrl-red font-semibold animate-pulse">
              * Please choose a size before adding to bag.
            </p>
          )}
        </div>
      )}

      {/* Stock status indicator */}
      <div className="flex items-center justify-between text-xs font-mono border-t border-border pt-4">
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              isOutOfStock
                ? "bg-ink"
                : remainingStock <= 3
                ? "bg-ctrl-red"
                : "bg-forest"
            }`}
          />
          <span className="text-ink">
            {isOutOfStock
              ? selectedSize
                ? `Size ${selectedSize} is Sold Out`
                : "Sold Out in Batch"
              : remainingStock <= 3
              ? `Limited Inventory — Only ${remainingStock} Available in ${selectedSize || "Batch"}`
              : `In Stock (${variantStock} units) — Ready for Insured Dispatch`}
          </span>
        </div>

        {currentInCart > 0 && (
          <span className="text-[11px] text-ctrl-red font-bold">
            {currentInCart} in bag
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
            className="flex h-full w-12 items-center justify-center text-ink transition-colors hover:text-ctrl-red disabled:opacity-30 disabled:cursor-not-allowed font-mono text-base font-bold cursor-pointer"
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
            className="flex h-full w-12 items-center justify-center text-ink transition-colors hover:text-ctrl-red disabled:opacity-30 disabled:cursor-not-allowed font-mono text-base font-bold cursor-pointer"
          >
            +
          </button>
        </div>

        {/* Add to Bag Button */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock || remainingStock <= 0}
          className="type-label flex h-12 flex-1 items-center justify-center gap-2 bg-ink px-6 text-xs text-paper uppercase tracking-widest shadow-sm transition-all hover:bg-ink-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ctrl-red disabled:bg-ink/40 disabled:cursor-not-allowed active:scale-[0.99] cursor-pointer"
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
              ? selectedSize
                ? `Sold Out in ${selectedSize}`
                : "Unavailable"
              : `Add to Bag • $${((selectedVariant?.price ?? product.price) * quantity).toFixed(2)}`}
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
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-mono font-bold text-terracotta">
                  ${((selectedVariant?.price ?? product.price) * quantity).toFixed(2)} USD
                </span>
                {selectedSize && (
                  <span className="text-[10px] font-mono uppercase bg-backdrop px-1.5 py-0.5 border border-border text-ink font-semibold">
                    Size: {selectedSize}
                  </span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock || remainingStock <= 0}
              className="type-label h-11 px-5 bg-ink text-paper text-xs uppercase tracking-wider font-semibold shadow-sm hover:bg-ink-soft active:scale-95 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-40"
            >
              <span>Add to Bag</span>
              <span>•</span>
              <span>${((selectedVariant?.price ?? product.price) * quantity).toFixed(2)}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
