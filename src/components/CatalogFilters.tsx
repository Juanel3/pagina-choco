"use client";

import { CATALOG_FILTERS, type ProductCategory } from "@/lib/catalog";

type Props = {
  active: ProductCategory;
  onChange: (category: ProductCategory) => void;
  counts: Record<ProductCategory, number>;
};

export function CatalogFilters({ active, onChange, counts }: Props) {
  return (
    <div className="mt-8 -mx-1 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex w-max min-w-full gap-2 sm:flex-wrap sm:justify-center">
        {CATALOG_FILTERS.map((filter) => {
          const isActive = active === filter.id;
          const count = counts[filter.id];

          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => onChange(filter.id)}
              className={`shrink-0 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors sm:text-sm ${
                isActive
                  ? "border-[#dc2626] bg-[#dc2626] text-cream"
                  : "border-white/15 bg-white/5 text-cream/80 hover:border-white/25 hover:bg-white/10 hover:text-cream"
              }`}
            >
              {filter.label}
              <span className={isActive ? "text-cream/90" : "text-cream/45"}>
                {" "}
                ({count})
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
