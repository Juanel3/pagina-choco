"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useOrderList } from "@/components/OrderListProvider";
import {
  buildOrderMessage,
  buildWhatsAppUrl,
  CONTACT_REGIONS,
  type ContactRegionId,
} from "@/lib/contact";
import { formatPriceMXN } from "@/lib/catalog";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function ContactModal({ open, onClose }: Props) {
  const { items } = useOrderList();
  const [mounted, setMounted] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<ContactRegionId | null>(
    null,
  );

  const total = items.reduce((sum, item) => sum + item.price, 0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      setSelectedRegion(null);
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  const selectedRegionData = CONTACT_REGIONS.find(
    (region) => region.id === selectedRegion,
  );

  const handleContact = () => {
    if (!selectedRegionData) return;

    const message = buildOrderMessage(items);
    const url = buildWhatsAppUrl(selectedRegionData.whatsapp, message);
    window.open(url, "_blank", "noopener,noreferrer");
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center p-4 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 z-0 bg-black/55 backdrop-blur-[2px]"
        aria-label="Cerrar"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-lg text-neutral-700 shadow-sm transition-colors hover:bg-white"
          aria-label="Cerrar"
        >
          ×
        </button>

        <div className="p-6 sm:p-8">
          <h2
            id="contact-modal-title"
            className="pr-10 text-xl font-bold text-neutral-900 sm:text-2xl"
          >
            Contactar a un asesor
          </h2>
          <p className="mt-2 text-sm text-neutral-500">
            Selecciona tu ciudad y te conectamos por WhatsApp.
          </p>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Ciudad
            </p>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {CONTACT_REGIONS.map((region) => {
                const isSelected = selectedRegion === region.id;

                return (
                  <button
                    key={region.id}
                    type="button"
                    onClick={() => setSelectedRegion(region.id)}
                    className={`rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors ${
                      isSelected
                        ? "bg-[#dc2626] text-white"
                        : "bg-[#eeeff0] text-neutral-800 hover:bg-[#e4e5e6]"
                    }`}
                  >
                    {region.label}
                  </button>
                );
              })}
            </div>
          </div>

          {items.length > 0 && (
            <p className="mt-5 text-sm text-neutral-600">
              Tu pedido: {items.length} producto
              {items.length === 1 ? "" : "s"} ·{" "}
              <span className="font-semibold text-[#dc2626]">
                {formatPriceMXN(total)}
              </span>
            </p>
          )}

          <button
            type="button"
            onClick={handleContact}
            disabled={!selectedRegion}
            className={`mt-6 inline-flex h-11 w-full items-center justify-center rounded-full text-sm font-medium text-white transition-colors ${
              selectedRegion
                ? "bg-[#dc2626] hover:bg-[#b91c1c]"
                : "cursor-not-allowed bg-[#dc2626]/40"
            }`}
          >
            Contactar
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
