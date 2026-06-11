"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  createOrderListItem,
  loadOrderList,
  saveOrderList,
  type OrderListItem,
} from "@/lib/order-list";

type OrderListContextValue = {
  items: OrderListItem[];
  addItem: (item: Omit<OrderListItem, "id">) => void;
  addItems: (items: Omit<OrderListItem, "id">[]) => void;
  removeItem: (id: string) => void;
  clearList: () => void;
  count: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
};

const OrderListContext = createContext<OrderListContextValue | null>(null);

export function OrderListProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<OrderListItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setItems(loadOrderList());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveOrderList(items);
  }, [items, hydrated]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((open) => !open), []);

  const addItem = useCallback((item: Omit<OrderListItem, "id">) => {
    setItems((current) => [...current, createOrderListItem(item)]);
    setIsOpen(true);
  }, []);

  const addItems = useCallback((newItems: Omit<OrderListItem, "id">[]) => {
    if (newItems.length === 0) return;
    setItems((current) => [
      ...current,
      ...newItems.map((item) => createOrderListItem(item)),
    ]);
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const clearList = useCallback(() => {
    setItems([]);
  }, []);

  const value = useMemo(
    () => ({
      items,
      addItem,
      addItems,
      removeItem,
      clearList,
      count: items.length,
      isOpen,
      openCart,
      closeCart,
      toggleCart,
    }),
    [items, addItem, addItems, removeItem, clearList, isOpen, openCart, closeCart, toggleCart],
  );

  return (
    <OrderListContext.Provider value={value}>{children}</OrderListContext.Provider>
  );
}

export function useOrderList() {
  const context = useContext(OrderListContext);
  if (!context) {
    throw new Error("useOrderList debe usarse dentro de OrderListProvider");
  }
  return context;
}
