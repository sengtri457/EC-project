"use client";

import { useState, useEffect } from "react";
import { Audience, Department, Subcategory } from "@/types";

interface CatalogFilterDrawerProps {
  selectedAudience: Audience;
  onSelectAudience: (a: Audience) => void;
  selectedDepartment: Department;
  onSelectDepartment: (d: Department) => void;
  selectedSubcategory: Subcategory;
  onSelectSubcategory: (s: Subcategory) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortBy: "featured" | "price-asc" | "price-desc";
  onSortChange: (sort: "featured" | "price-asc" | "price-desc") => void;
  filteredCount: number;
  totalCount: number;
  onReset: () => void;
}

const AUDIENCES: { id: Audience; label: string }[] = [
  { id: "all", label: "All Audiences" },
  { id: "men", label: "Men" },
  { id: "women", label: "Women" },
  { id: "kids", label: "Kids" },
];

const DEPARTMENTS: { id: Department; label: string }[] = [
  { id: "all", label: "All Departments" },
  { id: "clothes", label: "Clothes" },
  { id: "shoes", label: "Shoes" },
  { id: "accessories", label: "Accessories" },
];

const SUBCATEGORIES_MAP: Record<
  Department,
  { id: Subcategory; label: string }[]
> = {
  all: [
    { id: "all", label: "All Silhouettes" },
    { id: "tshirt", label: "T-Shirt" },
    { id: "sweater", label: "Sweater" },
    { id: "hoodies", label: "Hoodies" },
    { id: "running", label: "Running" },
    { id: "basketball", label: "Basketball" },
    { id: "lifestyle", label: "Lifestyle" },
    { id: "hat", label: "Hat" },
    { id: "jewelry", label: "Jewelry" },
    { id: "socks", label: "Socks" },
  ],
  clothes: [
    { id: "all", label: "All Clothes" },
    { id: "tshirt", label: "T-Shirt" },
    { id: "sweater", label: "Sweater" },
    { id: "hoodies", label: "Hoodies" },
  ],
  shoes: [
    { id: "all", label: "All Shoes" },
    { id: "running", label: "Running" },
    { id: "basketball", label: "Basketball" },
    { id: "lifestyle", label: "Lifestyle" },
  ],
  accessories: [
    { id: "all", label: "All Accessories" },
    { id: "hat", label: "Hat" },
    { id: "jewelry", label: "Jewelry" },
    { id: "socks", label: "Socks" },
  ],
};

export default function CatalogFilterDrawer({
  selectedAudience,
  onSelectAudience,
  selectedDepartment,
  onSelectDepartment,
  selectedSubcategory,
  onSelectSubcategory,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  filteredCount,
  totalCount,
  onReset,
}: CatalogFilterDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const activeFilterCount =
    (selectedAudience !== "all" ? 1 : 0) +
    (selectedDepartment !== "all" ? 1 : 0) +
    (selectedSubcategory !== "all" ? 1 : 0);

  const hasFilters = activeFilterCount > 0 || Boolean(searchQuery.trim());
  const currentSubcategories = SUBCATEGORIES_MAP[selectedDepartment];

  return (
    <div className="pt-6">
      {/* 1. Ultra-Clean Single-Line Trigger Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-border">
        {/* Left: Filter Trigger Button */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className={`type-label flex items-center gap-2.5 h-10 px-4 text-xs tracking-wider transition-all border ${
              activeFilterCount > 0
                ? "border-ink bg-ink text-paper shadow-sm"
                : "border-border-strong bg-paper text-ink hover:border-ink hover:bg-paper"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
            <span>Filters</span>
            {activeFilterCount > 0 ? (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-ctrl-red px-1 text-[10px] font-mono font-bold text-paper">
                {activeFilterCount}
              </span>
            ) : (
              <span className="text-[10px] text-ink-soft">▾</span>
            )}
          </button>

          {/* Active summary pill if filtered */}
          {hasFilters && (
            <div className="flex items-center gap-2 text-xs font-mono bg-paper border border-border px-3 py-1.5">
              <span className="text-ink-soft uppercase text-[10px]">Active:</span>
              <span className="font-bold text-ink uppercase">
                {selectedAudience !== "all" && `${selectedAudience} • `}
                {selectedDepartment !== "all" && `${selectedDepartment} • `}
                {selectedSubcategory !== "all" && `${selectedSubcategory}`}
                {activeFilterCount === 0 && `&quot;${searchQuery}&quot;`}
              </span>
              <button
                type="button"
                onClick={onReset}
                title="Clear all filters"
                className="ml-1 text-ctrl-red hover:text-ink transition-colors font-bold"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* Right: Search & Sort */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Filter pieces…"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="slip-field h-10 text-xs w-44 sm:w-56 pl-0"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-0 top-3 text-xs text-ink-soft hover:text-ctrl-red font-mono"
              >
                ×
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-ink-soft uppercase hidden sm:inline">
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as any)}
              className="h-10 px-2.5 text-xs font-mono border border-border-strong bg-paper text-ink outline-none cursor-pointer hover:border-ink transition-colors"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Interactive Slide-Down / Modal Capsule Drawer (Option 2) */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl bg-paper border-2 border-ink shadow-2xl my-8 p-6 sm:p-8 text-ink"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-start justify-between border-b-2 border-ink pb-5">
              <div>
                <span className="type-label text-xs uppercase tracking-widest text-ink-soft block">
                  Interactive Taxonomy Drawer
                </span>
                <h3 className="type-display text-2xl sm:text-3xl text-ink mt-1">
                  Filter Archive
                </h3>
                <p className="text-xs text-ink-soft mt-1 font-mono">
                  Select Audience, Department, and Garment Silhouette to drill down.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="type-label px-3 py-1.5 border border-border-strong hover:border-ink hover:bg-ink hover:text-paper transition-all text-xs uppercase tracking-widest"
              >
                ✕ Close
              </button>
            </div>

            {/* 3-Column Cascading Filter Grid */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {/* Column 1: Audience */}
              <div className="space-y-3">
                <span className="type-label text-xs uppercase tracking-wider text-ink border-b border-border pb-2 block">
                  1. Audience
                </span>
                <div className="space-y-1.5">
                  {AUDIENCES.map((aud) => {
                    const isChecked = selectedAudience === aud.id;
                    return (
                      <button
                        key={aud.id}
                        type="button"
                        onClick={() => onSelectAudience(aud.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-mono transition-all text-left border ${
                          isChecked
                            ? "border-ink bg-ink text-paper font-bold shadow-sm"
                            : "border-transparent bg-backdrop text-ink hover:bg-paper hover:border-border-strong"
                        }`}
                      >
                        <span className="uppercase">{aud.label}</span>
                        {isChecked && <span>✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Column 2: Department */}
              <div className="space-y-3">
                <span className="type-label text-xs uppercase tracking-wider text-ink border-b border-border pb-2 block">
                  2. Department
                </span>
                <div className="space-y-1.5">
                  {DEPARTMENTS.map((dept) => {
                    const isChecked = selectedDepartment === dept.id;
                    return (
                      <button
                        key={dept.id}
                        type="button"
                        onClick={() => {
                          onSelectDepartment(dept.id);
                          onSelectSubcategory("all");
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-mono transition-all text-left border ${
                          isChecked
                            ? "border-ink bg-ink text-paper font-bold shadow-sm"
                            : "border-transparent bg-backdrop text-ink hover:bg-paper hover:border-border-strong"
                        }`}
                      >
                        <span className="uppercase">{dept.label}</span>
                        {isChecked && <span>✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Column 3: Silhouette (Context-Aware) */}
              <div className="space-y-3">
                <span className="type-label text-xs uppercase tracking-wider text-ink border-b border-border pb-2 block">
                  3. Silhouette ({selectedDepartment})
                </span>
                <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                  {currentSubcategories.map((sub) => {
                    const isChecked = selectedSubcategory === sub.id;
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => onSelectSubcategory(sub.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-mono transition-all text-left border ${
                          isChecked
                            ? "border-ctrl-red bg-ctrl-red text-paper font-bold shadow-sm"
                            : "border-transparent bg-backdrop text-ink hover:bg-paper hover:border-border-strong"
                        }`}
                      >
                        <span className="uppercase">{sub.label}</span>
                        {isChecked && <span>✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="mt-8 pt-5 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onReset}
                  className="text-xs font-mono text-ink-soft hover:text-ctrl-red underline underline-offset-4"
                >
                  Reset all filters
                </button>
                <span className="text-xs font-mono text-ink-soft">
                  • {filteredCount} matching {filteredCount === 1 ? "item" : "items"}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="type-label h-12 px-7 bg-ink text-paper text-xs uppercase tracking-widest hover:bg-ink-soft transition-all shadow-md active:scale-[0.99]"
              >
                Apply &amp; View ({filteredCount})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
