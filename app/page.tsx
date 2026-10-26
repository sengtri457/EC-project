import Image from "next/image";
import Link from "next/link";
import { getCollectionPieces, getProducts } from "@/data/products";
import ClothingRack from "@/components/ClothingRack";
import PiecesList from "@/components/PiecesList";
import NewsletterForm from "@/components/NewsletterForm";

export default function Home() {
  const pieces = getCollectionPieces();
  const allProducts = getProducts();
  const trendingProducts = allProducts.slice(0, 4);

  return (
    <div className="flex flex-col">
      <ClothingRack products={pieces} />

      <section className="border-t border-b border-border bg-paper py-5 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-6 text-xs font-mono">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-canvas border border-border text-ink">
              <svg
                className="h-4.5 w-4.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.25V3.75c0-.621-.504-1.125-1.125-1.125h-9c-.621 0-1.125.504-1.125 1.125v10.5c0 .621.504 1.125 1.125 1.125h2.25"
                />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-ink">Phnom Penh Express</p>
              <p className="text-ink-soft text-[11px]">
                1–3 hrs in PP · 24-48h nationwide
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-canvas border border-border text-ink">
              <svg
                className="h-4.5 w-4.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-ink">
                KHQR &amp; Cash on Delivery
              </p>
              <p className="text-ink-soft text-[11px]">
                ABA, Bakong &amp; doorstep cash
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-canvas border border-border text-ink">
              <svg
                className="h-4.5 w-4.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-ink">Doorstep Size Exchange</p>
              <p className="text-ink-soft text-[11px]">
                Easy rider exchange if fit isn&apos;t 100%
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-canvas border border-border text-ink">
              <svg
                className="h-4.5 w-4.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-ink">
                Lightweight &amp; Breathable
              </p>
              <p className="text-ink-soft text-[11px]">
                100% organic cotton &amp; natural linen
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Seasonal Curated Lookbook */}
      <PiecesList products={pieces} />

      {/* 4. Shop by Department (4-Card Visual Grid) */}
      <section className="bg-canvas border-b border-border py-14 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b-2 border-ink pb-3 mb-6 gap-2">
            <div>
              <span className="type-label text-[11px] uppercase tracking-widest text-ink-soft block">
                Departments
              </span>
              <h2 className="type-display text-2xl sm:text-3xl font-semibold text-ink mt-0.5">
                Explore by Category
              </h2>
            </div>
            <Link
              href="/catalog"
              className="text-xs font-mono text-ink-soft hover:text-ink underline underline-offset-4"
            >
              View Full Catalog ({allProducts.length}) &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Menswear */}
            <Link
              href="/catalog?audience=men"
              className="group border border-border bg-paper p-5 hover:border-ink transition-all shadow-xs flex flex-col justify-between min-h-[190px]"
            >
              <div>
                <span className="text-[10px] font-mono text-ink-soft uppercase tracking-wider block">
                  Collection
                </span>
                <h3 className="type-display text-xl text-ink font-semibold mt-1 group-hover:underline">
                  Menswear
                </h3>
                <p className="text-xs text-ink-soft mt-1.5 leading-relaxed font-mono">
                  Boxy oversized tees, breathable shirts, relaxed trousers, and
                  denim.
                </p>
              </div>
              <div className="pt-4 flex items-center justify-between text-xs font-mono border-t border-border/60">
                <span className="text-ink-soft">14 Styles</span>
                <span className="text-ink font-semibold group-hover:translate-x-1 transition-transform">
                  Shop Men &rarr;
                </span>
              </div>
            </Link>

            {/* Womenswear */}
            <Link
              href="/catalog?audience=women"
              className="group border border-border bg-paper p-5 hover:border-ink transition-all shadow-xs flex flex-col justify-between min-h-[190px]"
            >
              <div>
                <span className="text-[10px] font-mono text-ink-soft uppercase tracking-wider block">
                  Collection
                </span>
                <h3 className="type-display text-xl text-ink font-semibold mt-1 group-hover:underline">
                  Womenswear
                </h3>
                <p className="text-xs text-ink-soft mt-1.5 leading-relaxed font-mono">
                  Washed linen shirts, effortless everyday tops, and relaxed
                  trousers.
                </p>
              </div>
              <div className="pt-4 flex items-center justify-between text-xs font-mono border-t border-border/60">
                <span className="text-ink-soft">12 Styles</span>
                <span className="text-ink font-semibold group-hover:translate-x-1 transition-transform">
                  Shop Women &rarr;
                </span>
              </div>
            </Link>

            {/* Footwear */}
            <Link
              href="/catalog?dept=shoes"
              className="group border border-border bg-paper p-5 hover:border-ink transition-all shadow-xs flex flex-col justify-between min-h-[190px]"
            >
              <div>
                <span className="text-[10px] font-mono text-ink-soft uppercase tracking-wider block">
                  Footwear
                </span>
                <h3 className="type-display text-xl text-ink font-semibold mt-1 group-hover:underline">
                  Shoes &amp; Trainers
                </h3>
                <p className="text-xs text-ink-soft mt-1.5 leading-relaxed font-mono">
                  Lightweight everyday sneakers and versatile low-profile
                  trainers.
                </p>
              </div>
              <div className="pt-4 flex items-center justify-between text-xs font-mono border-t border-border/60">
                <span className="text-ink-soft">8 Styles</span>
                <span className="text-ink font-semibold group-hover:translate-x-1 transition-transform">
                  Shop Shoes &rarr;
                </span>
              </div>
            </Link>

            {/* Accessories */}
            <Link
              href="/catalog?dept=accessories"
              className="group border border-border bg-paper p-5 hover:border-ink transition-all shadow-xs flex flex-col justify-between min-h-[190px]"
            >
              <div>
                <span className="text-[10px] font-mono text-ink-soft uppercase tracking-wider block">
                  Daily Accessories
                </span>
                <h3 className="type-display text-xl text-ink font-semibold mt-1 group-hover:underline">
                  Accessories
                </h3>
                <p className="text-xs text-ink-soft mt-1.5 leading-relaxed font-mono">
                  Durable canvas totes, minimal caps, and everyday essentials.
                </p>
              </div>
              <div className="pt-4 flex items-center justify-between text-xs font-mono border-t border-border/60">
                <span className="text-ink-soft">9 Pieces</span>
                <span className="text-ink font-semibold group-hover:translate-x-1 transition-transform">
                  Shop Accessories &rarr;
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Trending in Cambodia / Best Sellers Row */}
      <section className="bg-paper border-b border-border py-14 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b-2 border-ink pb-3 mb-6 gap-2">
            <div>
              <span className="type-label text-[11px] uppercase tracking-widest text-ink-soft block">
                Popular in Phnom Penh
              </span>
              <h2 className="type-display text-2xl sm:text-3xl font-semibold text-ink mt-0.5">
                Most Loved This Week
              </h2>
            </div>
            <Link
              href="/catalog?sort=price-asc"
              className="text-xs font-mono text-ink-soft hover:text-ink underline underline-offset-4"
            >
              Browse All Best Sellers &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {trendingProducts.map((product) => (
              <div
                key={product.id}
                className="group border border-border bg-canvas/30 p-4 hover:border-ink transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-square w-full bg-paper border border-border p-3 flex items-center justify-center overflow-hidden">
                    <Image
                      src={product.thumbnail}
                      alt={product.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="border border-border bg-paper px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-ink">
                        {product.category}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <span className="text-[10px] font-mono text-ink-soft uppercase tracking-wider">
                      REF: CLO-00{product.id}
                    </span>
                    <h4 className="type-display text-sm font-semibold text-ink mt-0.5 line-clamp-1 group-hover:underline">
                      {product.title}
                    </h4>
                    <p className="text-xs font-mono font-bold text-ink mt-1">
                      ${product.price.toFixed(2)} USD
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border/80 flex items-center justify-between">
                  <Link
                    href={`/products/${product.id}`}
                    className="type-label text-xs uppercase tracking-wider text-ink hover:text-ctrl-red transition-colors underline underline-offset-4"
                  >
                    View Details
                  </Link>
                  <Link
                    href={`/products/${product.id}`}
                    className="border border-ink bg-ink text-paper px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider hover:bg-ink-soft transition-colors"
                  >
                    Select Size
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Fabric & Climate Guide */}
      <section className="bg-canvas border-b border-border py-14 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b-2 border-ink pb-3 mb-6 gap-2">
            <div>
              <span className="type-label text-[11px] uppercase tracking-widest text-ink-soft block">
                Fabric &amp; Climate Guide
              </span>
              <h2 className="type-display text-2xl sm:text-3xl font-semibold text-ink mt-0.5">
                Crafted for the Climate
              </h2>
            </div>
            <p className="text-xs font-mono text-ink-soft max-w-md">
              Fabrics selected specifically to stay cool outdoors and
              comfortable in air-conditioned spaces.
            </p>
          </div>

          {/* 3 Compact Spec Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="border border-border bg-paper p-5 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-ink-soft uppercase tracking-wider">
                    Fabric Spec 01
                  </span>
                  <span className="text-xs font-mono font-bold text-ink bg-canvas px-2 py-0.5 border border-border">
                    380 GSM
                  </span>
                </div>
                <h3 className="type-display text-lg font-semibold text-ink mt-2">
                  Heavyweight Organic Cotton
                </h3>
                <p className="text-xs font-mono text-ink-soft mt-1.5 leading-relaxed">
                  Crisp boxy structure that holds its shape all day, pre-shrunk
                  so it stays true to size after washing.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border/80 text-[11px] font-mono text-ink flex justify-between">
                <span>100% Organic</span>
                <span className="text-forest font-semibold">Pre-Shrunk</span>
              </div>
            </div>

            <div className="border border-border bg-paper p-5 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-ink-soft uppercase tracking-wider">
                    Fabric Spec 02
                  </span>
                  <span className="text-xs font-mono font-bold text-ink bg-canvas px-2 py-0.5 border border-border">
                    220 GSM
                  </span>
                </div>
                <h3 className="type-display text-lg font-semibold text-ink mt-2">
                  Stone-Washed Linen
                </h3>
                <p className="text-xs font-mono text-ink-soft mt-1.5 leading-relaxed">
                  Pure flax weave with an open texture that allows natural
                  airflow on warm, sunny afternoons.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border/80 text-[11px] font-mono text-ink flex justify-between">
                <span>Natural Flax</span>
                <span className="text-forest font-semibold">
                  Maximum Airflow
                </span>
              </div>
            </div>

            <div className="border border-border bg-paper p-5 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-ink-soft uppercase tracking-wider">
                    Fabric Spec 03
                  </span>
                  <span className="text-xs font-mono font-bold text-ink bg-canvas px-2 py-0.5 border border-border">
                    13.5 oz
                  </span>
                </div>
                <h3 className="type-display text-lg font-semibold text-ink mt-2">
                  Soft-Washed Selvedge Denim
                </h3>
                <p className="text-xs font-mono text-ink-soft mt-1.5 leading-relaxed">
                  Durable shuttle-loom denim pre-softened for immediate comfort
                  while keeping a sharp, clean drape.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border/80 text-[11px] font-mono text-ink flex justify-between">
                <span>Vintage Indigo</span>
                <span className="text-forest font-semibold">
                  Reinforced Seams
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Community Lookbook & Street Style Stories */}
      <section className="bg-paper border-b border-border py-14 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b-2 border-ink pb-3 mb-6 gap-2">
            <div>
              <span className="type-label text-[11px] uppercase tracking-widest text-ink-soft block">
                Community
              </span>
              <h2 className="type-display text-2xl sm:text-3xl font-semibold text-ink mt-0.5">
                Styled in Cambodia
              </h2>
            </div>
            <p className="text-xs font-mono text-ink-soft">
              Real reviews from customers in Phnom Penh, Siem Reap, and across
              Cambodia.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="border border-border bg-canvas/30 p-5 space-y-2.5">
              <span className="text-[10px] font-mono text-ink-soft uppercase tracking-wider block">
                Phnom Penh &bull; BKK1
              </span>
              <p className="text-xs font-mono text-ink leading-relaxed italic">
                &ldquo;The jacket has the exact structured drape I wanted
                without feeling stiff in the heat. Arrived in 2 hours via
                express rider.&rdquo;
              </p>
              <div className="pt-3 border-t border-border flex justify-between items-center text-[11px] font-mono">
                <span className="font-semibold text-ink">Sophea C.</span>
                <span className="text-ink-soft">Raw Denim Jacket</span>
              </div>
            </div>

            <div className="border border-border bg-canvas/30 p-5 space-y-2.5">
              <span className="text-[10px] font-mono text-ink-soft uppercase tracking-wider block">
                Siem Reap &bull; Wat Bo
              </span>
              <p className="text-xs font-mono text-ink leading-relaxed italic">
                &ldquo;Ordered via KHQR scan. The packaging was immaculate and
                the waffle fabric is so comfortable. Telegram support was
                fast.&rdquo;
              </p>
              <div className="pt-3 border-t border-border flex justify-between items-center text-[11px] font-mono">
                <span className="font-semibold text-ink">Vireak R.</span>
                <span className="text-ink-soft">Thermal Long Sleeve</span>
              </div>
            </div>

            <div className="border border-border bg-canvas/30 p-5 space-y-2.5">
              <span className="text-[10px] font-mono text-ink-soft uppercase tracking-wider block">
                Phnom Penh &bull; Tuol Kouk
              </span>
              <p className="text-xs font-mono text-ink leading-relaxed italic">
                &ldquo;Clean minimalist design with substantial fabric weight.
                The doorstep size exchange gave me complete confidence.&rdquo;
              </p>
              <div className="pt-3 border-t border-border flex justify-between items-center text-[11px] font-mono">
                <span className="font-semibold text-ink">Dara K.</span>
                <span className="text-ink-soft">Cropped Zip Hoodie</span>
              </div>
            </div>
          </div>

          {/* Direct Telegram Support Callout */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between border border-border bg-canvas p-4 text-xs font-mono gap-3">
            <div className="flex items-center gap-2.5 text-ink">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                Questions about sizing or fabrics? Our team is live on Telegram.
              </span>
            </div>
            <a
              href="https://t.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 border border-ink bg-ink text-paper px-3.5 py-1.5 text-[11px] font-mono uppercase tracking-wider hover:bg-ink-soft transition-colors"
            >
              <span>Chat on Telegram</span>
              <span>&rarr;</span>
            </a>
          </div>
        </div>
      </section>

      {/* 8. Private Archive Newsletter & VIP Drops */}
      <section className="bg-canvas py-14 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl border border-border bg-paper p-7 sm:p-8 text-center shadow-xs">
          <span className="type-label text-[11px] uppercase tracking-widest text-ink-soft">
            Member Archive
          </span>
          <h2 className="type-display text-xl sm:text-2xl font-semibold text-ink mt-1.5">
            Get 10% Off Your First Order
          </h2>
          <p className="text-xs font-mono text-ink-soft mt-1.5 max-w-sm mx-auto leading-relaxed">
            Join our member list for drop previews, private sales in Phnom Penh,
            and 10% off your first checkout.
          </p>

          <NewsletterForm />

          <p className="mt-2.5 text-[10px] font-mono text-ink-soft/70">
            No spam. You can unsubscribe anytime with one click.
          </p>
        </div>
      </section>
    </div>
  );
}
