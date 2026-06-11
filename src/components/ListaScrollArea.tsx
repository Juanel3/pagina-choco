"use client";

import { useOrderList } from "@/components/OrderListProvider";

type Props = {
  children: React.ReactNode;
};

export function ListaScrollArea({ children }: Props) {
  const { items } = useOrderList();

  return (
    <div
      className={`min-h-0 flex-1 overflow-y-auto ${
        items.length > 0
          ? "pb-[calc(15rem+env(safe-area-inset-bottom))] sm:pb-[calc(10rem+env(safe-area-inset-bottom))]"
          : "pb-[calc(9rem+env(safe-area-inset-bottom))] sm:pb-[calc(4.5rem+env(safe-area-inset-bottom))]"
      }`}
    >
      {children}
    </div>
  );
}
