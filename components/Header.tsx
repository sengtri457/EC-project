"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

type MegaMenuKey = "men" | "women" | "footwear" | null;

interface FilterParams {
  audience?: string;
  dept?: string;
  subcategory?: string;
  search?: string;
  sort?: string;
}

export default function Header() {
  const { itemCount, isLoaded, openDrawer } = useCart();
  const { user, isLoaded: isAuthLoaded } = useAuth();
  const [activeMenu, setActiveMenu] = useState<MegaMenuKey>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>("men");
  const [currency, setCurrency] = useState("USD ($)");
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchOverlayRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(
          document.activeElement?.tagName || ""
        )
      ) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        isSearchOpen &&
        searchOverlayRef.current &&
        !searchOverlayRef.current.contains(e.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleMouseEnter = (key: MegaMenuKey) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(key);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  const navigateFilter = (params: FilterParams) => {
    setActiveMenu(null);
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);

    if (typeof window === "undefined") return;

    const searchParams = new URLSearchParams();
    if (params.audience) searchParams.set("audience", params.audience);
    if (params.dept) searchParams.set("dept", params.dept);
    if (params.subcategory) searchParams.set("subcategory", params.subcategory);
    if (params.search) searchParams.set("q", params.search);
    if (params.sort) searchParams.set("sort", params.sort);

    const queryString = searchParams.toString();
    const destinationUrl = queryString
      ? `/catalog?${queryString}`
      : `/catalog`;

    if (window.location.pathname === "/catalog") {
      window.history.pushState({}, "", destinationUrl);
      window.dispatchEvent(new Event("clothes:navigate-filter"));
    } else {
      window.location.href = destinationUrl;
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigateFilter({ search: searchQuery.trim() });
    setSearchQuery("");
  };

  return (
    <>
      {/* Editorial Announcement Bar */}
      <div className="bg-ink px-4 py-1.5 text-center text-[11px] font-mono tracking-widest uppercase text-paper/85 border-b border-paper/10 flex items-center justify-between sm:justify-center relative">
        <div className="mx-auto flex items-center gap-2">
          <span>Free Phnom Penh Delivery Over $30</span>
          <span className="hidden sm:inline text-ctrl-red">/</span>
          <span className="hidden sm:inline text-paper/60">Nationwide Cambodia Shipping</span>
          <span className="hidden md:inline text-ctrl-red">/</span>
          <span className="hidden md:inline text-paper/60">KHQR &amp; Cash on Delivery</span>
        </div>

        {/* Currency Switcher in top bar */}
        <div className="hidden lg:flex items-center gap-1 text-[10px] font-mono text-paper/70 absolute right-6">
          <div className="relative">
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
              className="hover:text-paper transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>{currency}</span>
              <span className="text-[8px]">▼</span>
            </button>
            {isCurrencyOpen && (
              <div className="absolute right-0 top-full mt-1 w-24 bg-paper text-ink border border-border shadow-lg py-1 z-50 text-[10px]">
                {["USD ($)", "EUR (€)", "GBP (£)"].map((curr) => (
                  <button
                    key={curr}
                    onClick={() => {
                      setCurrency(curr);
                      setIsCurrencyOpen(false);
                    }}
                    className={`block w-full text-left px-3 py-1 hover:bg-canvas transition-colors ${
                      currency === curr ? "font-bold text-ctrl-red" : ""
                    }`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className="sticky top-0 z-40 w-full border-b border-border bg-backdrop/95 backdrop-blur-md relative"
        onMouseLeave={handleMouseLeave}
      >
        {/* Full-Width Luxury Search Overlay */}
        {isSearchOpen && (
          <div
            ref={searchOverlayRef}
            className="absolute inset-0 z-50 flex items-center bg-paper/98 backdrop-blur-md px-4 sm:px-6 lg:px-8 border-b border-border shadow-md"
          >
            <div className="mx-auto flex h-full w-full max-w-7xl items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 shrink-0 text-ink"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>

              <form
                onSubmit={handleSearchSubmit}
                className="flex-1 flex items-center gap-2"
              >
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search pieces, fabrics, styles, or collections (e.g. linen shirt, denim, relaxed blazer)..."
                  className="w-full bg-transparent text-xs sm:text-sm font-sans tracking-tight text-ink placeholder:text-placeholder focus:outline-none"
                />
                {searchQuery.trim().length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="p-1 text-ink-soft hover:text-ink transition-colors cursor-pointer"
                    aria-label="Clear search input"
                  >
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
                <button
                  type="submit"
                  className="shrink-0 rounded bg-ink px-3 py-1.5 text-xs font-mono font-medium text-paper hover:bg-ink/90 transition-colors cursor-pointer"
                >
                  Search
                </button>
              </form>

              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                aria-label="Close search"
                className="shrink-0 flex items-center gap-1.5 rounded border border-border bg-canvas/50 px-2.5 py-1 text-xs font-mono text-ink-soft hover:text-ink hover:bg-canvas transition-colors cursor-pointer"
              >
                <span>Close</span>
                <kbd className="hidden sm:inline rounded border border-border bg-paper px-1 py-0.5 text-[9px] text-ink-soft">
                  ESC
                </kbd>
              </button>
            </div>

            {/* Trending Suggestions Dropdown Tray */}
            <div className="absolute top-full left-0 w-full border-b border-border bg-paper/98 backdrop-blur-md shadow-lg py-2.5 px-4 sm:px-6 lg:px-8">
              <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-ink-soft mr-1">
                  Trending:
                </span>
                {[
                  "Linen Overshirt",
                  "Raw Denim",
                  "Relaxed Blazer",
                  "Heavyweight Tee",
                  "Kampot Robe",
                  "Khmer Kroma",
                ].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      navigateFilter({ search: tag });
                    }}
                    className="rounded-full border border-border bg-canvas/50 px-2.5 py-0.5 text-[11px] font-mono text-ink transition-colors hover:border-ink hover:bg-canvas cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Mobile Hamburger & Brand */}
          <div className="flex items-center gap-4 lg:gap-8">
            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open Navigation Menu"
              className="lg:hidden p-1.5 text-ink hover:text-ctrl-red transition-colors cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Brand Logo & Name */}
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
                Clothes
                <span className="text-xs align-super font-sans text-ink-soft">
                  ™
                </span>
              </span>
            </Link>

            {/* Desktop Option B Navigation Links with Dropdown Triggers */}
            <nav className="hidden lg:flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-ink-soft">
              {/* 1. All Catalog */}
              <Link
                href="/catalog"
                className="px-3 py-4 transition-colors hover:text-ink font-semibold text-ink"
              >
                Catalog
              </Link>

              {/* 2. New In / Capsule */}
              <Link
                href="/#pieces"
                className="px-3 py-4 transition-colors hover:text-ink flex items-center gap-1.5 relative group"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-ctrl-red animate-pulse" />
                <span>Capsule</span>
              </Link>

              {/* 2. Men Mega-Menu Trigger */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter("men")}
              >
                <button
                  type="button"
                  onClick={() => navigateFilter({ audience: "men" })}
                  className={`px-3 py-4 transition-colors hover:text-ink flex items-center gap-1 cursor-pointer ${
                    activeMenu === "men" ? "text-ink font-semibold" : ""
                  }`}
                >
                  <span>Men</span>
                  <span
                    className={`text-[9px] transition-transform duration-200 ${activeMenu === "men" ? "rotate-180" : ""}`}
                  >
                    ▾
                  </span>
                </button>
              </div>

              {/* 3. Women Mega-Menu Trigger */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter("women")}
              >
                <button
                  type="button"
                  onClick={() => navigateFilter({ audience: "women" })}
                  className={`px-3 py-4 transition-colors hover:text-ink flex items-center gap-1 cursor-pointer ${
                    activeMenu === "women" ? "text-ink font-semibold" : ""
                  }`}
                >
                  <span>Women</span>
                  <span
                    className={`text-[9px] transition-transform duration-200 ${activeMenu === "women" ? "rotate-180" : ""}`}
                  >
                    ▾
                  </span>
                </button>
              </div>

              {/* 4. Footwear Mega-Menu Trigger */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter("footwear")}
              >
                <button
                  type="button"
                  onClick={() => navigateFilter({ dept: "shoes" })}
                  className={`px-3 py-4 transition-colors hover:text-ink flex items-center gap-1 cursor-pointer ${
                    activeMenu === "footwear" ? "text-ink font-semibold" : ""
                  }`}
                >
                  <span>Footwear</span>
                  <span
                    className={`text-[9px] transition-transform duration-200 ${activeMenu === "footwear" ? "rotate-180" : ""}`}
                  >
                    ▾
                  </span>
                </button>
              </div>

              {/* 5. Editorial / Lookbook */}
              <Link
                href="/#pieces"
                className="px-3 py-4 transition-colors hover:text-ink"
              >
                Editorial
              </Link>

              {/* 6. Archive / Clearance with Badge */}
              <button
                type="button"
                onClick={() => navigateFilter({ sort: "price-asc" })}
                className="px-3 py-4 transition-colors hover:text-ink flex items-center gap-1.5 cursor-pointer"
              >
                <span>Archive</span>
                <span className="rounded bg-terracotta/10 px-1.5 py-0.5 text-[9px] font-mono font-medium text-terracotta">
                  Sale
                </span>
              </button>
            </nav>
          </div>

          {/* Right Utilities */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Clean Quick Search Trigger */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search catalog"
              className="flex items-center gap-1.5 p-1.5 text-ink-soft hover:text-ink transition-colors cursor-pointer shrink-0 group"
              title="Search catalog (Press /)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 shrink-0 transition-transform group-hover:scale-105"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span className="type-label text-[11px] hidden xl:inline text-ink-soft font-mono">
                Search
              </span>
            </button>

            {/* User Account / Sign In */}
            {isAuthLoaded && user ? (
              <div className="relative group shrink-0">
                <Link
                  href="/login"
                  className="shrink-0 whitespace-nowrap flex items-center gap-1.5 border border-border bg-paper px-2.5 py-1 text-xs text-ink shadow-sm hover:border-ink transition-colors"
                  title="View Account Profile"
                >
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-ink text-paper text-[9px] font-mono font-semibold">
                    {user.name.charAt(0)}
                  </span>
                  <span className="type-label text-[11px] whitespace-nowrap hidden sm:inline max-w-[80px] truncate">
                    {user.name.split(" ")[0]}
                  </span>
                </Link>
              </div>
            ) : (
              <Link
                href="/login"
                className="type-label shrink-0 whitespace-nowrap flex items-center gap-1.5 border border-border bg-paper px-2.5 py-1 text-xs text-ink shadow-sm hover:border-ink hover:bg-canvas transition-colors"
                title="Member Sign In"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5 shrink-0 text-ink-soft"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="text-[11px] whitespace-nowrap hidden sm:inline">
                  Sign In
                </span>
              </Link>
            )}

            {/* Shopping Bag Button (Opens Slide-over Drawer) */}
            <button
              type="button"
              onClick={openDrawer}
              aria-label={`Shopping bag with ${isLoaded ? itemCount : 0} items`}
              className="shrink-0 whitespace-nowrap group relative flex items-center gap-2 border border-border bg-paper px-3 py-1 text-xs font-semibold text-ink shadow-sm transition-all hover:border-ink hover:bg-canvas active:scale-95 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5 shrink-0 text-ink transition-colors"
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
              <span className="type-label text-[11px] whitespace-nowrap hidden sm:inline">
                Bag
              </span>
              {isLoaded && itemCount > 0 && (
                <span className="flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-ctrl-red px-1 text-[10px] font-mono font-bold text-paper">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* =========================================================================
            OPTION B: MEGA-MENU DROPDOWN PANELS
        ========================================================================= */}
        {activeMenu && (
          <div
            className="absolute top-full left-0 w-full border-b border-border bg-paper/98 backdrop-blur-md shadow-xl transition-all duration-200 z-50"
            onMouseEnter={() => {
              if (timeoutRef.current) clearTimeout(timeoutRef.current);
            }}
            onMouseLeave={handleMouseLeave}
          >
            <div className="mx-auto max-w-7xl px-8 py-8">
              {/* MEN MEGA MENU */}
              {activeMenu === "men" && (
                <div className="grid grid-cols-12 gap-8">
                  <div className="col-span-3 space-y-4">
                    <h3 className="text-[10px] font-mono uppercase tracking-widest text-ink-soft border-b border-border pb-2">
                      Apparel &amp; Knitwear
                    </h3>
                    <ul className="space-y-2.5 text-xs">
                      <li>
                        <button
                          onClick={() =>
                            navigateFilter({
                              audience: "men",
                              subcategory: "tshirt",
                            })
                          }
                          className="text-ink hover:text-ctrl-red transition-colors block text-left"
                        >
                          Heavyweight Long-Staple Tees
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() =>
                            navigateFilter({
                              audience: "men",
                              subcategory: "sweater",
                            })
                          }
                          className="text-ink hover:text-ctrl-red transition-colors block text-left"
                        >
                          Thermal Knitwear &amp; Sweaters
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() =>
                            navigateFilter({
                              audience: "men",
                              subcategory: "hoodies",
                            })
                          }
                          className="text-ink hover:text-ctrl-red transition-colors block text-left"
                        >
                          French Terry Relaxed Hoodies
                        </button>
                      </li>
                      <li className="pt-2">
                        <button
                          onClick={() =>
                            navigateFilter({ audience: "men", dept: "clothes" })
                          }
                          className="text-[11px] font-semibold text-ctrl-red hover:underline block text-left"
                        >
                          View All Men&apos;s Apparel &rarr;
                        </button>
                      </li>
                    </ul>
                  </div>

                  <div className="col-span-3 space-y-4">
                    <h3 className="text-[10px] font-mono uppercase tracking-widest text-ink-soft border-b border-border pb-2">
                      Tailoring &amp; Trousers
                    </h3>
                    <ul className="space-y-2.5 text-xs">
                      <li>
                        <button
                          onClick={() =>
                            navigateFilter({
                              audience: "men",
                              subcategory: "sweater",
                            })
                          }
                          className="text-ink hover:text-ctrl-red transition-colors block text-left"
                        >
                          Double Pleated Raw Denim
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() =>
                            navigateFilter({ audience: "men", dept: "shoes" })
                          }
                          className="text-ink hover:text-ctrl-red transition-colors block text-left"
                        >
                          Curated Footwear &amp; Icons
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() =>
                            navigateFilter({
                              audience: "men",
                              dept: "accessories",
                            })
                          }
                          className="text-ink hover:text-ctrl-red transition-colors block text-left"
                        >
                          Signature Leather Accessories
                        </button>
                      </li>
                      <li className="pt-2">
                        <button
                          onClick={() => navigateFilter({ audience: "men" })}
                          className="text-[11px] font-semibold text-ctrl-red hover:underline block text-left"
                        >
                          Complete Men&apos;s Catalog &rarr;
                        </button>
                      </li>
                    </ul>
                  </div>

                  <div className="col-span-6 border-l border-border pl-8">
                    <div className="border border-border bg-canvas/40 p-5 flex items-center justify-between gap-6">
                      <div className="space-y-2 max-w-xs">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-ctrl-red font-semibold">
                          Capsule Spotlight
                        </span>
                        <h4 className="type-display text-base font-semibold text-ink">
                          The Autumn Menswear Uniform
                        </h4>
                        <p className="text-xs text-ink-soft leading-relaxed">
                          Handcrafted raw denim jackets paired with waffle
                          thermal layers. Designed for understated poise.
                        </p>
                        <button
                          onClick={() => {
                            setActiveMenu(null);
                            const elem = document.getElementById("pieces");
                            if (elem)
                              elem.scrollIntoView({ behavior: "smooth" });
                          }}
                          className="type-label inline-flex items-center gap-1.5 text-xs text-ink hover:text-ctrl-red font-semibold pt-1"
                        >
                          <span>Explore Autumn Lookbook</span>
                          <span>&rarr;</span>
                        </button>
                      </div>

                      <div className="relative h-28 w-24 shrink-0 overflow-hidden border border-border bg-paper">
                        <Image
                          src="/collection/ctrl-blazer.webp"
                          alt="Autumn Menswear Look"
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* WOMEN MEGA MENU */}
              {activeMenu === "women" && (
                <div className="grid grid-cols-12 gap-8">
                  <div className="col-span-3 space-y-4">
                    <h3 className="text-[10px] font-mono uppercase tracking-widest text-ink-soft border-b border-border pb-2">
                      Essentials &amp; Linen
                    </h3>
                    <ul className="space-y-2.5 text-xs">
                      <li>
                        <button
                          onClick={() =>
                            navigateFilter({
                              audience: "women",
                              subcategory: "tshirt",
                            })
                          }
                          className="text-ink hover:text-ctrl-red transition-colors block text-left"
                        >
                          Organic Cotton Everyday Tees
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() =>
                            navigateFilter({
                              audience: "women",
                              subcategory: "sweater",
                            })
                          }
                          className="text-ink hover:text-ctrl-red transition-colors block text-left"
                        >
                          Tactile Fine-Knit Sweaters
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() =>
                            navigateFilter({
                              audience: "women",
                              subcategory: "hoodies",
                            })
                          }
                          className="text-ink hover:text-ctrl-red transition-colors block text-left"
                        >
                          Cropped &amp; Oversized Layers
                        </button>
                      </li>
                      <li className="pt-2">
                        <button
                          onClick={() =>
                            navigateFilter({
                              audience: "women",
                              dept: "clothes",
                            })
                          }
                          className="text-[11px] font-semibold text-ctrl-red hover:underline block text-left"
                        >
                          View All Women&apos;s Tops &rarr;
                        </button>
                      </li>
                    </ul>
                  </div>

                  <div className="col-span-3 space-y-4">
                    <h3 className="text-[10px] font-mono uppercase tracking-widest text-ink-soft border-b border-border pb-2">
                      Silhouettes &amp; Footwear
                    </h3>
                    <ul className="space-y-2.5 text-xs">
                      <li>
                        <button
                          onClick={() =>
                            navigateFilter({
                              audience: "women",
                              dept: "clothes",
                            })
                          }
                          className="text-ink hover:text-ctrl-red transition-colors block text-left"
                        >
                          Relaxed Pleated Trousers
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() =>
                            navigateFilter({ audience: "women", dept: "shoes" })
                          }
                          className="text-ink hover:text-ctrl-red transition-colors block text-left"
                        >
                          Curated Low-Profile Trainers
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() =>
                            navigateFilter({
                              audience: "women",
                              dept: "accessories",
                            })
                          }
                          className="text-ink hover:text-ctrl-red transition-colors block text-left"
                        >
                          Minimalist Wool Scarves &amp; Hats
                        </button>
                      </li>
                      <li className="pt-2">
                        <button
                          onClick={() => navigateFilter({ audience: "women" })}
                          className="text-[11px] font-semibold text-ctrl-red hover:underline block text-left"
                        >
                          Complete Women&apos;s Catalog &rarr;
                        </button>
                      </li>
                    </ul>
                  </div>

                  <div className="col-span-6 border-l border-border pl-8">
                    <div className="border border-border bg-canvas/40 p-5 flex items-center justify-between gap-6">
                      <div className="space-y-2 max-w-xs">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-sage font-semibold">
                          Conscious Material
                        </span>
                        <h4 className="type-display text-base font-semibold text-ink">
                          Accessible Conscious Luxury
                        </h4>
                        <p className="text-xs text-ink-soft leading-relaxed">
                          Natural European linen and chemical-free dyes.
                          Silhouettes tailored to drape naturally day-to-night.
                        </p>
                        <button
                          onClick={() => {
                            setActiveMenu(null);
                            const elem = document.getElementById("pieces");
                            if (elem)
                              elem.scrollIntoView({ behavior: "smooth" });
                          }}
                          className="type-label inline-flex items-center gap-1.5 text-xs text-ink hover:text-ctrl-red font-semibold pt-1"
                        >
                          <span>Discover Capsule Pieces</span>
                          <span>&rarr;</span>
                        </button>
                      </div>

                      <div className="relative h-28 w-24 shrink-0 overflow-hidden border border-border bg-paper">
                        <Image
                          src="/collection/ctrl-sweater.webp"
                          alt="Women's Sustainable Knit"
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* FOOTWEAR MEGA MENU */}
              {activeMenu === "footwear" && (
                <div className="grid grid-cols-12 gap-8">
                  <div className="col-span-3 space-y-4">
                    <h3 className="text-[10px] font-mono uppercase tracking-widest text-ink-soft border-b border-border pb-2">
                      Curated Icon Series
                    </h3>
                    <ul className="space-y-2.5 text-xs">
                      <li>
                        <button
                          onClick={() =>
                            navigateFilter({
                              dept: "shoes",
                              subcategory: "lifestyle",
                            })
                          }
                          className="text-ink hover:text-ctrl-red transition-colors block text-left"
                        >
                          Low-Profile Retro Trainers
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() =>
                            navigateFilter({
                              dept: "shoes",
                              subcategory: "running",
                            })
                          }
                          className="text-ink hover:text-ctrl-red transition-colors block text-left"
                        >
                          Heritage Runner Silhouettes
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() =>
                            navigateFilter({
                              dept: "shoes",
                              subcategory: "basketball",
                            })
                          }
                          className="text-ink hover:text-ctrl-red transition-colors block text-left"
                        >
                          Court Heritage Icons
                        </button>
                      </li>
                      <li className="pt-2">
                        <button
                          onClick={() => navigateFilter({ dept: "shoes" })}
                          className="text-[11px] font-semibold text-ctrl-red hover:underline block text-left"
                        >
                          View Entire Footwear Rack &rarr;
                        </button>
                      </li>
                    </ul>
                  </div>

                  <div className="col-span-4 space-y-4">
                    <h3 className="text-[10px] font-mono uppercase tracking-widest text-ink-soft border-b border-border pb-2">
                      Editorial Fit Guides &amp; Care
                    </h3>
                    <div className="space-y-3 text-xs">
                      <div className="border border-border bg-canvas/30 p-3">
                        <p className="font-semibold text-ink text-[11px]">
                          The Samba &amp; Retro Fit Chart
                        </p>
                        <p className="text-[11px] text-ink-soft mt-0.5">
                          True-to-size recommendations for low-profile leather
                          classics.
                        </p>
                      </div>
                      <div className="border border-border bg-canvas/30 p-3">
                        <p className="font-semibold text-ink text-[11px]">
                          Natural Suede &amp; Leather Care
                        </p>
                        <p className="text-[11px] text-ink-soft mt-0.5">
                          Preserving tactile nap and patina through seasonal
                          wear.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-5 border-l border-border pl-8">
                    <div className="border border-border bg-canvas/40 p-5 flex items-center justify-between gap-6">
                      <div className="space-y-2 max-w-xs">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-ctrl-red font-semibold">
                          Curated Footwear
                        </span>
                        <h4 className="type-display text-base font-semibold text-ink">
                          Icons Reimagined
                        </h4>
                        <p className="text-xs text-ink-soft leading-relaxed">
                          Hand-selected sneaker icons paired effortlessly with
                          our relaxed tailoring.
                        </p>
                        <button
                          onClick={() => navigateFilter({ dept: "shoes" })}
                          className="type-label inline-flex items-center gap-1.5 text-xs text-ink hover:text-ctrl-red font-semibold pt-1"
                        >
                          <span>Shop Verified Footwear</span>
                          <span>&rarr;</span>
                        </button>
                      </div>

                      <div className="relative h-28 w-24 shrink-0 overflow-hidden border border-border bg-paper">
                        <Image
                          src="/collection/ctrl-jeans.webp"
                          alt="Footwear and Trousers Curation"
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            MOBILE OFF-CANVAS SLIDE-OVER DRAWER
        ========================================================================= */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-ink/50 backdrop-blur-sm transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Off-Canvas Slide Panel */}
            <div className="fixed inset-y-0 left-0 h-[100dvh] w-full max-w-xs bg-paper shadow-2xl flex flex-col z-10 border-r border-border">
              {/* Drawer Top */}
              <div className="flex items-center justify-between p-4 border-b border-border bg-canvas/40">
                <div className="flex items-center gap-2">
                  <div className="relative h-6 w-8">
                    <Image
                      src="/images/logoDevs.png"
                      alt="Clothes Logo"
                      fill
                      sizes="32px"
                      className="object-contain"
                    />
                  </div>
                  <span className="type-display text-lg font-semibold text-ink">
                    Clothes™
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 text-ink-soft hover:text-ink text-base cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Drawer Search */}
              <div className="p-4 border-b border-border">
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex items-center border border-border bg-canvas/30 rounded px-3 py-1.5"
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search catalog..."
                    className="w-full text-xs text-ink placeholder:text-placeholder focus:outline-none bg-transparent"
                  />
                  <button
                    type="submit"
                    className="text-xs font-mono text-ink-soft"
                  >
                    ↵
                  </button>
                </form>
              </div>

              {/* Drawer Navigation Links */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* 1. New In */}
                <Link
                  href="/#pieces"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2 text-xs font-semibold uppercase tracking-wider text-ink border-b border-border"
                >
                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-ctrl-red" />
                    Autumn Capsule
                  </span>
                  <span className="text-[10px] text-ctrl-red font-mono">
                    NEW
                  </span>
                </Link>

                {/* 2. Men Accordion */}
                <div className="border-b border-border pb-3">
                  <button
                    onClick={() =>
                      setMobileAccordion(
                        mobileAccordion === "men" ? null : "men",
                      )
                    }
                    className="flex w-full items-center justify-between py-2 text-xs font-semibold uppercase tracking-wider text-ink"
                  >
                    <span>Men</span>
                    <span className="text-xs">
                      {mobileAccordion === "men" ? "−" : "+"}
                    </span>
                  </button>
                  {mobileAccordion === "men" && (
                    <div className="pl-3 pt-2 space-y-2 text-xs text-ink-soft">
                      <button
                        onClick={() =>
                          navigateFilter({
                            audience: "men",
                            subcategory: "tshirt",
                          })
                        }
                        className="block text-left py-1 hover:text-ink"
                      >
                        Long-Staple Tees
                      </button>
                      <button
                        onClick={() =>
                          navigateFilter({
                            audience: "men",
                            subcategory: "sweater",
                          })
                        }
                        className="block text-left py-1 hover:text-ink"
                      >
                        Thermal Sweaters &amp; Knits
                      </button>
                      <button
                        onClick={() =>
                          navigateFilter({
                            audience: "men",
                            subcategory: "hoodies",
                          })
                        }
                        className="block text-left py-1 hover:text-ink"
                      >
                        French Terry Hoodies
                      </button>
                      <button
                        onClick={() => navigateFilter({ audience: "men" })}
                        className="block text-left py-1 font-semibold text-ctrl-red"
                      >
                        All Men&apos;s Silhouettes &rarr;
                      </button>
                    </div>
                  )}
                </div>

                {/* 3. Women Accordion */}
                <div className="border-b border-border pb-3">
                  <button
                    onClick={() =>
                      setMobileAccordion(
                        mobileAccordion === "women" ? null : "women",
                      )
                    }
                    className="flex w-full items-center justify-between py-2 text-xs font-semibold uppercase tracking-wider text-ink"
                  >
                    <span>Women</span>
                    <span className="text-xs">
                      {mobileAccordion === "women" ? "−" : "+"}
                    </span>
                  </button>
                  {mobileAccordion === "women" && (
                    <div className="pl-3 pt-2 space-y-2 text-xs text-ink-soft">
                      <button
                        onClick={() =>
                          navigateFilter({
                            audience: "women",
                            subcategory: "tshirt",
                          })
                        }
                        className="block text-left py-1 hover:text-ink"
                      >
                        Organic Cotton Tops
                      </button>
                      <button
                        onClick={() =>
                          navigateFilter({
                            audience: "women",
                            subcategory: "sweater",
                          })
                        }
                        className="block text-left py-1 hover:text-ink"
                      >
                        Fine-Knit Sweaters
                      </button>
                      <button
                        onClick={() => navigateFilter({ audience: "women" })}
                        className="block text-left py-1 font-semibold text-ctrl-red"
                      >
                        All Women&apos;s Silhouettes &rarr;
                      </button>
                    </div>
                  )}
                </div>

                {/* 4. Footwear Accordion */}
                <div className="border-b border-border pb-3">
                  <button
                    onClick={() =>
                      setMobileAccordion(
                        mobileAccordion === "shoes" ? null : "shoes",
                      )
                    }
                    className="flex w-full items-center justify-between py-2 text-xs font-semibold uppercase tracking-wider text-ink"
                  >
                    <span>Footwear</span>
                    <span className="text-xs">
                      {mobileAccordion === "shoes" ? "−" : "+"}
                    </span>
                  </button>
                  {mobileAccordion === "shoes" && (
                    <div className="pl-3 pt-2 space-y-2 text-xs text-ink-soft">
                      <button
                        onClick={() =>
                          navigateFilter({
                            dept: "shoes",
                            subcategory: "lifestyle",
                          })
                        }
                        className="block text-left py-1 hover:text-ink"
                      >
                        Lifestyle Classics
                      </button>
                      <button
                        onClick={() =>
                          navigateFilter({
                            dept: "shoes",
                            subcategory: "running",
                          })
                        }
                        className="block text-left py-1 hover:text-ink"
                      >
                        Vintage Runners
                      </button>
                      <button
                        onClick={() => navigateFilter({ dept: "shoes" })}
                        className="block text-left py-1 font-semibold text-ctrl-red"
                      >
                        All Footwear &rarr;
                      </button>
                    </div>
                  )}
                </div>

                {/* 5. Editorial & Archive */}
                <Link
                  href="/#pieces"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 text-xs font-semibold uppercase tracking-wider text-ink"
                >
                  Editorial Lookbook
                </Link>
                <button
                  onClick={() => navigateFilter({ sort: "price-asc" })}
                  className="flex items-center justify-between w-full py-2 text-xs font-semibold uppercase tracking-wider text-ink"
                >
                  <span>Archive Clearance</span>
                  <span className="rounded bg-terracotta/10 px-1.5 py-0.5 text-[9px] font-mono text-terracotta">
                    -30%
                  </span>
                </button>
              </div>

              {/* Drawer Bottom */}
              <div className="p-4 border-t border-border bg-canvas/40 space-y-2 text-[11px] font-mono text-ink-soft">
                <div className="flex items-center justify-between">
                  <span>Currency:</span>
                  <span className="font-semibold text-ink">{currency}</span>
                </div>
                <div>
                  <span>Concierge: concierge@clothes.com</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
