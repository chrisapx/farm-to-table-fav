import { useState, useCallback } from 'react';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  unit: string;
  quantity: number;
};

let cartListeners: Array<() => void> = [];
let cartItems: CartItem[] = [];

function notifyListeners() {
  cartListeners.forEach(fn => fn());
}

export function useCart() {
  const [, setTick] = useState(0);

  const rerender = useCallback(() => setTick(t => t + 1), []);

  // Subscribe on mount
  useState(() => {
    cartListeners.push(rerender);
    return () => {
      cartListeners = cartListeners.filter(fn => fn !== rerender);
    };
  });

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>) => {
    const existing = cartItems.find(i => i.id === item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cartItems.push({ ...item, quantity: 1 });
    }
    cartItems = [...cartItems];
    notifyListeners();
  }, []);

  const removeItem = useCallback((id: string) => {
    cartItems = cartItems.filter(i => i.id !== id);
    notifyListeners();
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      cartItems = cartItems.filter(i => i.id !== id);
    } else {
      const item = cartItems.find(i => i.id === id);
      if (item) item.quantity = quantity;
      cartItems = [...cartItems];
    }
    notifyListeners();
  }, []);

  const clearCart = useCallback(() => {
    cartItems = [];
    notifyListeners();
  }, []);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return {
    items: cartItems,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    total,
    count: cartItems.reduce((sum, i) => sum + i.quantity, 0),
  };
}
