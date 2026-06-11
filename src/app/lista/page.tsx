import type { Metadata } from "next";
import { ListaBottomDock } from "@/components/ListaBottomDock";
import { ListaScrollArea } from "@/components/ListaScrollArea";
import { OrderListPage } from "@/components/OrderListPage";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Mi carrito · Chochomanía Supplements",
  description: "Revisa los productos que agregaste a tu carrito.",
};

export default function ListaPage() {
  return (
    <div
      data-nav-black-bg
      className="chocho-catalog-hero flex min-h-dvh flex-col"
    >
      <SiteHeader />
      <main className="flex min-h-0 flex-1 flex-col pt-[9rem] sm:pt-28">
        <ListaScrollArea>
          <OrderListPage />
        </ListaScrollArea>
      </main>
      <ListaBottomDock />
    </div>
  );
}
