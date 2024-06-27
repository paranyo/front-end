import { atom, useAtom } from "jotai";
import { CartItem, GetProduct, Mall } from "./interface";
import { useEffect, useState } from "react";
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


  const [mall, setMall] = useState<Mall[]>([]);

  const initMall = () => {
    setMall([
      { id: 1, name: "준인터내셔날", price: 0, free: 100000, deliveryFee: 2800, option: 50000 },
      { id: 2, name: "현동몰", price: 0, free: 300000, deliveryFee: 3000, option: 50000 },
      { id: 3, name: "과자생각", price: 0, free: 150000, deliveryFee: 3000, option: 50000 },
      { id: 4, name: "무마켓", price: 0, free: 150000, deliveryFee: 3000, option: 150000 },
      { id: 5, name: "삼봉몰", price: 0, free: 100000, deliveryFee: 3000, option: 50000 },
      { id: 6, name: "또요몰", price: 0, free: 150000, deliveryFee: 3000, option: 150000 },
      { id: 8, name: "아이씨마켓", price: 0, free: 100000, deliveryFee: 4000, option: 100000 },
      // { id: 7, name: "달달몰", price: 0, free: 30000, deliveryFee: 10000, option: 150000 },
    ])
  }
  useEffect(() => {
    initMall();
  }, []);

  useEffect(() => {
    console.log('33')
    initMall();
    cart.map((item) => {
      setMall((prev) => {
        return prev.map((mall) => {
          if (mall.id === item.MallId) {
            return { ...mall, price: mall.price + item.price * item.stock * item.count }
          }
          return mall;
        })
      })
    })
  }, [cart])

  return {
    cart,
    mall,
    setCart,
    handleAddCart,
    clearCart,
    handleRemoveCart,
    ItemIncrease,
    ItemDecrease,
  }
}