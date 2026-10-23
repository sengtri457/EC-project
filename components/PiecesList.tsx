"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { createSwingSystem, SwingSystem } from "@/lib/swing-system";

interface PiecesListProps {
  products: Product[];
}

export default function PiecesList({ products }: PiecesListProps) {
  const listRef = useRef<HTMLOListElement>(null);
  const swingRef = useRef<SwingSystem | null>(null);

  useEffect(() => {
    if (!listRef.current || products.length === 0) return;

    const system = createSwingSystem(listRef.current, {
      entrance: false,
      draught: false,
      stiffness: 60,
      damping: 2.4,
    });
    swingRef.current = system;

    return () => system.destroy();
  }, [products]);

  const handlePointerEnter = (
    idx: number,
    e?: React.PointerEvent<HTMLAnchorElement>
  ) => {
    const dir = e && e.movementX < 0 ? 1 : -1;
    swingRef.current?.push(idx, 28 * dir);
  };

  return (
    <section
      id="pieces"
      aria-labelledby="pieces-title"
      className="scroll-mt-4 bg-backdrop px-[clamp(1rem,4vw,3.5rem)] pt-[clamp(4rem,10vw,8rem)] pb-[clamp(3rem,6vw,5rem)]"
    >
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3 border-b-2 border-ink pb-5">
        <h2 id="pieces-title" className="type-display text-[clamp(2rem,5vw,3.75rem)]">
          The pieces
        </h2>
        <p className="max-w-[34ch] text-sm text-ink-soft leading-relaxed">
          Four statement silhouettes, one limited release. Handcrafted tailoring &amp; heavyweight raw knitwear.
        </p>
      </div>

      <ol ref={listRef} className="divide-y divide-ink/20">
        {products.map((piece, idx) => {
          return (
            <li key={piece.id} data-cell="true">
              <Link
                href={`/products/${piece.id}`}
                onPointerEnter={(e) => handlePointerEnter(idx, e)}
                onFocus={() => handlePointerEnter(idx)}
                className="group grid grid-cols-[4rem_1fr_auto] items-center gap-x-5 gap-y-1 py-5 outline-none transition-colors hover:bg-backdrop-hi/70 focus-visible:bg-backdrop-hi/70 md:grid-cols-[6rem_1.3fr_1fr_8rem_auto] md:gap-x-8 px-2 -mx-2 rounded-sm"
              >
                {/* Hanger Thumbnail */}
                <span className="flex h-[5.5rem] items-start justify-center md:h-[6.5rem]">
                  <span data-swing="true" className="garment-swing h-full">
                    <Image
                      src={piece.thumbnail}
                      width={piece.imageWidth || 682}
                      height={piece.imageHeight || 961}
                      alt={piece.title}
                      sizes="6rem"
                      className="h-full w-auto object-contain"
                    />
                  </span>
                </span>

                {/* Title & Category */}
                <span className="min-w-0">
                  <span className="text-xs uppercase tracking-wider text-ink-soft block font-medium">
                    {piece.category}
                  </span>
                  <span className="type-display text-lg tracking-tight text-ink group-hover:text-ctrl-red transition-colors md:text-xl block mt-0.5">
                    {piece.title}
                  </span>
                </span>

                {/* Fabric Specification */}
                <span className="hidden text-xs text-ink-soft md:block font-sans max-w-[30ch]">
                  {piece.fabric || piece.description}
                </span>

                {/* Price */}
                <span className="text-sm font-semibold text-ink font-mono text-right md:text-left">
                  ${piece.price.toFixed(2)}
                </span>

                {/* Action Arrow */}
                <span className="type-label text-xs uppercase tracking-widest text-ink group-hover:text-ctrl-red group-hover:translate-x-1 transition-all flex items-center gap-1">
                  Fit &amp; Buy <span aria-hidden="true">→</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
