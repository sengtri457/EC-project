"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { CartItem } from "@/types";
import { getStorageItem, setStorageItem } from "@/lib/storage";

const CART_STORAGE_KEY = "cart";

export function getCartItemKey(item: {
  productId: number;
  variantId?: number;
  selectedSize?: string;
  selectedColor?: string;
  id?: string;
}): string {
  if (item.id) return item.id;
  const parts = [
    item.productId,
    item.variantId ?? "",
    item.selectedSize ?? "",
    item.selectedColor ?? "",
  ];
  return parts.filter(Boolean).join("-");
}

function matchesItem(item: CartItem, idOrProductId: string | number): boolean {
  if (item.id && item.id === String(idOrProductId)) return true;
  if (getCartItemKey(item) === String(idOrProductId)) return true;
  if (typeof idOrProductId === "number" && item.productId === idOrProductId) return true;
  return false;
}

type CartState = {
  items: CartItem[];
  isLoaded: boolean;
};

type CartAction =
  | { type: "LOAD"; payload: CartItem[] }
  | { type: "ADD"; payload: { item: Omit<CartItem, "quantity">; quantity: number; maxStock?: number } }
  | { type: "UPDATE_QTY"; payload: { idOrProductId: string | number; quantity: number; maxStock?: number } }
  | { type: "REMOVE"; payload: { idOrProductId: string | number } }
  | { type: "TOGGLE_SELECT"; payload: { idOrProductId: string | number } }
  | { type: "SET_SELECT"; payload: { idOrProductId: string | number; selected: boolean } }
  | { type: "TOGGLE_SELECT_ALL"; payload: { selected?: boolean } }
  | { type: "REMOVE_SELECTED" }
  | { type: "CLEAR" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "LOAD":
      return {
        ...state,
        items: action.payload.map((item) => ({
          ...item,
          id: item.id || getCartItemKey(item),
          selected: item.selected ?? true,
        })),
        isLoaded: true,
      };

    case "ADD": {
      const { item, quantity, maxStock } = action.payload;
      const itemKey = getCartItemKey(item);
      const existingIndex = state.items.findIndex(
        (i) => i.id === itemKey || getCartItemKey(i) === itemKey
      );

      if (existingIndex > -1) {
        const currentQty = state.items[existingIndex].quantity;
        let newQty = currentQty + quantity;
        const effectiveMax = maxStock ?? state.items[existingIndex].maxStock;
        if (effectiveMax !== undefined && newQty > effectiveMax) {
          newQty = effectiveMax;
        }

        const nextItems = [...state.items];
        nextItems[existingIndex] = {
          ...nextItems[existingIndex],
          quantity: newQty,
          maxStock: effectiveMax,
          selected: true,
        };
        return { ...state, items: nextItems };
      }

      let initialQty = quantity;
      if (maxStock !== undefined && initialQty > maxStock) {
        initialQty = maxStock;
      }

      const newItem: CartItem = {
        id: itemKey,
        productId: item.productId,
        variantId: item.variantId,
        sku: item.sku,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
        title: item.title,
        price: item.price,
        thumbnail: item.thumbnail,
        quantity: initialQty,
        maxStock: maxStock,
        selected: true,
      };

      return {
        ...state,
        items: [...state.items, newItem],
      };
    }

    case "UPDATE_QTY": {
      const { idOrProductId, quantity, maxStock } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((i) => !matchesItem(i, idOrProductId)),
        };
      }

      return {
        ...state,
        items: state.items.map((item) => {
          if (matchesItem(item, idOrProductId)) {
            const effectiveMax = maxStock ?? item.maxStock;
            let validQty = quantity;
            if (effectiveMax !== undefined && validQty > effectiveMax) {
              validQty = effectiveMax;
            }
            return { ...item, quantity: validQty };
          }
          return item;
        }),
      };
    }

    case "REMOVE": {
      return {
        ...state,
        items: state.items.filter((i) => !matchesItem(i, action.payload.idOrProductId)),
      };
    }

    case "TOGGLE_SELECT": {
      return {
        ...state,
        items: state.items.map((item) =>
          matchesItem(item, action.payload.idOrProductId)
            ? { ...item, selected: item.selected === false ? true : false }
            : item
        ),
      };
    }

    case "SET_SELECT": {
      return {
        ...state,
        items: state.items.map((item) =>
          matchesItem(item, action.payload.idOrProductId)
            ? { ...item, selected: action.payload.selected }
            : item
        ),
      };
    }

    case "TOGGLE_SELECT_ALL": {
      const areAllSelected =
        state.items.length > 0 && state.items.every((i) => i.selected !== false);
      const targetState =
        action.payload.selected !== undefined ? action.payload.selected : !areAllSelected;
      return {
        ...state,
        items: state.items.map((item) => ({
          ...item,
          selected: targetState,
        })),
      };
    }

    case "REMOVE_SELECTED": {
      return {
        ...state,
        items: state.items.filter((item) => item.selected === false),
      };
    }

    case "CLEAR": {
      return {
        ...state,
        items: [],
      };
    }

    default:
      return state;
  }
}

interface CartContextType {
  items: CartItem[];
  isLoaded: boolean;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number, maxStock?: number, showDrawer?: boolean) => void;
  removeItem: (idOrProductId: string | number) => void;
  updateQty: (idOrProductId: string | number, quantity: number, maxStock?: number) => void;
  clearCart: () => void;
  // Selection
  toggleSelectItem: (idOrProductId: string | number) => void;
  setItemSelected: (idOrProductId: string | number, selected: boolean) => void;
  toggleSelectAll: (selected?: boolean) => void;
  removeSelectedItems: () => void;
  selectedItems: CartItem[];
  selectedItemCount: number;
  selectedSubtotal: number;
  selectedTax: number;
  selectedTotal: number;
  isAllSelected: boolean;
  hasSelectedItems: boolean;
  // Bag Totals
  itemCount: number;
  subtotal: number;
  tax: number;
  total: number;
  toastMessage: string | null;
  dismissToast: () => void;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isLoaded: false,
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initialLoadRef = useRef(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = getStorageItem<CartItem[]>(CART_STORAGE_KEY, []);
    dispatch({ type: "LOAD", payload: savedCart });
    initialLoadRef.current = true;
  }, []);

  // Save to localStorage only after initial load has occurred
  useEffect(() => {
    if (!initialLoadRef.current || !state.isLoaded) return;
    setStorageItem(CART_STORAGE_KEY, state.items);
  }, [state.items, state.isLoaded]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  }, []);

  const dismissToast = useCallback(() => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(null);
  }, []);

  const openDrawer = useCallback(() => {
    setIsDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity">, quantity = 1, maxStock?: number, showDrawer = true) => {
      dispatch({
        type: "ADD",
        payload: { item, quantity, maxStock },
      });
      const variantSuffix = item.selectedSize ? ` (${item.selectedSize})` : "";
      showToast(`Added "${item.title}${variantSuffix}" to your bag.`);
      if (showDrawer) {
        setIsDrawerOpen(true);
      }
    },
    [showToast]
  );

  const removeItem = useCallback((idOrProductId: string | number) => {
    dispatch({ type: "REMOVE", payload: { idOrProductId } });
  }, []);

  const updateQty = useCallback((idOrProductId: string | number, quantity: number, maxStock?: number) => {
    dispatch({ type: "UPDATE_QTY", payload: { idOrProductId, quantity, maxStock } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR" });
  }, []);

  const toggleSelectItem = useCallback((idOrProductId: string | number) => {
    dispatch({ type: "TOGGLE_SELECT", payload: { idOrProductId } });
  }, []);

  const setItemSelected = useCallback((idOrProductId: string | number, selected: boolean) => {
    dispatch({ type: "SET_SELECT", payload: { idOrProductId, selected } });
  }, []);

  const toggleSelectAll = useCallback((selected?: boolean) => {
    dispatch({ type: "TOGGLE_SELECT_ALL", payload: { selected } });
  }, []);

  const removeSelectedItems = useCallback(() => {
    dispatch({ type: "REMOVE_SELECTED" });
  }, []);

  // Full cart counts
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = Number(
    state.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)
  );
  const tax = Number((subtotal * 0.1).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));

  // Selected counts
  const selectedItems = state.items.filter((item) => item.selected !== false);
  const selectedItemCount = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  const selectedSubtotal = Number(
    selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)
  );
  const selectedTax = Number((selectedSubtotal * 0.1).toFixed(2));
  const selectedTotal = Number((selectedSubtotal + selectedTax).toFixed(2));
  const isAllSelected = state.items.length > 0 && state.items.every((item) => item.selected !== false);
  const hasSelectedItems = selectedItems.length > 0;

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isLoaded: state.isLoaded,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        toggleSelectItem,
        setItemSelected,
        toggleSelectAll,
        removeSelectedItems,
        selectedItems,
        selectedItemCount,
        selectedSubtotal,
        selectedTax,
        selectedTotal,
        isAllSelected,
        hasSelectedItems,
        itemCount,
        subtotal,
        tax,
        total,
        toastMessage,
        dismissToast,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
