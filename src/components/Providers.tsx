"use client";

import { CartPanel } from "@/components/CartPanel";
import { OrderListProvider } from "@/components/OrderListProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <OrderListProvider>
      {children}
      <CartPanel />
    </OrderListProvider>
  );
}
