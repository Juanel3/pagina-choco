"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BEST_SELLERS_VIEW_PARAM,
  BEST_SELLER_ITEMS,
  CATALOG_FILTERS,
  CATALOG_PRODUCTS,
  getBestSellingProducts,
  getProductById,
  getProductsByCategory,
  getProductsBySearch,
  type Product,
  type ProductCategory,
} from "@/lib/catalog";
import { PAGE_TITLE_MOBILE_TWO_LINES, SECTION_BG } from "@/lib/theme";
import { CatalogFilters } from "@/components/CatalogFilters";
import { CatalogSearch } from "@/components/CatalogSearch";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetailModal } from "@/components/ProductDetailModal";

const INITIAL_CATEGORY: ProductCategory = "proteina";

type Props = {
  /** En la página dedicada /catalogo el encabezado va en CatalogPageHero */
  variant?: "embedded" | "page";
};

export function CatalogSection({ variant = "embedded" }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] =
    useState<ProductCategory>(INITIAL_CATEGORY);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setSearchQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  useEffect(() => {
    const productId = searchParams.get("product");
    if (!productId) return;

    const product = getProductById(productId);
    if (product) {
      setSelectedProduct(product);
    }
  }, [searchParams]);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchQuery(value);

      const params = new URLSearchParams(searchParams.toString());

      if (value.trim()) {
        params.set("q", value);
      } else {
        params.delete("q");
      }

      const queryString = params.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );

  const handleCategoryChange = useCallback(
    (category: ProductCategory) => {
      setActiveCategory(category);

      const params = new URLSearchParams(searchParams.toString());
      params.delete("ver");

      const queryString = params.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );

  const clearProductParam = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (!params.has("product")) return;

    params.delete("product");
    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  }, [pathname, router, searchParams]);

  const handleProductSelect = useCallback(
    (product: Product) => {
      setSelectedProduct(product);

      const params = new URLSearchParams(searchParams.toString());
      params.set("product", product.id);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const counts = useMemo(() => {
    return CATALOG_FILTERS.reduce(
      (acc, filter) => {
        acc[filter.id] = getProductsByCategory(filter.id).length;
        return acc;
      },
      {} as Record<ProductCategory, number>,
    );
  }, []);

  const isBestSellersView =
    searchParams.get("ver") === BEST_SELLERS_VIEW_PARAM;

  const bestSellerLabels = useMemo(
    () =>
      Object.fromEntries(
        BEST_SELLER_ITEMS.map((item) => [item.id, item.label]),
      ) as Record<string, string>,
    [],
  );

  const filteredProducts = useMemo(() => {
    const trimmed = searchQuery.trim();
    if (trimmed) {
      return getProductsBySearch(trimmed);
    }
    if (isBestSellersView) {
      return getBestSellingProducts();
    }
    return getProductsByCategory(activeCategory);
  }, [activeCategory, isBestSellersView, searchQuery]);

  const hasSearch = searchQuery.trim().length > 0;

  const activeLabel =
    CATALOG_FILTERS.find((f) => f.id === activeCategory)?.label ?? "";

  const isPage = variant === "page";

  return (
    <section
      id={isPage ? undefined : "catalogo"}
      data-nav-black-bg={isPage ? true : undefined}
      className={`relative bg-black pb-16 sm:pb-20 ${
        isPage
          ? "-mt-10 px-6 pt-0 sm:-mt-12 sm:px-8 sm:pt-2 md:px-10 lg:px-14"
          : "px-4 pt-10 sm:px-6 sm:pt-14"
      }`}
      style={{ backgroundColor: SECTION_BG }}
    >
      <div className="relative mx-auto max-w-7xl">
        {!isPage && (
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#ff6a00]">
              Catálogo
            </p>
            <h2
              className={`mt-2 text-4xl font-bold tracking-tight text-cream max-sm:text-2xl sm:text-5xl ${PAGE_TITLE_MOBILE_TWO_LINES}`}
            >
              Nuestros productos
            </h2>
            <p className="mt-4 text-cream/75">
              {CATALOG_PRODUCTS.length} suplementos disponibles. Filtra por
              categoría y toca un producto para ver el detalle.
            </p>
          </div>
        )}

        <CatalogSearch
          value={searchQuery}
          onChange={handleSearchChange}
          onSelectProduct={handleProductSelect}
          className={isPage ? "mt-0" : ""}
        />

        {!isBestSellersView || hasSearch ? (
          <CatalogFilters
            active={activeCategory}
            onChange={handleCategoryChange}
            counts={counts}
          />
        ) : (
          <p className="mt-6 text-center text-sm font-medium text-cream/75">
            Los suplementos más pedidos por nuestros clientes
          </p>
        )}

        {filteredProducts.length > 0 ? (
          <ul
            className={
              isPage
                ? "mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4"
                : "mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
            }
          >
            {filteredProducts.map((product) => (
              <li key={product.id} className="h-full">
                <ProductCard
                  product={product}
                  oswaldTitle
                  displayName={
                    isBestSellersView
                      ? bestSellerLabels[product.id]
                      : undefined
                  }
                  onSelect={setSelectedProduct}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-10 text-center text-cream/60">
            {hasSearch
              ? `No hay resultados para “${searchQuery.trim()}”.`
              : isBestSellersView
                ? "No hay productos destacados por ahora."
                : `No hay productos en ${activeLabel} por ahora.`}
          </p>
        )}
      </div>

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => {
          setSelectedProduct(null);
          clearProductParam();
        }}
      />
    </section>
  );
}
