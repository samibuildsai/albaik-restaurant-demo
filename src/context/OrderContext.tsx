"use client";

import { createContext, useContext, useReducer, useEffect, useRef, ReactNode } from "react";
import { Order } from "@/types";
import { getOrders, saveOrders, ORDERS_STORAGE_KEY } from "@/lib/orders";

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
}

type OrderAction =
  | { type: "ADD_ORDER"; payload: Order }
  | { type: "SET_CURRENT_ORDER"; payload: Order | null }
  | { type: "CLEAR_CURRENT_ORDER" }
  | { type: "LOAD_ORDERS"; payload: Order[] };

function orderReducer(state: OrderState, action: OrderAction): OrderState {
  switch (action.type) {
    case "ADD_ORDER":
      return {
        ...state,
        orders: [action.payload, ...state.orders.filter((o) => o.id !== action.payload.id)],
        currentOrder: action.payload,
      };
    case "SET_CURRENT_ORDER":
      return { ...state, currentOrder: action.payload };
    case "CLEAR_CURRENT_ORDER":
      return { ...state, currentOrder: null };
    case "LOAD_ORDERS":
      return { ...state, orders: action.payload };
    default:
      return state;
  }
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
};

interface OrderContextType extends OrderState {
  addOrder: (order: Order) => void;
  setCurrentOrder: (order: Order | null) => void;
  clearCurrentOrder: () => void;
  refreshOrders: () => void;
  getOrderByNumber: (orderNumber: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(orderReducer, initialState);
  const loadedRef = useRef(false);

  // Load orders from the shared localStorage key on mount
  useEffect(() => {
    try {
      dispatch({ type: "LOAD_ORDERS", payload: getOrders() });
    } catch (error) {
      console.error("Failed to load orders:", error);
    }
    loadedRef.current = true;
  }, []);

  // Persist changes (never before the initial load, so nothing gets wiped)
  useEffect(() => {
    if (!loadedRef.current) return;
    try {
      saveOrders(state.orders);
    } catch (error) {
      console.error("Failed to save orders:", error);
    }
  }, [state.orders]);

  const addOrder = (order: Order) => dispatch({ type: "ADD_ORDER", payload: order });
  const setCurrentOrder = (order: Order | null) => dispatch({ type: "SET_CURRENT_ORDER", payload: order });
  const clearCurrentOrder = () => dispatch({ type: "CLEAR_CURRENT_ORDER" });

  const refreshOrders = () => {
    dispatch({ type: "LOAD_ORDERS", payload: getOrders() });
  };

  const getOrderByNumber = (orderNumber: string): Order | undefined => {
    const key = orderNumber.trim().toUpperCase();
    return (
      state.orders.find((order) => order.orderNumber.toUpperCase() === key) ||
      state.orders.find((order) => order.id.toUpperCase() === key)
    );
  };

  return (
    <OrderContext.Provider
      value={{
        ...state,
        addOrder,
        setCurrentOrder,
        clearCurrentOrder,
        refreshOrders,
        getOrderByNumber,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
}

export { ORDERS_STORAGE_KEY };
