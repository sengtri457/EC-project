"use client";

import Image from "next/image";
import Link from "next/link";
import { CartItem } from "@/types";
import { useCart } from "@/context/CartContext";
import { getProductById } from "@/data/products";

interface CartItemRowProps {
  item: CartItem;
}

export default function CartItemRow({ item }: CartItemRowProps) {
  const { updateQty, removeItem, toggleSelectItem } = useCart();
  const product = getProductById(item.productId);
  const maxStock = product ? product.stock : 99;

  const isSelected = item.selected !== false;
  const lineTotal = Number((item.price * item.quantity).toFixed(2));

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 border bg-paper shadow-xs transition-all ${
        isSelected
          ? "border-border hover:border-border-strong"
          : "border-border/60 bg-paper/60 opacity-75"
      }`}
    >
      {/* Product Image & Info with Checkbox */}
      <div className="flex items-center gap-4">
        {/* Selection Checkbox */}
        <label
          className="flex items-center justify-center cursor-pointer p-1 -m-1"
          title={isSelected ? "Unselect to checkout later" : "Select to checkout"}
        >
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => toggleSelectItem(item.productId)}
            aria-label={`Select ${item.title} for checkout`}
            className="h-4 w-4 rounded-none accent-ink cursor-pointer transition-transform active:scale-90"
          />
        </label>

        <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-backdrop p-2 border border-border">
          <Image
            src={item.thumbnail}
            alt={item.title}
            fill
            sizes="80px"
            className="object-contain"
          />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="type-display text-base text-ink line-clamp-1">
              {item.title}
            </span>
            {!isSelected && (
              <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 bg-backdrop text-ink-soft border border-border">
                Saved for later
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-ink-soft font-mono">
            Unit Price: <span className="font-semibold text-ink">${item.price.toFixed(2)}</span>
          </p>
          <span className="text-[11px] text-ink-soft font-mono">
            Available Batch: {maxStock} units
          </span>
        </div>
      </div>

      {/* Stepper, Total, and Remove */}
      <div className="flex items-center justify-between sm:justify-end gap-6 border-t border-border pt-3 sm:border-0 sm:pt-0">
        {/* Minimalist Stepper */}
        <div className="flex h-9 items-center border border-ink bg-paper">
          <button
            type="button"
            onClick={() => updateQty(item.productId, item.quantity - 1, maxStock)}
            disabled={item.quantity <= 1}
            aria-label="Decrease quantity"
            className="flex h-full w-8 items-center justify-center text-ink hover:text-ctrl-red disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-mono"
          >
            -
          </button>
          <span className="w-8 text-center text-xs font-mono font-bold text-ink">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={() => updateQty(item.productId, item.quantity + 1, maxStock)}
            disabled={item.quantity >= maxStock}
            aria-label="Increase quantity"
            className="flex h-full w-8 items-center justify-center text-ink hover:text-ctrl-red disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-mono"
          >
            +
          </button>
        </div>

        <div className="text-right min-w-20">
          <span
            className={`font-mono text-sm font-bold block ${
              isSelected ? "text-ink" : "text-ink-soft"
            }`}
          >
            ${lineTotal.toFixed(2)}
          </span>
          <button
            type="button"
            onClick={() => removeItem(item.productId)}
            className="mt-0.5 text-[11px] font-mono text-ink-soft hover:text-ctrl-red transition-colors underline"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
