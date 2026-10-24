import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex flex-wrap items-end justify-between gap-8 bg-ink px-[clamp(1rem,4vw,3.5rem)] py-[clamp(2.5rem,6vw,4.5rem)] text-paper">
      <div className="flex flex-col gap-4">
        <div className="relative h-10 w-14">
          <Image
            src="/images/logoDevs.png"
            alt="Clothes™ Logo"
            fill
            sizes="56px"
            className="object-contain brightness-0 invert opacity-90"
          />
        </div>
        <p className="type-display text-[clamp(2.75rem,8vw,6.5rem)] leading-[0.9] text-paper">
          Minimalism<br />
          in Everyday Wear<span className="text-ctrl-red">.</span>
        </p>
      </div>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-12">
        <div className="max-w-[34ch] text-sm leading-relaxed text-paper/70">
          <p className="type-label text-base text-paper tracking-wider">
            Clothes™ Apparel Co.
          </p>
          <p className="mt-2 text-xs text-paper/60">
            Accessible conscious luxury. Spun from long-staple organic cotton, European linen, and structured silhouettes designed to endure.
          </p>
          <div className="mt-3 flex items-center gap-2 text-[11px] font-mono text-paper/50">
            <span>Concierge: concierge@clothes.com</span>
            <span>•</span>
            <span>30-Day Returns</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-right">
          <Link
            href="#pieces"
            className="type-label text-sm text-paper underline-offset-4 hover:text-ctrl-red hover:underline transition-colors"
          >
            Curated Capsule ↑
          </Link>
          <Link
            href="/cart"
            className="type-label text-sm text-paper/70 hover:text-paper transition-colors"
          >
            Shopping Bag
          </Link>
        </div>
      </div>
    </footer>
  );
}
