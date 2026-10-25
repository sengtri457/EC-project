import Link from "next/link";
import { getProducts } from "@/data/products";
import CatalogClient from "@/components/CatalogClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "All Products — Clothes™ Cambodia",
  description: "Browse our complete collection of essentials, knitwear, footwear, and accessories with nationwide Cambodia delivery.",
};

export default function CatalogPage() {
  const allProducts = getProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-mono text-ink-soft">
        <Link href="/" className="hover:text-ink transition-colors underline underline-offset-4 decoration-ctrl-red">
          Home
        </Link>
        <span>/</span>
        <span className="uppercase text-ink font-semibold">Store Catalog</span>
      </nav>

      {/* Catalog Title Header */}
      <div className="mb-8 border-b-2 border-ink pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="type-label text-xs uppercase tracking-widest text-ink-soft block">
            All Products
          </span>
          <h1 className="type-display text-3xl text-ink sm:text-4xl font-semibold mt-1">
            Complete Collection
          </h1>
        </div>
        <div className="text-xs font-mono text-ink-soft">
          Showing <span className="font-semibold text-ink">{allProducts.length}</span> items
        </div>
      </div>

      {/* Catalog Grid with Filters & Search */}
      <CatalogClient initialProducts={allProducts} />
    </div>
  );
}
