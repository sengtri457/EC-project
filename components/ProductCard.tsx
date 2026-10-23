import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group relative flex flex-col justify-between border-r border-b border-ink/20 bg-backdrop transition-colors hover:bg-backdrop-hi/40">
      {/* Controlled, Compact Lookbook Image Container */}
      <Link
        href={`/products/${product.id}`}
        className="relative flex h-52 sm:h-64 md:h-72 w-full items-center justify-center overflow-hidden p-4 sm:p-6 bg-backdrop-hi/15"
      >
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain p-4 sm:p-5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
          priority={product.id <= 3}
        />
      </Link>

      {/* Editorial Bottom Typography (Matches Exact Reference Image) */}
      <div className="p-3.5 sm:p-4.5 pt-2 flex flex-col justify-between">
        <div>
          <Link
            href={`/products/${product.id}`}
            className="text-xs sm:text-sm font-medium tracking-tight text-ink hover:underline underline-offset-4 decoration-1 decoration-ink block line-clamp-1"
          >
            {product.title}
          </Link>

          {/* Micro-caption subtext */}
          <p className="mt-0.5 text-[10px] sm:text-[11px] text-ink-soft font-mono line-clamp-1">
            {product.fabric
              ? `available in ${product.fabric}`
              : `available in ${product.category}`}
          </p>
        </div>

        {/* Compact Price & Action */}
        <div className="mt-2 pt-2 border-t border-ink/10 flex items-center justify-between text-xs font-mono">
          <span className="font-bold text-ink text-xs">
            ${product.price.toFixed(2)}
          </span>

          <span className="type-label text-[10px] text-ink-soft group-hover:text-ctrl-red transition-colors uppercase tracking-widest flex items-center gap-0.5">
            <span>View</span>
            <span aria-hidden="true">→</span>
          </span>
        </div>
      </div>
    </article>
  );
}
