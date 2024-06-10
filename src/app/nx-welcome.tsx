import { Box, Button, Input, Modal, ModalBody, ModalContent, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react";
import { atom, useAtom } from "jotai";
import { useEffect, useState } from "react";

import { getData, postData } from "src/lib/api";
import { useSearch } from "src/lib/useSearchAtom";

interface CartItem extends GetProduct {
  count: number
}

interface GetProduct {
  name: string,
  price: number,
  barcode: string,
  stock: number,
  soldOut: string,
  delivery: string,
  Mall: {
    name: string
  }
}
interface Data {
  name: string,
  barcode: string
}
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay)
    return () => clearTimeout(timer);
  }, [value, delay])
  return debouncedValue

}

const cartAtom = atom<CartItem[]>([]);

export function useCart() {
  const [cart, setCart] = useAtom(cartAtom)

  const handleAddCart = (item: CartItem) => {
    console.log(item.name)
    if (alreadyInCart(item.name)) {
      return;
    }
    setCart([...cart, item]);
    localStorage.setItem('cart', JSON.stringify([...cart, item]));
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


export function Main({ title }: { title: string }) {
  const { cart, handleAddCart, clearCart, handleRemoveCart, ItemIncrease, ItemDecrease } = useCart();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const { TextSearch } = useSearch();
  const debounce = useDebounce(TextSearch.value, 500);
  const [array, setArray] = useState<Data[]>([]);
  const [product, setProduct] = useState<GetProduct[] | any>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const getProductDetail = async (barcode: string): Promise<GetProduct[]> => {
    const response = await getData<GetProduct[]>(`getProductDetail/${barcode}`);
    console.log(response.result)
    return response.result;
  }

  const getProduct = async (name: string): Promise<[]> => {
    try {
      const response = await postData<[]>('/getProduct', { name });
      return response.result
    } catch (error) {
      console.error(error);
      throw new Error('Failed');
    }
  };
  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }
  const onChangePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  }

  const order = async () => {
    const response = await postData('/order', { name, phone, cart });
    console.log(response);
    onClose();
  }

  const onClickProduct = (barcode: string) => {
    getProductDetail(barcode).then((data) => {
      setProduct(data);
    })
  }

  const handleCart = (item: GetProduct) => {
    handleAddCart({ ...item, count: 1 })
    console.log(item)
  }

  useEffect(() => {
    if (debounce) {
      getProduct(debounce).then((data) => {
        setArray(data);
      })
    }
  }, [debounce])
  useEffect(() => {
    console.log(product)
  }, [product])

  return (
    <Box w="100%" pos="relative">
      <Box maxW={'375'} m="0 auto" border={'1px solid black'} p="4">
        <Box w='100%' h='64px'>
          헤더 영역 / 장바구니로
        </Box>
        <Box>
          <Input onChange={TextSearch.onChange} value={TextSearch.value} placeholder="상품명을 입력해주세요. (자동 검색)" />
        </Box>
        <Box mt="4">
          <Box>
            {array && array.map((item) => {
              return (
                <Box border="1px solid red" m={1} onClick={() => onClickProduct(item.barcode)}>
                  <Text>{item.name}</Text>
                  <Text>{item.barcode}</Text>
                </Box>
              )
            })}
          </Box>
          <Box>
            <Box>
              {product && product.map((item: GetProduct) => {
                return (
                  <Box border="1px solid red" m={1}>
                    <Text>{item.name}</Text>
                    <Text>{item.price}</Text>
                    <Text>{item.stock}</Text>
                    <Text>{item.soldOut}</Text>
                    <Text>{item.delivery}</Text>
                    <Text>{item.Mall.name}</Text>
                    <Button onClick={() => handleCart(item)}>장바구니 담기</Button>
                  </Box>
                )
              })}
              {/* {JSON.stringify(product)} */}
            </Box>
          </Box>
          <Box>
            <Text>장바구니</Text>
            {
              cart && cart.map((item) => {
                return (
                  <Box border="1px solid red" m={1}>
                    <Text>{item.name}</Text>
                    <Text>{item.price}</Text>
                    <Text>{item.stock}</Text>
                    <Text>{item.soldOut}</Text>
                    <Text>{item.delivery}</Text>
                    <Text>{item.Mall.name}</Text>
                    <Text>{item.count}</Text>
                    <Button onClick={() => ItemIncrease(item.name)}>증가</Button>
                    <Button onClick={() => ItemDecrease(item.name)}>감소</Button>
                    <Button onClick={() => handleRemoveCart(item.name)}>삭제</Button>
                  </Box>
                )
              })
            }
            <Text>총 금액 {cart.reduce((acc, item) => { return acc + item.price * item.stock * item.count }, 0)}원</Text>
            <Button onClick={() => onOpen()}>주문하기</Button>
            <Button onClick={() => clearCart()}>비우기</Button>
          </Box>
          <Box>
            푸터
            고객센터 / 안내 / 이용약관 / 개인정보처리방침
          </Box>

        </Box>

      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW={'375'} p="4" >
          <Text>
            안내사항
            주문서를 접수해주시면 담당 매니저가 영업시간 (오전 10시 ~ 오후 10시) 내에 즉시 연락드립니다.
            배송비, 품절, 업체 사정 등의 이유로 추가 요금을 결제하거나 환불 받을 수 있습니다.
          </Text>
          <Input placeholder="이름" onChange={onChangeName} value={name} />
          <Input placeholder="전화번호" onChange={onChangePhone} value={phone} />
          <Text>
            주문 상품
            <Box>
              {cart && cart.map((item) => {
                return (
                  <Box>
                    <Text>{item.name}</Text>
                    <Text>{item.price}</Text>
                    <Text>{item.stock}</Text>
                    <Text>{item.soldOut}</Text>
                    <Text>{item.delivery}</Text>
                    <Text>{item.Mall.name}</Text>
                    <Text>{item.count}</Text>
                  </Box>
                )
              })}
            </Box>
          </Text>
          <Text>
            <Text>총 금액 {cart.reduce((acc, item) => { return acc + item.price * item.stock * item.count }, 0)}원</Text>
          </Text>
          <Button onClick={() => order()}>
            주문하기
          </Button>
        </ModalContent>

      </Modal>
    </Box >

  );
}

export default Main;
