"use client";

import {
  formatFlavorCount,
  formatProductPrice,
  isProductAvailable,
  PRODUCT_TITLE_TYPOGRAPHY,
  type Product,
} from "@/lib/catalog";
import { ProductImage } from "@/components/ProductImage";

type Props = {
  product: Product;
  onSelect: (product: Product) => void;
  displayName?: string;
  variant?: "default" | "gallery";
  oswaldTitle?: boolean;
};

export function ProductCard({
  product,
  onSelect,
  displayName,
  variant = "default",
  oswaldTitle = false,
}: Props) {
  const isGallery = variant === "gallery";

  return (
    <button
      type="button"
      onClick={() => onSelect(product)}
      className={`flex h-full w-full flex-col overflow-hidden border border-neutral-200/80 bg-white text-left shadow-sm transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6a00] ${
        isGallery ? "rounded-lg" : "rounded-xl"
      }`}
    >
      <ProductImage
        name={product.name}
        photo={product.photo}
        variant="card"
        compact
        className="aspect-square w-full min-h-0"
      />

      <div className={`flex min-h-0 flex-1 flex-col ${isGallery ? "p-2" : "p-3"}`}>
        <h3
          className={`line-clamp-2 text-neutral-900 ${
            oswaldTitle
              ? `${PRODUCT_TITLE_TYPOGRAPHY} min-h-[2.5em] text-[0.7rem] sm:text-xs`
              : `font-bold leading-tight ${
                  isGallery
                    ? "min-h-[2.25em] text-[0.6rem] sm:text-[0.65rem]"
                    : "min-h-[2.5em] text-[0.7rem] sm:text-xs"
                }`
          }`}
        >
          {displayName ?? product.name}
        </h3>

        <p
          className={`font-semibold ${
            isGallery ? "mt-1 text-sm sm:text-base" : "mt-2 text-base sm:text-lg"
          } ${
            isProductAvailable(product)
              ? "text-[#dc2626]"
              : "text-neutral-500"
          }`}
        >
          {formatProductPrice(product.price)}
        </p>

        <p
          className={`text-neutral-500 ${
            isGallery
              ? "mt-1 text-[0.6rem]"
              : "mt-1.5 text-[0.65rem] sm:text-xs"
          }`}
        >
          {formatFlavorCount(product.flavors.length)}
        </p>

        <div className={isGallery ? "mt-auto pt-2" : "mt-auto pt-3"}>
          <span
            className={`inline-flex w-full items-center justify-center rounded-full bg-[#dc2626] font-medium text-white ${
              isGallery ? "h-7 text-[0.65rem]" : "h-8 text-xs"
            }`}
          >
            Ver detalle
          </span>
        </div>
      </div>
    </button>
  );
}
