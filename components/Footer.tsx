import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex flex-wrap items-end justify-between gap-8 bg-ink px-[clamp(1rem,4vw,3.5rem)] py-[clamp(2.5rem,6vw,4.5rem)] text-paper">
      <div>
        <p className="type-display text-[clamp(2.75rem,9vw,7.5rem)] leading-[0.85] text-paper">
          Never<br />
          Basic<span className="text-ctrl-red">.</span>
        </p>
      </div>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-12">
        <div className="max-w-[32ch] text-sm leading-relaxed text-paper/70">
          <p className="type-label text-base text-paper tracking-wider">
            CTRL — The New Era
          </p>
          <p className="mt-2 text-xs text-paper/60">
            Limited release, June 2026. Handcrafted tailoring &amp; heavyweight raw knitwear.
          </p>
        </div>

        <div className="flex flex-col gap-2 text-right">
          <Link
            href="#pieces"
            className="type-label text-sm text-paper underline-offset-4 hover:text-ctrl-red hover:underline transition-colors"
          >
            The Pieces ↑
          </Link>
          <Link
            href="/cart"
            className="type-label text-sm text-paper/70 hover:text-paper transition-colors"
          >
            View Bag
          </Link>
        </div>
      </div>
    </footer>
  );
}
