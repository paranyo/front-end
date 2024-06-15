import { atom, useAtom } from "jotai";
import { CartItem, GetProduct } from "./interface";
import { useEffect } from "react";
import toast from "react-hot-toast";

const cartAtom = atom<CartItem[]>([]);

export function useCart() {
  const [cart, setCart] = useAtom(cartAtom)

  const handleAddCart = (item: GetProduct) => {
    if (alreadyInCart(item.name)) {
      toast('이미 장바구니에 담긴 상품입니다.', { icon: '!' })
      return;
    }
    toast('장바구니에 상품이 추가되었습니다.', { icon: '🎁' })
    setCart([...cart, { ...item, count: 1 }]);
    localStorage.setItem('cart', JSON.stringify([...cart, { ...item, count: 1 }]));
  }

  const alreadyInCart = (name: string) => {
    return cart.some((item) => item.name === name);
  }

  const clearCart = () => {
    setCart([]);
    localStorage.setItem('cart', '[]');
  }

  const handleRemoveCart = (name: string) => {
    const newCart = cart.filter((item) => item.name !== name);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  }

  const ItemIncrease = (name: string) => {
    const newCart = cart.map((item) => {
      if (item.name === name) {
        return { ...item, count: item.count + 1 }
      }
      return item;
    })
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  }

  const ItemDecrease = (name: string) => {
    const newCart = cart.map((item) => {
      if (item.name === name) {
        if (item.count === 1) {
          return item;
        }
        return { ...item, count: item.count - 1 }
      }
      return item;
    })
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  }

  useEffect(() => {
    const cartFromLocalStorage = JSON.parse(localStorage.getItem('cart') || '[]');
    if (!cartFromLocalStorage) return;
    setCart(cartFromLocalStorage);
  }, [setCart])

  return {
    cart,
    handleAddCart,
    clearCart,
    handleRemoveCart,
    ItemIncrease,
    ItemDecrease,
  }
}