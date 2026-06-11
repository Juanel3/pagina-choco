"use client";

import { useMemo } from "react";
import {
  CATALOG_FILTERS,
  formatProductPrice,
  isProductAvailable,
  getProductsBySearch,
  type Product,
} from "@/lib/catalog";

const MAX_RESULTS = 8;

type Props = {
  query: string;
  onSelect: (product: Product) => void;
  variant?: "nav" | "catalog";
};

export function ProductSearchSuggestions({
  query,
  onSelect,
  variant = "catalog",
}: Props) {
  const trimmed = query.trim();
  const results = useMemo(() => {
    if (!trimmed) return [];
    return getProductsBySearch(trimmed).slice(0, MAX_RESULTS);
  }, [trimmed]);

  if (!trimmed) return null;

  const isNav = variant === "nav";

  if (results.length === 0) {
    return (
      <div
        className={`absolute top-full z-[100] mt-1.5 rounded-xl border px-3 py-2.5 text-xs shadow-lg ${
          isNav
            ? "left-0 right-0 border-white/15 bg-neutral-900 text-cream/60"
            : "left-0 right-0 border-neutral-200 bg-white text-neutral-500"
        }`}
      >
        Sin resultados
      </div>
    );
  }

  return (
    <ul
      className={`absolute top-full z-[100] mt-1.5 max-h-72 overflow-y-auto rounded-xl border py-1 shadow-lg ${
        isNav
          ? "left-0 right-0 border-white/15 bg-neutral-900"
          : "left-0 right-0 border-neutral-200 bg-white"
      }`}
      role="listbox"
      aria-label="Resultados de búsqueda"
    >
      {results.map((product) => {
        const categoryLabel = CATALOG_FILTERS.find(
          (filter) => filter.id === product.category,
        )?.label;

        return (
          <li key={product.id} role="option">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onSelect(product)}
              className={`flex w-full flex-col gap-0.5 px-3 py-2.5 text-left transition-colors ${
                isNav
                  ? "text-cream hover:bg-white/10"
                  : "text-neutral-900 hover:bg-neutral-50"
              }`}
            >
              <span className="line-clamp-2 text-xs font-medium leading-snug sm:text-sm">
                {product.name}
              </span>
              <span className="flex items-center justify-between gap-2 text-[11px] sm:text-xs">
                {categoryLabel && (
                  <span className={isNav ? "text-cream/50" : "text-neutral-400"}>
                    {categoryLabel}
                  </span>
                )}
                <span
                  className={`shrink-0 font-semibold ${
                    isProductAvailable(product)
                      ? "text-[#dc2626]"
                      : "text-neutral-500"
                  }`}
                >
                  {formatProductPrice(product.price)}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
