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

type CartState = {
  items: CartItem[];
  isLoaded: boolean;
};

type CartAction =
  | { type: "LOAD"; payload: CartItem[] }
  | { type: "ADD"; payload: { item: Omit<CartItem, "quantity">; quantity: number; maxStock?: number } }
  | { type: "UPDATE_QTY"; payload: { productId: number; quantity: number; maxStock?: number } }
  | { type: "REMOVE"; payload: { productId: number } }
  | { type: "TOGGLE_SELECT"; payload: { productId: number } }
  | { type: "SET_SELECT"; payload: { productId: number; selected: boolean } }
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
          selected: item.selected ?? true,
        })),
        isLoaded: true,
      };

    case "ADD": {
      const { item, quantity, maxStock } = action.payload;
      const existingIndex = state.items.findIndex((i) => i.productId === item.productId);

      if (existingIndex > -1) {
        const currentQty = state.items[existingIndex].quantity;
        let newQty = currentQty + quantity;
        if (maxStock !== undefined && newQty > maxStock) {
          newQty = maxStock;
        }

        const nextItems = [...state.items];
        nextItems[existingIndex] = {
          ...nextItems[existingIndex],
          quantity: newQty,
          selected: true,
        };
        return { ...state, items: nextItems };
      }

      let initialQty = quantity;
      if (maxStock !== undefined && initialQty > maxStock) {
        initialQty = maxStock;
      }

      return {
        ...state,
        items: [
          ...state.items,
          {
            productId: item.productId,
            title: item.title,
            price: item.price,
            thumbnail: item.thumbnail,
            quantity: initialQty,
            selected: true,
          },
        ],
      };
    }

    case "UPDATE_QTY": {
      const { productId, quantity, maxStock } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((i) => i.productId !== productId),
        };
      }

      let validQty = quantity;
      if (maxStock !== undefined && validQty > maxStock) {
        validQty = maxStock;
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.productId === productId ? { ...item, quantity: validQty } : item
        ),
      };
    }

    case "REMOVE": {
      return {
        ...state,
        items: state.items.filter((i) => i.productId !== action.payload.productId),
      };
    }

    case "TOGGLE_SELECT": {
      return {
        ...state,
        items: state.items.map((item) =>
          item.productId === action.payload.productId
            ? { ...item, selected: item.selected === false ? true : false }
            : item
        ),
      };
    }

    case "SET_SELECT": {
      return {
        ...state,
        items: state.items.map((item) =>
          item.productId === action.payload.productId
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
  removeItem: (productId: number) => void;
  updateQty: (productId: number, quantity: number, maxStock?: number) => void;
  clearCart: () => void;
  // Selection
  toggleSelectItem: (productId: number) => void;
  setItemSelected: (productId: number, selected: boolean) => void;
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
      showToast(`Added "${item.title}" to your bag.`);
      if (showDrawer) {
        setIsDrawerOpen(true);
      }
    },
    [showToast]
  );

  const removeItem = useCallback((productId: number) => {
    dispatch({ type: "REMOVE", payload: { productId } });
  }, []);

  const updateQty = useCallback((productId: number, quantity: number, maxStock?: number) => {
    dispatch({ type: "UPDATE_QTY", payload: { productId, quantity, maxStock } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR" });
  }, []);

  const toggleSelectItem = useCallback((productId: number) => {
    dispatch({ type: "TOGGLE_SELECT", payload: { productId } });
  }, []);

  const setItemSelected = useCallback((productId: number, selected: boolean) => {
    dispatch({ type: "SET_SELECT", payload: { productId, selected } });
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
