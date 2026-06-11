import Image from "next/image";
import {
  encodePublicPath,
  formatPriceMXN,
  getProductById,
} from "@/lib/catalog";
import type { OrderListItem } from "@/lib/order-list";

type Props = {
  item: OrderListItem;
  onRemove: (id: string) => void;
  variant?: "panel" | "page";
};

function getItemPhoto(item: OrderListItem): string | null {
  if (item.photo) return item.photo;
  return getProductById(item.productId)?.photo ?? null;
}

export function CartItemRow({ item, onRemove, variant = "page" }: Props) {
  const photo = getItemPhoto(item);
  const isPanel = variant === "panel";

  return (
    <div
      className={`flex items-start gap-3 ${
        isPanel ? "rounded-xl px-2 py-2 hover:bg-neutral-50" : "gap-4"
      }`}
    >
      <div
        className={`relative shrink-0 overflow-hidden rounded-lg bg-[#eeeff0] ${
          isPanel ? "h-14 w-14" : "h-20 w-20 sm:h-24 sm:w-24"
        }`}
      >
        {photo ? (
          <Image
            src={encodePublicPath(photo)}
            alt={item.name}
            fill
            className="object-contain p-1"
            sizes={isPanel ? "56px" : "96px"}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-800 text-[10px] font-bold uppercase text-white/70">
            CM
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={`font-medium leading-snug ${
            isPanel
              ? "line-clamp-2 text-xs text-neutral-900"
              : "font-semibold text-neutral-900"
          }`}
        >
          {item.name}
        </p>
        {item.flavor && (
          <p
            className={`mt-0.5 ${
              isPanel ? "text-[11px] text-neutral-500" : "text-sm text-neutral-500"
            }`}
          >
            {isPanel ? item.flavor : `Sabor: ${item.flavor}`}
          </p>
        )}
        <p
          className={`font-semibold text-[#dc2626] ${
            isPanel ? "mt-1 text-xs" : "mt-2 text-base"
          }`}
        >
          {formatPriceMXN(item.price)}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onRemove(item.id)}
        className={`shrink-0 rounded-full transition-colors ${
          isPanel
            ? "px-2 py-1 text-[11px] text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
            : "px-3 py-1.5 text-xs font-medium text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
        }`}
      >
        Quitar
      </button>
    </div>
  );
}
