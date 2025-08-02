"use client";

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
// Chỉ import các type bạn đã cung cấp và được sử dụng
import { User, Product, CartItemResponse } from '../types';
import Cookies from 'js-cookie';
import { axiosClient } from '@/app/Service/ApiClient';
import { GetCookie, DeleteCookie } from '@/app/Service/ServerComponents';

// --- AppState chỉ chứa các trường cần thiết ---
type AppState = {
  user: User | null;
  cart: CartItemResponse[];
  products: Product[];
  isLoading: boolean;
  error: string | null;
};

// --- AppAction đã loại bỏ SET_ORDERS và SET_MESSAGES ---
type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'LOGOUT' }
  | { type: 'ADD_TO_CART'; payload: CartItemResponse }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'UPDATE_CART_ITEM'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART'; payload: CartItemResponse[] }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// --- initialState đã loại bỏ orders và messages ---
const initialState: AppState = {
  user: null,
  cart: [],
  products: [],
  isLoading: false,
  error: null,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// --- appReducer đã loại bỏ các case không cần thiết ---
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null, cart: [] };
    case 'SET_CART':
      return {
        ...state,
        // Nếu payload là undefined/null, gán cho nó một mảng rỗng
        cart: action.payload || [], 
      };
    case 'ADD_TO_CART':
        return { ...state, cart: [...state.cart, action.payload] };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload),
      };
    case 'UPDATE_CART_ITEM':
        return {
            ...state,
            cart: state.cart.map(item => {
                if (item.id === action.payload.id && item.variants[0]) {
                    const updatedVariants = [...item.variants];
                    updatedVariants[0] = { ...updatedVariants[0], quantity: action.payload.quantity };
                    return { ...item, variants: updatedVariants };
                }
                return item;
            })
        }
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Logic load user của bạn...
  useEffect(() => {
    // ...
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) { throw new Error('useApp must be used within AppProvider'); }
  return context;
}