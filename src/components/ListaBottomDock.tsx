"use client";

import { CartSummaryBar } from "@/components/CartSummaryBar";
import { SiteFooter } from "@/components/SiteFooter";
import { useOrderList } from "@/components/OrderListProvider";

export function ListaBottomDock() {
  const { items } = useOrderList();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex flex-col pb-[env(safe-area-inset-bottom)]">
      {items.length > 0 && (
        <div className="pointer-events-none px-4 pb-2 pt-1 sm:px-6">
          <CartSummaryBar docked />
        </div>
      )}
      <SiteFooter />
    </div>
  );
}
