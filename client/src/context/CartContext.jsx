import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const c = localStorage.getItem('shopstack_cart');
    return c ? JSON.parse(c) : [];
  });

  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('shopstack_cart', JSON.stringify(newCart));
  };

  const addToCart = (product, qty = 1) => {
    const existing = cart.find((i) => i.product === product._id);
    if (existing) {
      saveCart(cart.map((i) => i.product === product._id ? { ...i, qty: i.qty + qty } : i));
    } else {
      saveCart([...cart, { product: product._id, name: product.name, image: product.image, price: product.price, qty }]);
    }
  };

  const updateQty = (productId, qty) => {
    if (qty <= 0) return removeFromCart(productId);
    saveCart(cart.map((i) => i.product === productId ? { ...i, qty } : i));
  };

  const removeFromCart = (productId) => {
    saveCart(cart.filter((i) => i.product !== productId));
  };

  const clearCart = () => saveCart([]);

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQty, removeFromCart, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
