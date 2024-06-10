import { Box, Button, Divider, Flex, Image, Input, Modal, ModalBody, ModalContent, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react";
import { atom, useAtom } from "jotai";
import { useEffect, useState } from "react";
import Logo from "public/logo.png";
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
  const shortenWords = (str: string, length = 26) => {
    let result = '';
    if (str.length > length) {
      result = str.substr(0, length - 2) + '...';
    } else {
      result = str;
    }
    return result;
  };

  return (
    <Box w="100%" pos="relative">
      <Box maxW={'375'} m="0 auto" border={'1px solid black'}>
        <Box w='100%' h='64px' p="4">
          <Image src={Logo} />
        </Box>
        <Box mt={4} p="4" mr={'2'} ml={'2'}>
          <Input onChange={TextSearch.onChange} value={TextSearch.value} placeholder="상품명을 입력해주세요. (자동 검색)" textAlign={'center'} border="2px solid black" />
        </Box>
        <Box>
          {array.length > 0 &&
            (<Box p="4">
              <Text p={[0, 2]} fontSize="lg" fontWeight={'bold'}>아래 상품 중 검색 대상을 클릭해주세요</Text>
              {array.map((item) => {
                return (
                  <Box textOverflow={'ellipsis'} overflow={'hidden'} whiteSpace={'nowrap'}
                    border="2px solid black" borderRadius={4} p={[2, 2]} m={3} onClick={() => onClickProduct(item.barcode)}>
                    <Text>{shortenWords(item.name)}</Text>
                  </Box>
                )
              })}
            </Box>)}
          {product.length > 0 &&
            <Box background={'#f0f0f0'} p={4}>
              <Text p={[0, 2]} fontSize="lg" fontWeight={'bold'}>상품 상세</Text>
              {product.map((item: GetProduct) => {
                return (
                  <Box border="2px solid black" p={[3, 6]} m={2} borderRadius={8} background="white">
                    <Text fontWeight={'bold'}>{shortenWords(item.name, 22)}</Text>
                    <Text fontWeight={'bold'}>{(item.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원</Text>
                    <Flex mt={1}>
                      <Box flex="2">
                        <Text>최소 주문 수량 | {item.stock}개</Text>
                        <Text> {item.Mall.name}</Text>
                      </Box>
                      <Box flex="1">
                        {JSON.stringify(item.soldOut) === 'true' ?
                          <Button colorScheme='green' size="lg" w="100%" onClick={() => handleCart(item)}>담기</Button>
                          : <Button size="lg" w="100%" disabled>품절</Button>}
                      </Box>
                    </Flex>
                    <Text>{item.soldOut}</Text>
                    <Text>{item.delivery}</Text>
                  </Box>
                )
              })}
            </Box>
          }
          {cart.length > 0 && <Box p={4}>
            <Text p={[0, 2]} fontSize="lg" fontWeight={'bold'}>장바구니</Text>
            {cart.map((item) => {
              return (
                <Box border="2px solid black" p={[3, 6]} m={2} borderRadius={8} background="white">
                  <Text fontWeight={'bold'}>{shortenWords(item.name)}</Text>
                  <Text fontWeight={'bold'}>{(item.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원 / {item.stock}개 / {item.Mall.name}</Text>
                  <Flex gap="2" mt={2}>
                    <Text fontWeight="bolder">주문 개수 {item.count}개</Text>
                    <Button size="sm" colorScheme="green" onClick={() => ItemIncrease(item.name)}>추가</Button>
                    <Button size="sm" colorScheme="green" onClick={() => ItemDecrease(item.name)}>빼기</Button>
                    <Button size="sm" colorScheme="red" variant="outline" onClick={() => handleRemoveCart(item.name)}>삭제</Button>
                  </Flex>
                </Box>
              )
            })}
          </Box>
          }
          {cart.length > 0 && (
            <Box>
              <Box textAlign={'center'} background="#f0f0f0" p="4">
                <Text fontWeight="bolder" textAlign={'center'} fontSize="2xl">합계 금액 {(cart.reduce((acc, item) => { return acc + item.price * item.stock * item.count }, 0)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원</Text>
                <Box p="2" textAlign={'center'}>
                  <Button onClick={() => onOpen()} colorScheme="blue" size="md" w="40%">주문하기</Button>
                </Box>
                <Text fontSize="xs"> * 주문하기 클릭 시, MooLuck에서 확인 후 연락 드립니다.</Text>
                <Text fontSize="xs"> * 배송비는 최종 주문서에서 별도 안내 드립니다. </Text>
              </Box>
              <Box p={[4, 6]}>
                <Text fontSize="xs">・재고 및 판매 가격은 도매몰 상황에 따라 달라질 수 있습니다.</Text>
                <Text fontSize="xs">・도매몰마다 최소 주문 수량이나, 무료배송 조건, 배송 가능 여부의 차이가 있을 수 있습니다.</Text>
                <Text fontSize="xs">・[무럭]은 각 도매몰의 상품 정보 중개자로서, 상품의 배송 책임은 해당 도매몰에 있습니다.</Text>
                <Text fontSize="xs">・판매 가격이 위 정보와 다르거나, 서비스 이용 문의가 있으시면 카카오톡 채널로 연락주세요.</Text>
                <Text fontSize="xs">(카카오톡 링크: http://pf.kakao.com/_HDucG/chat)</Text>
                <Button mt={2} bg='#ffe300' color="black" w="100%" onClick={() => window.open("http://pf.kakao.com/_HDucG/chat")}>상담원 문의하기</Button>
              </Box>
            </Box>
          )}
          {(cart.length < 1 || product.length < 1 || array.length < 1) &&
            <Box textAlign="center" p={4}>
              <Text textAlign={'center'} fontSize="xl" fontWeight={"bolder"}>안녕하세요.</Text>
              <Text textAlign={'center'} fontSize="lg" fontWeight={"bolder"}>상품을 검색하시면 이용이 시작됩니다.</Text>
            </Box>
          }
        </Box>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW={'375'} p="6" >
          <Image src={Logo} />
          <Text mt="4" textAlign={'center'} fontSize="xl" fontWeight={'bold'}>
            주문이 접수되었습니다.
          </Text>
          <Text textAlign={'center'} fontSize="xl" fontWeight={'bold'} mb="4">
            아래 정보 입력 후, 주문을 완료해 주세요.
          </Text>
          <Input border="2px solid black" placeholder="이름" onChange={onChangeName} value={name} mb="2" />
          <Input border="2px solid black" placeholder="전화번호" onChange={onChangePhone} value={phone} mb="2" />
          <Button onClick={() => order()} colorScheme="blue">주문 완료하기</Button>
          <Divider m="4" />
          <Text textAlign={'center'} fontWeight={'bold'} fontSize="lg">주문 완료 시 담당 매니저가 연락드립니다.</Text>
          <Text textAlign={'center'}>*영업 시간 오전 10시 ~ 오후 12시</Text>
          <Divider m="4" />
          <Text fontWeight={'bold'} fontSize="lg">*안내사항*</Text>
          <Text fontSize="sm"> 업체 사정에 따른 품절 및 배송 조건 변동이 있을 수 있습니다. 이 경우 결제 금액도 함께 변동될 수 있으니, 이 점 양해 부탁드립니다. </Text>
          {/* <Text>
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
          </Text> */}
          {/* <Text>
            <Text>총 금액 {cart.reduce((acc, item) => { return acc + item.price * item.stock * item.count }, 0)}원</Text>
          </Text> */}
        </ModalContent>
      </Modal>
    </Box >

  );
}

export default Main;
