"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import { createSwingSystem, SwingSystem } from "@/lib/swing-system";

interface ClothingRackProps {
  products: Product[];
}

export default function ClothingRack({ products }: ClothingRackProps) {
  const router = useRouter();
  const rackRef = useRef<HTMLDivElement>(null);
  const swingSystemRef = useRef<SwingSystem | null>(null);
  const [leavingSlug, setLeavingSlug] = useState<string | null>(null);

  useEffect(() => {
    if (!rackRef.current || products.length === 0) return;

    const system = createSwingSystem(rackRef.current, {
      entrance: true,
      draught: true,
      stiffness: 60,
      damping: 2.4,
    });
    swingSystemRef.current = system;

    return () => {
      system.destroy();
    };
  }, [products]);

  const handlePointerEnter = (
    index: number,
    event?: React.PointerEvent<HTMLAnchorElement>
  ) => {
    const dir = event && event.movementX < 0 ? 1 : -1;
    swingSystemRef.current?.push(index, 30 * dir);
  };

  const handleGarmentClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    productId: number
  ) => {
    e.preventDefault();
    setLeavingSlug(String(productId));
    setTimeout(() => {
      router.push(`/products/${productId}`);
    }, 380);
  };

  return (
    <section className="studio-sweep flex min-h-svh flex-col overflow-x-clip px-[clamp(1rem,4vw,3.5rem)] pt-[clamp(1.25rem,3vw,2.5rem)]">
      {/* Top Editorial Subhead */}
      <header className="flex items-start justify-between">
        <p className="intro intro-from-left type-label text-[clamp(0.95rem,1.5vw,1.25rem)]">
          Limited
          <br />
          Release
        </p>
        <p className="intro intro-from-right type-label text-right text-[clamp(0.95rem,1.5vw,1.25rem)]">
          June
          <br />
          2026
        </p>
      </header>

      {/* Hero Title & Spark */}
      <div className="mt-[clamp(0.5rem,2vw,1.5rem)] flex flex-col items-center text-center">
        <svg
          viewBox="0 0 48 24"
          fill="currentColor"
          aria-hidden="true"
          className="intro intro-spark h-[clamp(0.9rem,1.6vw,1.35rem)] w-auto text-ink"
          style={{ "--d": "120ms" } as React.CSSProperties}
        >
          <path d="M10 5C10.84 11.16 10.84 11.16 17 12C10.84 12.84 10.84 12.84 10 19C9.16 12.84 9.16 12.84 3 12C9.16 11.16 9.16 11.16 10 5Z" />
          <path d="M24 1C25.32 10.68 25.32 10.68 35 12C25.32 13.32 25.32 13.32 24 23C22.68 13.32 22.68 13.32 13 12C22.68 10.68 22.68 10.68 24 1Z" />
          <path d="M38 5C38.84 11.16 38.84 11.16 45 12C38.84 12.84 38.84 12.84 38 19C37.16 12.84 37.16 12.84 31 12C37.16 11.16 37.16 11.16 38 5Z" />
        </svg>

        <h1 className="intro-title type-display mt-[clamp(0.75rem,1.6vw,1.25rem)] text-[clamp(2.75rem,8.4vw,6rem)] text-balance">
          <span className="intro-word" style={{ "--d": "200ms" } as React.CSSProperties}>
            The
          </span>{" "}
          <span className="intro-word" style={{ "--d": "310ms" } as React.CSSProperties}>
            New
          </span>{" "}
          <span className="intro-word" style={{ "--d": "420ms" } as React.CSSProperties}>
            Era
          </span>
        </h1>

        <p
          className="intro intro-soft mt-[clamp(0.75rem,1.4vw,1.1rem)] max-w-[40ch] text-[clamp(1rem,1.5vw,1.25rem)] leading-snug text-ink-soft text-balance"
          style={{ "--d": "620ms" } as React.CSSProperties}
        >
          A new chapter of elevated essentials and statement silhouettes.
        </p>
      </div>

      {/* Kinetic Clothes Rail */}
      <div className="mt-[clamp(1.5rem,3.5vh,2.75rem)] flex-1">
        <div ref={rackRef} className="rack min-h-[40vh]">
          <div className="rail" aria-hidden="true" />

          <div className="rack-row">
            {products.map((product, idx) => {
              const isLeaving = leavingSlug === String(product.id);
              const width = product.imageWidth || 680;

              return (
                <div
                  key={product.id}
                  data-cell="true"
                  className="rack-cell"
                  style={
                    {
                      "--i": idx,
                      "--w": width,
                    } as React.CSSProperties
                  }
                >
                  <a
                    href={`/products/${product.id}`}
                    onClick={(e) => handleGarmentClick(e, product.id)}
                    onPointerEnter={(e) => handlePointerEnter(idx, e)}
                    onFocus={() => handlePointerEnter(idx)}
                    className="garment group cursor-pointer"
                    data-leaving={isLeaving ? "true" : undefined}
                    aria-label={`View ${product.title} on hanger, ${product.fabric || product.category}`}
                  >
                    <span data-swing="true" className="garment-swing">
                      <Image
                        src={product.thumbnail}
                        width={product.imageWidth || 682}
                        height={product.imageHeight || 961}
                        alt={`${product.title} on hanger`}
                        priority={idx < 2}
                        className="garment-img"
                        sizes="(min-width: 1024px) 25vw, (min-width: 768px) 35vw, 50vw"
                      />
                    </span>

                    {/* Tactile Swing Tag on Red Thread */}
                    <div className="tag" aria-hidden="true">
                      <div className="tag-thread" />
                      <div className="tag-card">
                        <span className="type-label text-[10px] tracking-wider text-ink-soft block">
                          {product.category}
                        </span>
                        <p className="type-label text-sm mt-1 leading-tight text-ink font-extrabold">
                          {product.title}
                        </p>
                        <p className="text-xs text-ink-soft mt-1 font-mono">
                          ${product.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </a>

                  {/* Dynamic Floor Shadow */}
                  <span
                    data-shadow="true"
                    className="floor-shadow"
                    aria-hidden="true"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hero Bottom Navigation Bar */}
      <footer
        className="intro intro-soft grid grid-cols-[auto_1fr_auto] items-end gap-4 pb-[clamp(1.25rem,3vw,2.25rem)] pt-6"
        style={{ "--d": "1250ms" } as React.CSSProperties}
      >
        <p className="type-label text-[clamp(0.95rem,1.5vw,1.25rem)]">
          Never
          <br />
          Basic
        </p>

        <p className="text-center text-[0.95rem] leading-snug text-ink-soft">
          <span className="hidden sm:inline">
            Designed for those who never follow the crowd.
            <br />
          </span>
          Tap a piece on the rail to take it to checkout.
        </p>

        <a
          href="#pieces"
          className="type-label col-start-3 text-right text-[clamp(0.95rem,1.5vw,1.25rem)] underline-offset-4 decoration-2 decoration-ctrl-red transition-colors hover:text-ctrl-red focus-visible:underline focus-visible:outline-none"
        >
          Shop
          <br />
          Now
        </a>
      </footer>
    </section>
  );
}
