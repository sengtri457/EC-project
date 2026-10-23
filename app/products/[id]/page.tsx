import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById } from "@/data/products";
import AddToCartButton from "@/components/AddToCartButton";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = Number(id);

  if (isNaN(productId)) {
    notFound();
  }

  const product = getProductById(productId);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 bg-backdrop text-ink">
      {/* Editorial Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-xs font-mono text-ink-soft">
        <Link href="/" className="hover:text-ink transition-colors underline underline-offset-4 decoration-ctrl-red">
          Home
        </Link>
        <span>/</span>
        <Link
          href="/#catalog"
          className="uppercase hover:text-ink transition-colors"
        >
          Catalog
        </Link>
        {product.audience && (
          <>
            <span>/</span>
            <span className="uppercase text-ink font-semibold">
              {product.audience}
            </span>
          </>
        )}
        {product.department && (
          <>
            <span>/</span>
            <span className="uppercase text-ink font-semibold">
              {product.department}
            </span>
          </>
        )}
        {product.subcategory && (
          <>
            <span>/</span>
            <span className="uppercase text-ink font-semibold">
              {product.subcategory}
            </span>
          </>
        )}
        <span>/</span>
        <span className="font-bold text-ink truncate max-w-xs">
          {product.title}
        </span>
      </nav>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Product Media Column */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="relative aspect-square w-full max-h-[520px] overflow-hidden border border-ink/20 bg-paper/60 p-6 sm:p-12 shadow-sm flex items-center justify-center">
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-6"
              priority
            />

            {/* Category Pill */}
            <div className="absolute top-4 left-4">
              <span className="border border-ink/30 bg-paper px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-ink shadow-sm">
                {product.category}
              </span>
            </div>
          </div>
        </div>

        {/* Product Info & Purchase Column */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            {/* Header info */}
            <div className="flex items-center justify-between text-xs font-mono text-ink-soft">
              <span>REF: CTRL-00{product.id}</span>
              <div className="flex items-center gap-1">
                <span className="text-ctrl-red">★</span>
                <span className="font-semibold text-ink">4.9</span>
                <span className="text-ink-soft">· Certified Release</span>
              </div>
            </div>

            <h1 className="type-display mt-3 text-3xl sm:text-4xl text-ink">
              {product.title}
            </h1>

            {/* Price */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="font-mono text-3xl font-extrabold text-ink">
                ${product.price.toFixed(2)} USD
              </span>
              <span className="text-xs font-mono text-ink-soft">
                Taxes calculated at checkout
              </span>
            </div>

            {/* Description */}
            <div className="mt-6 border-t border-ink/20 pt-6">
              <h2 className="type-label text-xs uppercase tracking-wider text-ink-soft">
                Design &amp; Material Specifications
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {product.description}
              </p>
              {product.fabric && (
                <p className="mt-2 text-xs font-mono text-ink">
                  Fabric: {product.fabric}
                </p>
              )}
            </div>

            {/* Purchase Options */}
            <div className="mt-8 border-t border-ink/20 pt-6">
              <AddToCartButton product={product} />
            </div>
          </div>

          {/* Guarantee Badges */}
          <div className="mt-10 border-t border-ink/20 pt-6 grid grid-cols-2 gap-4 text-xs font-mono text-ink-soft">
            <div className="border border-ink/15 bg-paper/40 p-3">
              <p className="font-bold text-ink">Insured Dispatch</p>
              <p className="mt-0.5 text-[11px]">Carbon-neutral shipping</p>
            </div>
            <div className="border border-ink/15 bg-paper/40 p-3">
              <p className="font-bold text-ink">Returns</p>
              <p className="mt-0.5 text-[11px]">30-day effortless returns</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
