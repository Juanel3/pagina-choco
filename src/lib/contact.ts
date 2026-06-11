import type { OrderListItem } from "@/lib/order-list";

export type ContactRegionId = "monterrey" | "tampico";

export type ContactRegion = {
  id: ContactRegionId;
  label: string;
  whatsapp: string;
};

export const INSTAGRAM_URL =
  "https://www.instagram.com/chochomania.suplementos/";

export const CONTACT_REGIONS: ContactRegion[] = [
  { id: "monterrey", label: "Monterrey", whatsapp: "528122924974" },
  { id: "tampico", label: "Tampico", whatsapp: "528441422809" },
];

export function getContactRegion(id: ContactRegionId): ContactRegion {
  return CONTACT_REGIONS.find((region) => region.id === id)!;
}

function formatProductName(item: OrderListItem): string {
  if (!item.flavor) return item.name;
  return `${item.name} (${item.flavor})`;
}

export function buildOrderMessage(items: OrderListItem[]): string {
  if (items.length === 1) {
    return `Hola, buen día. Me interesa saber si tienen disponible el producto ${formatProductName(items[0])}. ¡Gracias!`;
  }

  const productList = items
    .map((item) => `(${formatProductName(item)})`)
    .join("\n");

  return [
    "Hola, buen día. Me interesa saber si tienen disponibles los siguientes productos:",
    productList,
    "¡Gracias!.",
  ].join("\n");
}

export function buildWhatsAppUrl(whatsapp: string, message: string): string {
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
}
