"use client";

import Link from "next/link";
import { CartItemRow } from "@/components/CartItemRow";
import { useOrderList } from "@/components/OrderListProvider";
import { PAGE_TITLE_MOBILE_TWO_LINES } from "@/lib/theme";

export function OrderListPage() {
  const { items, removeItem } = useOrderList();

  return (
    <section className="px-4 pb-6 pt-2 sm:px-6 sm:pb-8">
      <div className="mx-auto max-w-3xl">
        <h1
          className={`text-3xl font-bold tracking-tight text-cream max-sm:text-3xl sm:text-4xl ${PAGE_TITLE_MOBILE_TWO_LINES}`}
        >
          Mi carrito
        </h1>
        <p className="mt-3 text-cream/70">
          Arma tu pedido aquí y envíanoslo por WhatsApp para gestionar tu
          compra.
        </p>

        {items.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-white/15 bg-neutral-800/45 p-8 text-center shadow-lg backdrop-blur-md backdrop-saturate-150">
            <p className="text-white">Tu carrito está vacío.</p>
            <Link
              href="/catalogo"
              className="group mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#dc2626] to-[#ef4444] px-7 text-sm font-semibold tracking-wide text-white shadow-[0_4px_12px_rgba(0,0,0,0.35),0_8px_24px_rgba(220,38,38,0.4)] transition-all hover:from-[#b91c1c] hover:to-[#dc2626] hover:shadow-[0_6px_16px_rgba(0,0,0,0.4),0_10px_28px_rgba(220,38,38,0.5)]"
            >
              Ver catálogo
              <svg
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>
        ) : (
          <ul className="mt-8 space-y-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="rounded-xl border border-white/10 bg-white p-4"
              >
                <CartItemRow
                  item={item}
                  onRemove={removeItem}
                  variant="page"
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
