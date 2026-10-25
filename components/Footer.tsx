"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes("@")) {
      setIsSubscribed(true);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-ink text-paper border-t border-paper/10" aria-label="Site Footer">
      {/* ─── TIER 1: BRAND EDITORIAL & PRIVATE CAPSULE SUBSCRIPTION ─── */}
      <div className="mx-auto max-w-7xl px-[clamp(1.25rem,4vw,3.5rem)] py-[clamp(2.5rem,5vw,4.5rem)]">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start lg:gap-16">
          {/* Brand Manifesto */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="relative h-9 w-12 shrink-0">
                <Image
                  src="/images/logoDevs.png"
                  alt="Clothes™ Logo"
                  fill
                  sizes="48px"
                  className="object-contain brightness-0 invert opacity-95"
                />
              </div>
              <span className="type-label text-sm tracking-widest text-paper/80">
                CLOTHES™ CAMBODIA
              </span>
            </div>

            <h2 className="type-display text-[clamp(2.25rem,5.5vw,4.25rem)] leading-[0.94] text-paper">
              Minimalism<br />
              in Everyday Wear<span className="text-ctrl-red">.</span>
            </h2>

            <p className="max-w-xl text-sm leading-relaxed text-paper/70 font-sans">
              Accessible conscious luxury crafted for contemporary everyday living. Spun from breathable 280 GSM long-staple organic cotton, natural European flax linen, and structured silhouettes tailored for comfort and durability in Cambodia&apos;s climate.
            </p>
          </div>

          {/* Capsule Subscription Card */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-sm border border-paper/15 bg-paper/[0.03] p-6 sm:p-7 backdrop-blur-sm">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-widest text-ctrl-red">
                  Private Client Capsule
                </span>
                <span className="text-[10px] font-mono text-paper/40">EST. PHNOM PENH</span>
              </div>
              <h3 className="mt-2 text-base font-medium text-paper">
                Receive Early Access &amp; Editorial Drops
              </h3>
              <p className="mt-1.5 text-xs text-paper/60 leading-relaxed font-sans">
                Subscribe for private capsule drop alerts, priority restocks, and local styling advice. Enjoy 10% off your inaugural order.
              </p>
            </div>

            <div className="mt-5">
              {isSubscribed ? (
                <div className="rounded border border-sage/40 bg-sage/10 p-3.5 text-xs font-mono text-paper">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <span>✓</span>
                    <span className="font-semibold uppercase tracking-wider">Welcome to the Capsule</span>
                  </div>
                  <p className="mt-1 text-[11px] text-paper/80">
                    Use code <strong className="text-paper underline tracking-wider font-bold">WELCOME10</strong> at checkout for 10% off.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email for private drops..."
                    aria-label="Email address for private drops"
                    className="flex-1 rounded-none border border-paper/20 bg-paper/5 px-3.5 py-2.5 text-xs text-paper placeholder:text-paper/40 focus:border-paper focus:bg-paper/10 focus:outline-none font-mono transition-colors"
                  />
                  <button
                    type="submit"
                    className="type-label cursor-pointer whitespace-nowrap bg-paper px-5 py-2.5 text-xs tracking-wider text-ink hover:bg-ctrl-red hover:text-paper transition-colors font-medium shrink-0"
                  >
                    Join Capsule
                  </button>
                </form>
              )}
              <span className="mt-2.5 block text-[10px] text-paper/40 font-mono">
                No spam. Unsubscribe anytime with one tap.
              </span>
            </div>
          </div>
        </div>

        {/* Hairline Divider */}
        <div className="my-[clamp(2.5rem,4vw,3.5rem)] h-px w-full bg-paper/10" />

        {/* ─── TIER 2: 4-COLUMN KNOWLEDGE & NAVIGATION DIRECTORY ─── */}
        <nav
          className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 font-sans"
          aria-label="Footer Navigation Directory"
        >
          {/* Column 1: Wardrobe Catalog */}
          <div className="flex flex-col gap-3.5">
            <h4 className="text-[11px] font-mono uppercase tracking-widest text-paper/50">
              01 / Wardrobe Catalog
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs">
              <li>
                <Link
                  href="/catalog?audience=men"
                  className="text-paper/75 hover:text-paper hover:translate-x-0.5 inline-flex transition-all"
                >
                  Men&apos;s Collection
                </Link>
              </li>
              <li>
                <Link
                  href="/catalog?audience=women"
                  className="text-paper/75 hover:text-paper hover:translate-x-0.5 inline-flex transition-all"
                >
                  Women&apos;s Collection
                </Link>
              </li>
              <li>
                <Link
                  href="/catalog?audience=unisex"
                  className="text-paper/75 hover:text-paper hover:translate-x-0.5 inline-flex transition-all"
                >
                  Modern Unisex
                </Link>
              </li>
              <li>
                <Link
                  href="/catalog?dept=footwear"
                  className="text-paper/75 hover:text-paper hover:translate-x-0.5 inline-flex transition-all"
                >
                  Curated Footwear
                </Link>
              </li>
              <li>
                <Link
                  href="/catalog?dept=accessories"
                  className="text-paper/75 hover:text-paper hover:translate-x-0.5 inline-flex transition-all"
                >
                  Capsule Accessories
                </Link>
              </li>
              <li>
                <Link
                  href="#pieces"
                  className="text-ctrl-red font-medium hover:underline inline-flex items-center gap-1 transition-all"
                >
                  Curated Capsule Lookbook ↑
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Cambodia Delivery & Client Concierge */}
          <div className="flex flex-col gap-3.5">
            <h4 className="text-[11px] font-mono uppercase tracking-widest text-paper/50">
              02 / Delivery &amp; Concierge
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs">
              <li>
                <Link
                  href="/cart"
                  className="text-paper/75 hover:text-paper hover:translate-x-0.5 inline-flex transition-all"
                >
                  Shopping Bag
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-paper/75 hover:text-paper hover:translate-x-0.5 inline-flex transition-all"
                >
                  Customer Account &amp; Order Status
                </Link>
              </li>
              <li className="text-paper/75">
                <span className="text-paper/90 font-medium">Phnom Penh Express Delivery</span>
                <span className="block text-[11px] text-paper/50">Same-Day Rider &amp; Next-Day Doorstep</span>
              </li>
              <li className="text-paper/75">
                <span className="text-paper/90 font-medium">24 Provincial Delivery</span>
                <span className="block text-[11px] text-paper/50">Siem Reap, Battambang, Sihanoukville &amp; more</span>
              </li>
              <li className="pt-1 border-t border-paper/10 text-paper/60 text-[11px] font-mono">
                <div className="text-paper/90 flex items-center gap-1.5">
                  <span className="text-sky-400">●</span>
                  <span>Telegram Concierge:</span>
                  <a
                    href="https://t.me/clothesconcierge"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ctrl-red underline hover:text-paper transition-colors"
                  >
                    @clothesconcierge
                  </a>
                </div>
                <a
                  href="tel:+85512345678"
                  className="hover:text-ctrl-red transition-colors block mt-1 text-paper/80"
                >
                  Hotline: +855 (0) 12 345 678
                </a>
                <a
                  href="mailto:concierge@clothesbrand.com"
                  className="hover:text-ctrl-red transition-colors block mt-0.5 text-paper/60"
                >
                  concierge@clothesbrand.com
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Phnom Penh Studio & Flagship */}
          <div className="flex flex-col gap-3.5">
            <h4 className="text-[11px] font-mono uppercase tracking-widest text-paper/50">
              03 / Studio &amp; Showroom
            </h4>
            <div className="flex flex-col gap-3 text-xs text-paper/75">
              <div>
                <p className="font-medium text-paper">Phnom Penh Flagship Studio</p>
                <p className="mt-0.5 text-[11px] text-paper/60 leading-relaxed">
                  Boeng Keng Kang 1 (BKK1)<br />
                  Phnom Penh, Kingdom of Cambodia
                </p>
              </div>

              <div>
                <p className="font-medium text-paper">Opening &amp; Fitting Hours</p>
                <p className="mt-0.5 text-[11px] font-mono text-paper/60 leading-relaxed">
                  Mon – Sat: 9:00 AM – 8:00 PM<br />
                  Sunday: 10:00 AM – 6:00 PM
                </p>
              </div>

              <div className="pt-1.5 border-t border-paper/10 text-[11px] font-mono text-paper/50">
                <p className="text-ctrl-red">Direct Rider Location Pin via Telegram</p>
                <p className="mt-0.5">30-Day Easy Size Exchanges</p>
              </div>
            </div>
          </div>

          {/* Column 4: Local Payment & Conscious Standard */}
          <div className="flex flex-col gap-3.5">
            <h4 className="text-[11px] font-mono uppercase tracking-widest text-paper/50">
              04 / Payment &amp; Standards
            </h4>
            <div className="flex flex-col gap-2.5 text-xs text-paper/75">
              <div className="rounded border border-paper/10 bg-paper/[0.02] p-3">
                <div className="flex items-center gap-1.5">
                  <span className="rounded-xs bg-ctrl-red px-1.5 py-0.5 text-[9px] font-mono font-bold text-paper">
                    KHQR
                  </span>
                  <p className="font-semibold text-paper text-[11px] uppercase tracking-wider font-mono">
                    Bakong Instant Scan
                  </p>
                </div>
                <p className="mt-1 text-[11px] text-paper/60 leading-relaxed">
                  Zero fee instant payments via ABA Bank, Wing, ACLEDA, and all Bakong partner banks in USD ($) or KHR (៛).
                </p>
              </div>

              <div className="rounded border border-paper/10 bg-paper/[0.02] p-3">
                <p className="font-semibold text-paper text-[11px] uppercase tracking-wider font-mono">
                  Cash On Delivery (COD)
                </p>
                <p className="mt-1 text-[11px] text-paper/60 leading-relaxed">
                  Inspect your parcel at doorstep before paying your delivery rider in USD or Khmer Riel.
                </p>
              </div>
            </div>
          </div>
        </nav>

        {/* Hairline Divider */}
        <div className="my-[clamp(2rem,3.5vw,3rem)] h-px w-full bg-paper/10" />

        {/* ─── TIER 3: LEGAL, ACCEPTED LOCAL PAYMENTS & UTILITY ─── */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between text-xs text-paper/60 font-sans">
          {/* Copyright & Local Hub Attribution */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <p className="text-paper/80 font-mono text-[11px]">
              © {new Date().getFullYear()} Clothes™ Cambodia. All Rights Reserved.
            </p>
            <span className="hidden sm:inline text-paper/30">•</span>
            <span className="text-[11px] text-paper/50">
              BKK1, Phnom Penh — Nationwide Cambodia Delivery
            </span>
          </div>

          {/* Localized Payment Methods Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono text-paper/40 uppercase tracking-widest mr-1">
              Payment:
            </span>
            <span className="inline-flex items-center justify-center rounded border border-ctrl-red/40 bg-ctrl-red/10 px-2 py-1 text-[10px] font-mono font-bold tracking-wider text-ctrl-red">
              KHQR
            </span>
            <span className="inline-flex items-center justify-center rounded border border-paper/15 bg-paper/5 px-2 py-1 text-[10px] font-mono font-bold tracking-wider text-paper/80">
              ABA BANK
            </span>
            <span className="inline-flex items-center justify-center rounded border border-paper/15 bg-paper/5 px-2 py-1 text-[10px] font-mono font-bold tracking-wider text-paper/80">
              WING
            </span>
            <span className="inline-flex items-center justify-center rounded border border-paper/15 bg-paper/5 px-2 py-1 text-[10px] font-mono font-bold tracking-wider text-paper/80">
              ACLEDA
            </span>
            <span className="inline-flex items-center justify-center rounded border border-paper/15 bg-paper/5 px-2 py-1 text-[10px] font-mono font-bold tracking-wider text-paper/80">
              VISA / MC
            </span>
            <span className="inline-flex items-center justify-center rounded border border-paper/15 bg-paper/5 px-2 py-1 text-[10px] font-mono font-bold tracking-wider text-paper/80">
              COD ($ / ៛)
            </span>
          </div>

          {/* Smooth Scroll Back to Top Action */}
          <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 lg:pt-0 border-t border-paper/10 lg:border-t-0">
            <button
              onClick={scrollToTop}
              className="type-label cursor-pointer text-xs text-paper/70 hover:text-paper hover:underline underline-offset-4 flex items-center gap-1.5 transition-colors"
              aria-label="Scroll back to top of page"
            >
              <span>Back to top</span>
              <span className="font-mono text-sm">↑</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
