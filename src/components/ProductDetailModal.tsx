"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  formatFlavorCount,
  formatProductPrice,
  isProductAvailable,
  PRODUCT_TITLE_TYPOGRAPHY,
  type Product,
} from "@/lib/catalog";
import { useOrderList } from "@/components/OrderListProvider";
import { ProductImage } from "@/components/ProductImage";

type Props = {
  product: Product | null;
  onClose: () => void;
};

export function ProductDetailModal({ product, onClose }: Props) {
  const { addItems } = useOrderList();
  const [mounted, setMounted] = useState(false);
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!product) {
      setSelectedFlavors([]);
      return;
    }

    setSelectedFlavors(
      product.flavors.length === 1 ? [product.flavors[0]] : [],
    );
  }, [product]);

  useEffect(() => {
    if (!product) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [product, onClose]);

  if (!product || !mounted) return null;

  const available = isProductAvailable(product);
  const requiresFlavor = product.flavors.length > 1;
  const canAdd =
    available && (!requiresFlavor || selectedFlavors.length > 0);

  const toggleFlavor = (flavor: string) => {
    setSelectedFlavors((current) =>
      current.includes(flavor)
        ? current.filter((item) => item !== flavor)
        : [...current, flavor],
    );
  };

  const handleAddToList = () => {
    if (!canAdd || product.price === null) return;

    const price = product.price;
    const flavorsToAdd =
      product.flavors.length === 0
        ? [null]
        : product.flavors.length === 1
          ? [product.flavors[0]]
          : selectedFlavors;

    addItems(
      flavorsToAdd.map((flavor) => ({
        productId: product.id,
        name: product.name,
        price,
        flavor,
        photo: product.photo,
      })),
    );
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center p-4 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-detail-title"
    >
      <button
        type="button"
        className="absolute inset-0 z-0 bg-black/55 backdrop-blur-[2px]"
        aria-label="Cerrar"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[min(92vh,720px)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:max-h-[min(88vh,480px)] sm:flex-row">
        <div className="w-full shrink-0 sm:h-auto sm:w-[340px]">
          <ProductImage
            name={product.name}
            photo={product.photo}
            variant="detail"
            className="h-full w-full"
          />
        </div>

        <div className="relative flex min-h-0 flex-1 flex-col">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-lg text-neutral-700 shadow-sm transition-colors hover:bg-white"
            aria-label="Cerrar detalle"
          >
            ×
          </button>

          <div className="min-h-0 flex-1 overflow-y-auto p-6 pb-4 sm:p-8 sm:pb-4">
            <h2
              id="product-detail-title"
              className={`pr-10 text-2xl text-neutral-900 sm:text-3xl ${PRODUCT_TITLE_TYPOGRAPHY}`}
            >
              {product.name}
            </h2>

            <p
              className={`mt-4 text-2xl font-semibold ${
                available ? "text-[#dc2626]" : "text-neutral-500"
              }`}
            >
              {formatProductPrice(product.price)}
            </p>

            <p className="mt-2 text-sm font-medium text-neutral-500">
              {formatFlavorCount(product.flavors.length)}
            </p>

            {product.flavors.length > 0 && (
              <div className="mt-5">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  {requiresFlavor
                    ? "Selecciona uno o más sabores"
                    : "Sabor disponible"}
                </h3>
                <ul
                  className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2"
                  role="listbox"
                  aria-label="Sabores"
                  aria-multiselectable={requiresFlavor}
                >
                  {product.flavors.map((flavor) => {
                    const isSelected = selectedFlavors.includes(flavor);

                    return (
                      <li key={flavor} role="presentation">
                        <button
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => {
                            if (!requiresFlavor) return;
                            toggleFlavor(flavor);
                          }}
                          className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium leading-snug transition-colors ${
                            isSelected
                              ? "bg-[#dc2626] text-white"
                              : "bg-[#eeeff0] text-neutral-800 hover:bg-[#e4e5e6]"
                          }`}
                        >
                          {flavor}
                        </button>
                      </li>
                    );
                  })}
                </ul>
                {requiresFlavor && selectedFlavors.length === 0 && (
                  <p className="mt-2 text-xs text-neutral-500">
                    Elige al menos un sabor para añadir a tu lista.
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="relative z-50 shrink-0 border-t border-neutral-100 bg-white px-6 py-4 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] sm:px-8">
            {selectedFlavors.length > 0 && (
              <p className="mb-2 text-center text-xs text-neutral-500">
                {selectedFlavors.length === 1 ? (
                  <>
                    Sabor seleccionado:{" "}
                    <span className="font-medium text-neutral-800">
                      {selectedFlavors[0]}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="font-medium text-neutral-800">
                      {selectedFlavors.length} sabores seleccionados
                    </span>
                  </>
                )}
              </p>
            )}
            <button
              type="button"
              onClick={handleAddToList}
              disabled={!canAdd}
              className={`relative z-50 inline-flex h-11 w-full items-center justify-center rounded-full text-sm font-medium text-white transition-colors ${
                canAdd
                  ? "bg-[#dc2626] hover:bg-[#b91c1c]"
                  : "cursor-not-allowed bg-[#dc2626]/40"
              }`}
            >
              {!available
                ? "No disponible"
                : selectedFlavors.length > 1
                  ? `Añadir ${selectedFlavors.length} a la lista`
                  : "Añadir a lista"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
