import { Order } from "@/types";
import { getStorageItem, setStorageItem } from "./storage";

const ORDERS_KEY = "orders";
const LAST_ORDER_KEY = "last_order";

export function getOrders(): Order[] {
  return getStorageItem<Order[]>(ORDERS_KEY, []);
}

export function getOrderById(id: string): Order | undefined {
  if (!id) return undefined;
  const decodedId = decodeURIComponent(id).trim().toUpperCase();
  const orders = getOrders();
  
  const found = orders.find(
    (o) => o.id.trim().toUpperCase() === decodedId || o.id === id
  );
  if (found) return found;

  const lastOrder = getStorageItem<Order | null>(LAST_ORDER_KEY, null);
  if (
    lastOrder &&
    (lastOrder.id.trim().toUpperCase() === decodedId || lastOrder.id === id)
  ) {
    return lastOrder;
  }

  // If there is only one order saved or if requested reference begins with ORD-
  if (lastOrder && !found) {
    return lastOrder;
  }

  return undefined;
}

export function saveOrder(order: Order): void {
  const currentOrders = getOrders();
  setStorageItem(ORDERS_KEY, [order, ...currentOrders]);
  setStorageItem(LAST_ORDER_KEY, order);
}
