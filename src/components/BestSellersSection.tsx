"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import {
  BEST_SELLER_ITEMS,
  getProductById,
  type Product,
} from "@/lib/catalog";
import { SECTION_BG } from "@/lib/theme";

export function BestSellersSection() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });

  const items = BEST_SELLER_ITEMS.flatMap(({ id, label }) => {
    const product = getProductById(id);
    return product ? [{ product, label }] : [];
  });

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section
      id="mas-vendidos"
      data-nav-black-bg
      className="scroll-mt-28 bg-black px-4 pt-6 pb-14 sm:px-6 sm:pt-8 sm:pb-20 sm:scroll-mt-32"
      style={{ backgroundColor: SECTION_BG }}
      aria-labelledby="best-sellers-heading"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="best-sellers-heading"
            className="font-title text-3xl font-normal uppercase tracking-[0.25em] text-[#ff6a00] sm:text-4xl lg:text-5xl"
          >
            Los más vendidos
          </h2>
          <p className="mt-6 text-base leading-relaxed text-cream/80 sm:text-lg">
            Los suplementos favoritos de nuestros clientes. Desliza la galería
            o toca un producto para ver el detalle.
          </p>
        </div>

        <div className="mt-10 px-6 sm:mt-12 sm:px-10 md:px-14 lg:px-20">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#dc2626]/80 bg-[#dc2626] text-cream shadow-lg transition-colors hover:bg-[#b91c1c] disabled:pointer-events-none disabled:opacity-0 sm:h-9 sm:w-9"
              aria-label="Producto anterior"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
            </button>

            <div className="min-w-0 flex-1 overflow-hidden" ref={emblaRef}>
              <ul className="flex touch-pan-y gap-2.5 sm:gap-3">
                {items.map(({ product, label }) => (
                  <li
                    key={product.id}
                    className="h-full min-w-0 shrink-0 grow-0 basis-[74%] sm:basis-[46%] md:basis-[34%] lg:basis-[28%] xl:basis-[23%]"
                  >
                    <ProductCard
                      product={product}
                      displayName={label}
                      variant="gallery"
                      onSelect={setSelectedProduct}
                    />
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={scrollNext}
              disabled={!canScrollNext}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#dc2626]/80 bg-[#dc2626] text-cream shadow-lg transition-colors hover:bg-[#b91c1c] disabled:pointer-events-none disabled:opacity-0 sm:h-9 sm:w-9"
              aria-label="Producto siguiente"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
            </button>
          </div>
        </div>
      </div>

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  );
}
