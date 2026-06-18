"use client";

import { useState } from "react";
import { formatPriceMXN } from "@/lib/catalog";
import { ContactModal } from "@/components/ContactModal";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { useOrderList } from "@/components/OrderListProvider";

type Props = {
  floating?: boolean;
  /** Tarjeta flotante encima del footer (vista carrito). */
  docked?: boolean;
};

export function CartSummaryBar({
  floating = false,
  docked = false,
}: Props) {
  const { items, clearList } = useOrderList();
  const [contactOpen, setContactOpen] = useState(false);

  if (items.length === 0) return null;

  const total = items.reduce((sum, item) => sum + item.price, 0);

  const card = (
    <div
      className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${
        floating || docked
          ? "pointer-events-auto mx-auto max-w-3xl rounded-2xl border border-neutral-200/80 bg-white/95 px-4 py-4 shadow-[0_16px_48px_rgba(0,0,0,0.28)] backdrop-blur-md sm:px-5"
          : "mx-auto max-w-3xl"
      }`}
    >
          <p className="text-lg font-semibold text-neutral-900">
            Total estimado:{" "}
            <span className="text-[#dc2626]">{formatPriceMXN(total)}</span>
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={clearList}
              className="inline-flex h-10 items-center justify-center rounded-full border border-neutral-200 px-5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
            >
              Vaciar lista
            </button>
            <button
              type="button"
              onClick={() => setContactOpen(true)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 text-sm font-medium text-white transition-colors hover:bg-[#20BA5A]"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Finalizar pedido
            </button>
          </div>
    </div>
  );

  if (docked) {
    return (
      <>
        {card}
        <ContactModal
          open={contactOpen}
          onClose={() => setContactOpen(false)}
        />
      </>
    );
  }

  return (
    <>
      <div
        className={
          floating
            ? "pointer-events-none fixed inset-x-0 bottom-4 z-40 px-4 sm:bottom-6 sm:px-6 pb-[env(safe-area-inset-bottom)]"
            : "z-10 shrink-0 border-t border-neutral-200/80 bg-white/95 px-4 py-4 shadow-[0_-8px_24px_rgba(0,0,0,0.12)] backdrop-blur-md sm:px-6"
        }
      >
        {card}
      </div>

      <ContactModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
      />
    </>
  );
}
