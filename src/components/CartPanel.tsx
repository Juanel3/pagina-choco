"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { formatPriceMXN } from "@/lib/catalog";
import { CartItemRow } from "@/components/CartItemRow";
import { useOrderList } from "@/components/OrderListProvider";

export function CartPanel() {
  const { items, count, isOpen, closeCart, removeItem } = useOrderList();
  const panelRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [panelPos, setPanelPos] = useState({ top: 0, right: 0 });

  const total = items.reduce((sum, item) => sum + item.price, 0);

  const updatePanelPosition = useCallback(() => {
    const trigger = Array.from(
      document.querySelectorAll<HTMLElement>("[data-cart-trigger]"),
    ).find((element) => element.getBoundingClientRect().width > 0);
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    setPanelPos({
      top: rect.bottom + 8,
      right: Math.max(8, window.innerWidth - rect.right),
    });
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    updatePanelPosition();

    const onResize = () => updatePanelPosition();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);

    let onPointerDown: ((event: MouseEvent) => void) | null = null;
    const timeoutId = window.setTimeout(() => {
      onPointerDown = (event: MouseEvent) => {
        const target = event.target as Node;
        if (
          panelRef.current?.contains(target) ||
          Array.from(document.querySelectorAll("[data-cart-trigger]")).some(
            (element) => element.contains(target),
          )
        ) {
          return;
        }
        closeCart();
      };
      document.addEventListener("mousedown", onPointerDown);
    }, 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
      if (onPointerDown) {
        document.removeEventListener("mousedown", onPointerDown);
      }
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, closeCart, updatePanelPosition]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      ref={panelRef}
      className="fixed z-[200] w-[min(calc(100vw-2rem),20rem)] overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl"
      style={{ top: panelPos.top, right: panelPos.right }}
      role="dialog"
      aria-label="Carrito"
    >
      <div className="border-b border-neutral-100 px-4 py-3">
        <p className="text-sm font-semibold text-neutral-900">Tu carrito</p>
        <p className="text-xs text-neutral-500">
          {count === 0
            ? "Aún no has agregado productos"
            : `${count} producto${count === 1 ? "" : "s"}`}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="px-4 py-6 text-center">
          <p className="text-sm text-neutral-500">Tu carrito está vacío.</p>
          <Link
            href="/catalogo"
            onClick={closeCart}
            className="mt-3 inline-flex text-sm font-medium text-[#dc2626] hover:underline"
          >
            Ver catálogo
          </Link>
        </div>
      ) : (
        <>
          <ul className="max-h-72 overflow-y-auto px-2 py-2">
            {items.map((item) => (
              <li key={item.id}>
                <CartItemRow
                  item={item}
                  onRemove={removeItem}
                  variant="panel"
                />
              </li>
            ))}
          </ul>

          <div className="border-t border-neutral-100 px-4 py-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Total</span>
              <span className="font-semibold text-[#dc2626]">
                {formatPriceMXN(total)}
              </span>
            </div>
            <Link
              href="/lista"
              onClick={closeCart}
              className="mt-3 inline-flex h-9 w-full items-center justify-center rounded-full bg-[#dc2626] text-xs font-medium text-white transition-colors hover:bg-[#b91c1c]"
            >
              Ver carrito completo
            </Link>
          </div>
        </>
      )}
    </div>,
    document.body,
  );
}
