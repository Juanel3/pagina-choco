"use client";

import { useState } from "react";
import { ProductSearchSuggestions } from "@/components/ProductSearchSuggestions";
import type { Product } from "@/lib/catalog";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSelectProduct?: (product: Product) => void;
  className?: string;
};

export function CatalogSearch({
  value,
  onChange,
  onSelectProduct,
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);

  const handleSelectProduct = (product: Product) => {
    setOpen(false);
    onSelectProduct?.(product);
  };

  return (
    <div className={`relative mx-auto mt-6 max-w-xl ${className}`}>
      <label htmlFor="catalog-search" className="sr-only">
        Buscar productos
      </label>
      <span
        className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-neutral-400"
        aria-hidden
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-5 w-5"
        >
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
            clipRule="evenodd"
          />
        </svg>
      </span>
      <input
        id="catalog-search"
        type="search"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          window.setTimeout(() => setOpen(false), 150);
        }}
        placeholder="Buscar por nombre o sabor…"
        className="relative z-10 w-full rounded-full border border-neutral-200 bg-white py-3 pl-11 pr-11 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors focus:border-[#ff6a00]/60 focus:outline-none focus:ring-2 focus:ring-[#ff6a00]/25 sm:text-base"
        autoComplete="off"
        role="combobox"
        aria-expanded={open && value.trim().length > 0}
        aria-controls="catalog-search-results"
      />
      {value.length > 0 && (
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            onChange("");
            setOpen(false);
          }}
          className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
          aria-label="Limpiar búsqueda"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </button>
      )}

      {open && value.trim().length > 0 && (
        <div id="catalog-search-results">
          <ProductSearchSuggestions
            query={value}
            onSelect={handleSelectProduct}
            variant="catalog"
          />
        </div>
      )}
    </div>
  );
}
