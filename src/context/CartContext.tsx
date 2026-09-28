"use client";

import { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { CartItem, MenuItem, Deal } from "@/types";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  promoCode: string;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: { item: MenuItem | Deal; quantity?: number } }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "TOGGLE_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }
  | { type: "CLEAR_CART" }
  | { type: "SET_PROMO_CODE"; payload: string }
  | { type: "LOAD_CART"; payload: CartItem[] };

const CART_STORAGE_KEY = "flame-fork-cart";
const PROMO_STORAGE_KEY = "flame-fork-promo";

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { item, quantity = 1 } = action.payload;
      const existingIndex = state.items.findIndex(
        (i) => i.id === item.id && i.type === (("category" in item) ? "menu" : "deal")
      );

      let newItems: CartItem[];
      if (existingIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const newItem: CartItem = {
          id: item.id,
          type: "category" in item ? "menu" : "deal",
          name: item.name,
          price: "category" in item ? item.price : item.discountedPrice,
          image: item.image,
          quantity,
          description: "description" in item ? item.description : undefined,
          dealItems: "items" in item ? item.items : undefined,
        };
        newItems = [...state.items, newItem];
      }
      return { ...state, items: newItems, isOpen: true };
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.id !== action.payload);
      return { ...state, items: newItems };
    }

    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== action.payload.id),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    }

    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };

    case "OPEN_CART":
      return { ...state, isOpen: true };

    case "CLOSE_CART":
      return { ...state, isOpen: false };

    case "CLEAR_CART":
      return { ...state, items: [] };

    case "SET_PROMO_CODE":
      return { ...state, promoCode: action.payload };

    case "LOAD_CART":
      return { ...state, items: action.payload };

    default:
      return state;
  }
}

const initialState: CartState = {
  items: [],
  isOpen: false,
  promoCode: "",
};

interface CartContextType extends CartState {
  addItem: (item: MenuItem | Deal, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  clearCart: () => void;
  setPromoCode: (code: string) => void;
  subtotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      const savedPromo = localStorage.getItem(PROMO_STORAGE_KEY);
      if (savedCart) {
        dispatch({ type: "LOAD_CART", payload: JSON.parse(savedCart) });
      }
      if (savedPromo) {
        dispatch({ type: "SET_PROMO_CODE", payload: savedPromo });
      }
    } catch (error) {
      console.error("Failed to load cart:", error);
    }
  }, []);

  // Save cart to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
      localStorage.setItem(PROMO_STORAGE_KEY, state.promoCode);
    } catch (error) {
      console.error("Failed to save cart:", error);
    }
  }, [state.items, state.promoCode]);

  const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        ...state,
        subtotal,
        itemCount,
        addItem: (item: MenuItem | Deal, quantity?: number) =>
          dispatch({ type: "ADD_ITEM", payload: { item, quantity } }),
        removeItem: (id: string) => dispatch({ type: "REMOVE_ITEM", payload: id }),
        updateQuantity: (id: string, quantity: number) =>
          dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } }),
        toggleCart: () => dispatch({ type: "TOGGLE_CART" }),
        openCart: () => dispatch({ type: "OPEN_CART" }),
        closeCart: () => dispatch({ type: "CLOSE_CART" }),
        clearCart: () => dispatch({ type: "CLEAR_CART" }),
        setPromoCode: (code: string) => dispatch({ type: "SET_PROMO_CODE", payload: code }),
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