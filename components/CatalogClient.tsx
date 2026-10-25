"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Product, Audience, Department, Subcategory } from "@/types";
import CatalogFilterDrawer from "./CatalogFilterDrawer";
import ProductCard from "./ProductCard";

interface CatalogClientProps {
  initialProducts: Product[];
}

export default function CatalogClient({ initialProducts }: CatalogClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAudience, setSelectedAudience] = useState<Audience>("all");
  const [selectedDepartment, setSelectedDepartment] = useState<Department>("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory>("all");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");

  const syncFiltersFromLocation = useCallback(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const aud = params.get("audience");
    const dept = params.get("dept") || params.get("department");
    const sub = params.get("subcategory");
    const q = params.get("q") || params.get("search");
    const sort = params.get("sort");

    if (aud && ["all", "men", "women", "kids"].includes(aud)) {
      setSelectedAudience(aud as Audience);
    }
    if (dept && ["all", "clothes", "shoes", "accessories"].includes(dept)) {
      setSelectedDepartment(dept as Department);
    }
    if (sub) {
      setSelectedSubcategory(sub as Subcategory);
    }
    if (q !== null && q !== undefined) {
      setSearchQuery(q);
    }
    if (sort === "price-asc" || sort === "price-desc" || sort === "featured") {
      setSortBy(sort);
    }
  }, []);

  useEffect(() => {
    syncFiltersFromLocation();
    window.addEventListener("popstate", syncFiltersFromLocation);
    window.addEventListener("clothes:navigate-filter", syncFiltersFromLocation);

    return () => {
      window.removeEventListener("popstate", syncFiltersFromLocation);
      window.removeEventListener("clothes:navigate-filter", syncFiltersFromLocation);
    };
  }, [syncFiltersFromLocation]);

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = initialProducts.filter((product) => {
      // 1. Search Query Filter
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        (product.category && product.category.toLowerCase().includes(query)) ||
        (product.fabric && product.fabric.toLowerCase().includes(query)) ||
        (product.subcategory && product.subcategory.toLowerCase().includes(query));

      // 2. Audience Filter (Level 1)
      const matchesAudience =
        selectedAudience === "all" ||
        product.audience === selectedAudience ||
        product.audience === "unisex";

      // 3. Department Filter (Level 2)
      const matchesDepartment =
        selectedDepartment === "all" || product.department === selectedDepartment;

      // 4. Subcategory Filter (Level 3)
      const matchesSubcategory =
        selectedSubcategory === "all" || product.subcategory === selectedSubcategory;

      return matchesSearch && matchesAudience && matchesDepartment && matchesSubcategory;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return a.id - b.id;
    });
  }, [
    initialProducts,
    searchQuery,
    selectedAudience,
    selectedDepartment,
    selectedSubcategory,
    sortBy,
  ]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedAudience("all");
    setSelectedDepartment("all");
    setSelectedSubcategory("all");
    setSortBy("featured");

    if (typeof window !== "undefined" && window.location.search) {
      window.history.pushState({}, "", window.location.pathname);
    }
  };

  return (
    <section id="catalog" className="bg-backdrop px-[clamp(1rem,4vw,3.5rem)] py-16 border-t border-border">
      {/* Centered Editorial Max-Width Container */}
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b-2 border-ink pb-6">
          <div>
            <span className="type-label text-xs uppercase tracking-widest text-ink-soft block">
              Lookbook Archive
            </span>
            <h2 className="type-display mt-2 text-2xl sm:text-3xl lg:text-4xl text-ink">
              Full Store Catalog
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-ink-soft max-w-lg">
              Explore statement silhouettes across knitwear, tailoring, outerwear, and footwear.
            </p>
          </div>

          <div className="text-xs font-mono text-ink-soft shrink-0">
            Displaying <span className="font-bold text-ink">{filteredAndSortedProducts.length}</span> of{" "}
            {initialProducts.length} items
          </div>
        </div>

        {/* Option 2: Interactive Capsule Slide-Over Drawer */}
        <CatalogFilterDrawer
          selectedAudience={selectedAudience}
          onSelectAudience={setSelectedAudience}
          selectedDepartment={selectedDepartment}
          onSelectDepartment={setSelectedDepartment}
          selectedSubcategory={selectedSubcategory}
          onSelectSubcategory={setSelectedSubcategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          filteredCount={filteredAndSortedProducts.length}
          totalCount={initialProducts.length}
          onReset={handleResetFilters}
        />

        {/* 3-Column Architectural Hairline Lookbook Grid (2-cols on mobile for tight balance) */}
        <div className="mt-8 border-t border-l border-border grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3">
          {filteredAndSortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredAndSortedProducts.length === 0 && (
          <div className="py-20 text-center border border-border bg-paper/60 mt-8">
            <p className="type-display text-lg text-ink">No matching silhouettes found</p>
            <p className="text-xs text-ink-soft mt-1 font-mono">
              No items match your filter criteria.
            </p>
            <button
              onClick={handleResetFilters}
              className="type-label mt-5 px-5 py-2.5 bg-ink text-paper text-xs uppercase tracking-widest hover:bg-ink-soft transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
