"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductSearchSuggestions } from "@/components/ProductSearchSuggestions";
import type { Product } from "@/lib/catalog";

type Props = {
  className?: string;
};

export function NavSearch({ className }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isCatalog = pathname === "/catalogo";
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isCatalog) {
      setQuery(searchParams.get("q") ?? "");
    } else {
      setQuery("");
    }
  }, [isCatalog, searchParams]);

  const navigateToSearch = (value: string, replace = false) => {
    const url = value.trim()
      ? `/catalogo?q=${encodeURIComponent(value)}`
      : "/catalogo";

    if (replace) {
      router.replace(url, { scroll: false });
      return;
    }

    router.push(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);
    navigateToSearch(query, isCatalog);
  };

  const handleChange = (value: string) => {
    setQuery(value);
    setOpen(true);
    if (isCatalog) {
      navigateToSearch(value, true);
    }
  };

  const handleSelectProduct = (product: Product) => {
    setOpen(false);
    router.push(`/catalogo?product=${encodeURIComponent(product.id)}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative mx-auto w-full min-w-0 max-w-none sm:max-w-sm md:max-w-md ${className ?? ""}`}
    >
      <label htmlFor="nav-search" className="sr-only">
        Buscar productos
      </label>
      <div className="relative">
        <span
          className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-white/70"
          aria-hidden
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-3 w-3"
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
              clipRule="evenodd"
            />
          </svg>
        </span>
        <input
          id="nav-search"
          type="search"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            window.setTimeout(() => setOpen(false), 150);
          }}
          placeholder="Buscar…"
          className="w-full rounded-full border border-white/80 bg-black/55 py-2.5 pl-7 pr-2.5 text-xs text-cream placeholder:text-cream/40 focus:border-white focus:bg-black/70 focus:outline-none focus:ring-1 focus:ring-white/30 sm:py-2.5 sm:pl-8 sm:pr-3"
          autoComplete="off"
          role="combobox"
          aria-expanded={open && query.trim().length > 0}
          aria-controls="nav-search-results"
        />
      </div>

      {open && query.trim().length > 0 && (
        <div id="nav-search-results">
          <ProductSearchSuggestions
            query={query}
            onSelect={handleSelectProduct}
            variant="nav"
          />
        </div>
      )}
    </form>
  );
}
