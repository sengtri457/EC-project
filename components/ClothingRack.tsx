"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import { createSwingSystem, SwingSystem } from "@/lib/swing-system";
import {
  CAPSULE_CATEGORIES,
  getAllCapsuleProducts,
  CapsuleCategory,
} from "@/data/products";

interface ClothingRackProps {
  products?: Product[];
}

export default function ClothingRack({ products }: ClothingRackProps) {
  const router = useRouter();
  const rackRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const swingSystemRef = useRef<SwingSystem | null>(null);
  const isProgrammaticScrollRef = useRef<boolean>(false);

  const [activeCapsuleId, setActiveCapsuleId] = useState<string>("core");
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);
  const [leavingSlug, setLeavingSlug] = useState<string | null>(null);

  // 4 capsules × 4 unique products = 16 total hanging garments
  const capsuleGroups = getAllCapsuleProducts();

  const currentCapsule: CapsuleCategory =
    CAPSULE_CATEGORIES.find((c) => c.id === activeCapsuleId) ||
    CAPSULE_CATEGORIES[0];

  // Initialize swing physics on the normal rack
  useEffect(() => {
    if (!rackRef.current) return;

    const timer = setTimeout(() => {
      if (!rackRef.current) return;
      const system = createSwingSystem(rackRef.current, {
        entrance: true,
        draught: true,
        stiffness: 60,
        damping: 2.4,
      });
      swingSystemRef.current = system;
    }, 40);

    return () => {
      clearTimeout(timer);
      swingSystemRef.current?.destroy();
      swingSystemRef.current = null;
    };
  }, []);

  // Update arrow buttons state
  const updateScrollState = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 20);
    setCanScrollRight(el.scrollLeft < maxScroll - 20);
  }, []);

  // Dynamic ScrollSpy: detect which capsule is currently centered on the rack
  const handleScroll = useCallback(() => {
    updateScrollState();

    if (isProgrammaticScrollRef.current) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const viewportCenterX = containerRect.left + containerRect.width / 2;

    let closestId = capsuleGroups[0].capsule.id;
    let minDistance = Infinity;

    capsuleGroups.forEach((group) => {
      const el = document.getElementById(`rack-section-${group.capsule.id}`);
      if (el) {
        const rect = el.getBoundingClientRect();
        const elCenter = rect.left + rect.width / 2;
        const dist = Math.abs(viewportCenterX - elCenter);
        if (dist < minDistance) {
          minDistance = dist;
          closestId = group.capsule.id;
        }
      }
    });

    if (closestId && closestId !== activeCapsuleId) {
      setActiveCapsuleId(closestId);
    }
  }, [capsuleGroups, activeCapsuleId, updateScrollState]);

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
  }, [updateScrollState]);

  // Click tab: smoothly slide clothes along the fixed rail directly to that capsule
  const handleTabClick = (capsuleId: string) => {
    isProgrammaticScrollRef.current = true;
    setActiveCapsuleId(capsuleId);

    const container = scrollContainerRef.current;
    const target = document.getElementById(`rack-section-${capsuleId}`);

    if (container && target) {
      const targetLeft =
        target.offsetLeft - (container.clientWidth > 768 ? 48 : 16);
      container.scrollTo({
        left: Math.max(0, targetLeft),
        behavior: "smooth",
      });
    }

    setTimeout(() => {
      isProgrammaticScrollRef.current = false;
      updateScrollState();
    }, 550);
  };

  // Arrow button clicks
  const handleScrollBy = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const distance = container.clientWidth * 0.7;
    container.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });
  };

  // Wheel horizontal mapping
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += e.deltaY * 0.9;
    }
  };

  const handlePointerEnter = (
    index: number,
    event?: React.PointerEvent<HTMLAnchorElement>,
  ) => {
    const dir = event && event.movementX < 0 ? 1 : -1;
    swingSystemRef.current?.push(index, 28 * dir);
  };

  const handleGarmentClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    productId: number,
  ) => {
    e.preventDefault();
    setLeavingSlug(String(productId));
    setTimeout(() => {
      router.push(`/products/${productId}`);
    }, 380);
  };

  let globalItemIdx = 0;

  return (
    <section className="studio-sweep relative flex min-h-[85vh] sm:min-h-[92vh] flex-col justify-between overflow-x-clip px-[clamp(1rem,4vw,3.5rem)] pt-6 sm:pt-8 pb-6">
      {/* Soft Ambient Studio Spotlight on the Wall */}
      <div className="studio-spotlight-backdrop" aria-hidden="true" />

      {/* Refined Minimalist Atelier Header */}
      <div className="flex flex-col items-center text-center px-4 relative z-10 max-w-2xl mx-auto">
        {/* Dynamic Capsule Badge */}
        <span className="font-mono text-[10px] tracking-widest uppercase text-terracotta bg-terracotta/5 border border-terracotta/20 px-3 py-1 rounded-full mb-2 inline-flex items-center gap-1.5 transition-all duration-300">
          <span className="h-1.5 w-1.5 rounded-full bg-terracotta animate-pulse" />
          {currentCapsule.badge}
        </span>

        {/* Display Title */}
        <h1 className="type-display text-[clamp(2rem,4vw,3.5rem)] font-normal tracking-tight text-ink text-balance leading-[1.1]">
          Minimalism In <span className="block sm:inline">Everyday Wear</span>
        </h1>

        {/* Dynamic Editorial Subtitle */}
        <p className="mt-2 text-xs sm:text-sm text-ink-soft max-w-md text-balance leading-relaxed min-h-[2.5rem] flex items-center justify-center transition-opacity duration-300">
          {currentCapsule.subtitle}
        </p>

        {/* Capsule Navigation Tabs (ScrollSpy Synced) */}
        <div
          role="tablist"
          aria-label="Collection capsules"
          className="mt-6 inline-flex max-w-full items-center gap-1.5 sm:gap-2.5 p-1 sm:p-1.5 rounded-full border border-border/80 bg-paper/90 backdrop-blur-xs shadow-xs overflow-x-auto"
        >
          {CAPSULE_CATEGORIES.map((capsule) => {
            const isActive = activeCapsuleId === capsule.id;
            return (
              <button
                key={capsule.id}
                role="tab"
                type="button"
                aria-selected={isActive}
                onClick={() => handleTabClick(capsule.id)}
                className={`group relative flex items-center gap-1.5 sm:gap-2 rounded-full px-3.5 sm:px-4.5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-mono tracking-wider whitespace-nowrap transition-all duration-200 cursor-pointer select-none ${
                  isActive
                    ? "bg-[#1a1a1a] text-[#ffffff] shadow-sm font-medium"
                    : "text-ink-soft hover:text-ink hover:bg-surface/80"
                }`}
              >
                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-terracotta shrink-0 animate-pulse" />
                )}
                <span className={isActive ? "text-[#ffffff]" : ""}>
                  {capsule.name}
                </span>
                <span
                  className={`text-[10px] ${
                    isActive ? "text-white/70" : "text-ink-soft/70"
                  }`}
                >
                  ({capsule.productIds.length})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Normal Physical Clothes Rack with Horizontal Sliding Hangers */}
      <div className="relative z-10 mt-6 sm:mt-10 py-4 sm:py-8">
        {/* Floating Left Navigation Arrow Button */}
        {canScrollLeft && (
          <button
            type="button"
            aria-label="Slide left on rail"
            onClick={() => handleScrollBy("left")}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-30 h-10 w-10 sm:h-11 sm:w-11 rounded-full border border-border bg-paper/90 backdrop-blur-sm shadow-md flex items-center justify-center text-ink hover:bg-charcoal hover:text-white transition-all cursor-pointer"
          >
            <span className="text-sm font-mono">&larr;</span>
          </button>
        )}

        {/* Floating Right Navigation Arrow Button */}
        {canScrollRight && (
          <button
            type="button"
            aria-label="Slide right on rail"
            onClick={() => handleScrollBy("right")}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-30 h-10 w-10 sm:h-11 sm:w-11 rounded-full border border-border bg-paper/90 backdrop-blur-sm shadow-md flex items-center justify-center text-ink hover:bg-charcoal hover:text-white transition-all cursor-pointer"
          >
            <span className="text-sm font-mono">&rarr;</span>
          </button>
        )}

        {/* Normal Physical Rack Frame */}
        <div ref={rackRef} className="rack min-h-[36vh] relative">
          {/* Stationary Chrome Rail spanning across the screen */}
          <div className="rail" aria-hidden="true" />

          {/* Hangers Sliding Horizontally Along the Rail */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            onWheel={handleWheel}
            className="rack-slider-viewport scrollbar-none"
          >
            <div className="rack-slider-track">
              {capsuleGroups.map((group) => (
                <div
                  key={group.capsule.id}
                  id={`rack-section-${group.capsule.id}`}
                  data-capsule-section={group.capsule.id}
                  className="flex items-stretch gap-6 sm:gap-10 snap-start"
                >
                  {group.products.map((product) => {
                    const currentIdx = globalItemIdx++;
                    const isLeaving = leavingSlug === String(product.id);
                    const isTrouser =
                      product.title.toLowerCase().includes("denim") ||
                      product.title.toLowerCase().includes("trouser") ||
                      product.title.toLowerCase().includes("pant") ||
                      product.title.toLowerCase().includes("chino");
                    const defaultWidth = isTrouser ? 620 : 670;
                    const width = Math.max(
                      product.imageWidth || defaultWidth,
                      isTrouser ? 620 : 650,
                    );

                    return (
                      <div
                        key={product.id}
                        data-cell="true"
                        className="rack-cell"
                        style={
                          {
                            "--i": currentIdx,
                            "--w": width,
                          } as React.CSSProperties
                        }
                      >
                        <a
                          href={`/products/${product.id}`}
                          onClick={(e) => handleGarmentClick(e, product.id)}
                          onPointerEnter={(e) => handlePointerEnter(currentIdx, e)}
                          onFocus={() => handlePointerEnter(currentIdx)}
                          className="garment group cursor-pointer"
                          data-leaving={isLeaving ? "true" : undefined}
                          aria-label={`View ${product.title} on hanger, ${
                            product.fabric || product.category
                          }`}
                        >
                          <span data-swing="true" className="garment-swing">
                            <Image
                              src={product.thumbnail}
                              width={product.imageWidth || 682}
                              height={product.imageHeight || 961}
                              alt={`${product.title} on hanger`}
                              priority={currentIdx < 4}
                              className="garment-img"
                              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 35vw, 50vw"
                            />
                          </span>

                          {/* Tactile Swing Tag on Red Thread */}
                          <div className="tag" aria-hidden="true">
                            <div className="tag-thread" />
                            <div className="tag-card border border-border bg-paper shadow-sm">
                              <span className="text-[9px] font-mono tracking-wider text-ink-soft uppercase block">
                                {product.category}
                              </span>
                              <p className="text-xs font-semibold mt-0.5 leading-tight text-ink font-sans">
                                {product.title}
                              </p>
                              <p className="text-xs text-terracotta mt-1 font-mono font-medium">
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
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Atmospheric Footer Hints */}
      <footer className="flex flex-col items-center justify-center pb-2 pt-2 gap-2 relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-paper/90 px-3.5 py-1 shadow-xs text-[11px] font-mono text-ink-soft">
          <span>Slide Rail Horizontally · Tap Tabs to Jump</span>
        </div>

        <a
          href="#catalog"
          className="group flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-ink-soft hover:text-ink transition-colors mt-0.5"
        >
          <span>Explore Full Store Catalog</span>
          <span className="transition-transform group-hover:translate-y-0.5">
            &darr;
          </span>
        </a>
      </footer>
    </section>
  );
}
