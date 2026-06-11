"use client";

import { useEffect } from "react";
import { useOrderList } from "@/components/OrderListProvider";

type Props = {
  active?: boolean;
};

function CartIcon({ count }: { count: number }) {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
        aria-hidden
      >
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
      </svg>
      {count > 0 && (
        <span className="absolute -right-1.5 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#dc2626] px-1 text-[10px] font-semibold text-white">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </>
  );
}

export function CartButton({ active = false }: Props) {
  const { count, isOpen, toggleCart, closeCart } = useOrderList();
  const ariaLabel =
    count > 0 ? `Carrito, ${count} productos` : "Carrito";

  useEffect(() => {
    if (active && isOpen) closeCart();
  }, [active, isOpen, closeCart]);

  if (active) {
    return (
      <span
        data-cart-trigger
        className="relative flex items-center justify-center py-1.5 text-cream"
        aria-current="page"
        aria-label={ariaLabel}
      >
        <CartIcon count={count} />
      </span>
    );
  }

  return (
    <button
      type="button"
      data-cart-trigger
      onClick={(event) => {
        event.stopPropagation();
        toggleCart();
      }}
      className={`relative flex items-center justify-center py-1.5 transition-opacity hover:opacity-80 ${
        isOpen ? "text-cream" : "text-cream/80"
      }`}
      aria-label={ariaLabel}
      aria-expanded={isOpen}
      aria-haspopup="dialog"
    >
      <CartIcon count={count} />
    </button>
  );
}
