"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { itemCount, isLoaded } = useCart();

  return (
    <>
      {/* Editorial Announcement Bar */}
      <div className="bg-ink px-4 py-1.5 text-center text-[11px] font-mono tracking-widest uppercase text-paper/85 border-b border-paper/10">
        <span>Complimentary Standard Shipping On Orders Over $100</span>
        <span className="mx-2 text-ctrl-red">/</span>
        <span className="text-paper/60">Autumn Capsule</span>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-backdrop/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo / Brand */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-2.5 text-ink transition-opacity hover:opacity-85"
            >
              <div className="relative h-7 w-9 shrink-0">
                <Image
                  src="/images/logoDevs.png"
                  alt="Clothes™ Logo"
                  fill
                  sizes="36px"
                  className="object-contain"
                  priority
                />
              </div>
              <span className="type-display text-2xl font-semibold tracking-tight">
                Clothes<span className="text-xs align-super font-sans text-ink-soft">™</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-ink-soft">
              <Link
                href="/#pieces"
                className="transition-colors hover:text-ink hover:underline underline-offset-4 decoration-ctrl-red decoration-2"
              >
                Collection
              </Link>
              <Link
                href="/#catalog"
                className="transition-colors hover:text-ink hover:underline underline-offset-4 decoration-ctrl-red decoration-2"
              >
                Catalog
              </Link>
              <Link
                href="/cart"
                className="transition-colors hover:text-ink hover:underline underline-offset-4 decoration-ctrl-red decoration-2"
              >
                Bag
              </Link>
            </nav>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block text-xs font-mono text-ink-soft">
              USD ($)
            </span>

            {/* Cart / Bag Button */}
            <Link
              href="/cart"
              aria-label={`Shopping bag with ${isLoaded ? itemCount : 0} items`}
              className="group relative flex items-center gap-2 border border-border-strong bg-paper px-3.5 py-1 text-xs font-semibold text-ink shadow-sm transition-all hover:border-ink hover:bg-paper active:scale-95"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5 text-ink transition-colors"
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
              <span className="type-label text-[11px]">Bag</span>
              {isLoaded && itemCount > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-ctrl-red px-1 text-[10px] font-mono font-bold text-paper">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
