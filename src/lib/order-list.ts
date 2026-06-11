export type OrderListItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  flavor: string | null;
  photo: string | null;
};

const STORAGE_KEY = "chochomania-order-list";

export function loadOrderList(): OrderListItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Partial<OrderListItem>[];
    if (!Array.isArray(parsed)) return [];

    return parsed.map((item) => ({
      id: item.id ?? crypto.randomUUID(),
      productId: item.productId ?? "",
      name: item.name ?? "",
      price: item.price ?? 0,
      flavor: item.flavor ?? null,
      photo: item.photo ?? null,
    }));
  } catch {
    return [];
  }
}

export function saveOrderList(items: OrderListItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function createOrderListItem(
  item: Omit<OrderListItem, "id">,
): OrderListItem {
  return {
    ...item,
    id: crypto.randomUUID(),
  };
}
