import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Badge, Box, Button, Divider, Flex, Input, Slide, Tag, Text, } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useCart } from "./useAtom";
import { shortenWords, toWon } from "./utils";
import { postData } from "src/lib/api";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const BadgeColor = ["whiteAlpha", "blackAlpha", "gray", "red", "orange", "yellow", "green", "teal", "blue", "cyan", "purple", "pink"];

export function Cart() {
  const { cart, handleRemoveCart, ItemIncrease, ItemDecrease, mall } = useCart();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const [position, setPosition] = useState(window.scrollY);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const moving = window.scrollY;
      if (document.documentElement.scrollHeight - document.documentElement.clientHeight === moving) {
        setVisible(true);
      } else {
        setVisible(position > moving)
        setPosition(moving);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [position])

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }
  const onChangePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  }

  const order = async () => {
    const response = await postData('/order', { name, phone, cart });
    toast('주문이 접수되었습니다. 담당 매니저가 30분 내에 연락드리겠습니다.', { icon: '🚀' });
  }

  const cartData = async () => {
    if (localStorage.getItem('cart') !== null) {
      const cart = localStorage.getItem('cart') as string;
      const aa = JSON.parse(cart)
      const response = await postData('/cart', { name, phone, cart: aa });
    }
  }

  useEffect(() => {
    cartData()
  }, [])

  return (
    <Box maxW="400px" m="0 auto">
      <Box w="100%" pos="sticky" h="48px" p="3" borderBottom={'2px solid black'} top="0" bg="white" zIndex={"3"}>
        <Link to="/">
          <ChevronLeftIcon boxSize={"24px"} pos="absolute" />
        </Link>
        <Text textAlign='center' fontWeight={'bold'} fontSize={'xl'}>장바구니</Text>
      </Box>

      {cart.length > 0 && <Box p={4}>
        {cart.map((item) => {
          return (
            <Box border="2px solid black" p={[3, 6]} m={2} borderRadius={8} background="white">
              <Text fontWeight={'bold'}>{shortenWords(item.name)}</Text>
              <Flex alignItems={'center'} >
                <Text fontWeight={'bold'} textDecor={'underline'}>{toWon(item.price * item.stock)}원</Text>
                <Text fontSize={'small'}>({toWon(item.price)}원 * {item.stock}개)</Text>
                <Text ml="2" mr="2">|</Text>
                <Box>
                  <Badge size="lg" colorScheme={BadgeColor[item.MallId]}>{item.Mall.name}</Badge>
                </Box>
              </Flex>
              <Text fontSize={'sm'}>유통기한 | {item.expiration.length > 1 ? item.expiration : '알 수 없음'}</Text>
              <Flex gap="2" mt={2}>
                <Text fontWeight="bolder">{item.count}개 ({toWon(item.price * item.stock * item.count)}원)</Text>
                <Button size="sm" colorScheme="green" onClick={() => ItemIncrease(item.name)}>+</Button>
                <Button size="sm" colorScheme="yellow" onClick={() => ItemDecrease(item.name)}>-</Button>
                <Button size="sm" variant="outline" colorScheme="red" onClick={() => handleRemoveCart(item.name)}>삭제</Button>
              </Flex>
            </Box>
          )
        })}
      </Box>
      }
      {cart.length > 0 && (
        <Box>
          <Box textAlign={'center'} background="#f0f0f0" p="4">
            <Text fontWeight="bolder" textAlign={'center'} fontSize="2xl">합계 금액 {toWon(cart.reduce((acc, item) => { return acc + item.price * item.stock * item.count }, 0) + mall.reduce((acc, item) => { return acc + (item.free > item.price ? item.deliveryFee * Math.ceil(item.price / item.option) : 0) }, 0))}원</Text>

            <Text textAlign={'center'} fontSize="md">
              상품 합계: {toWon(cart.reduce((acc, item) => { return acc + item.price * item.stock * item.count }, 0))}원 + 배송비: {toWon(mall.reduce((acc, item) => { return acc + (item.free > item.price ? item.deliveryFee * Math.ceil(item.price / item.option) : 0) }, 0))}원
            </Text>
            <Text mt="2" textAlign={'center'} fontWeight={'bold'} fontSize="md">계좌번호: 신한 110-473-003743 한규태(리오)</Text>
            <Divider m="2" />
            <Text fontSize="xs" fontWeight={'bold'}> · 주문을 접수하시고 위 계좌로 입금하시면 주문이 시작됩니다.</Text>
            <Text fontSize="xs"> · 도매몰 사정에 의해 품절, 배송곤란 등의 상품은 환불됩니다.</Text>
            <Text fontSize="xs"> · 세금계산서는 매니저가 직접 연락 후 발행해 드립니다.</Text>
          </Box>
          <Box p="4">
            <Text textAlign={'center'} fontSize="xl" fontWeight={'bold'} mb="4">
              아래 정보 입력 후, 주문을 완료해 주세요.
            </Text>
            <Input border="2px solid black" placeholder="이름" onChange={onChangeName} value={name} mb="2" />
            <Input border="2px solid black" placeholder="전화번호" onChange={onChangePhone} value={phone} mb="2" />
            <Button w="100%" onClick={() => order()} colorScheme="blue" isDisabled={name.length < 1 || phone.length < 1}>주문 완료하기</Button>
            <Divider m="4" />
            <Text textAlign={'center'} fontWeight={'bold'} fontSize="lg">결제 문의: 010-2691-3194</Text>
            <Text textAlign={'center'}>*영업 시간 오전 10시 ~ 오후 12시</Text>
            <Divider m="2" />
          </Box>
          <Box pl="4" pr="4">
            <Text fontSize="xs">・재고 및 판매 가격은 도매몰 상황에 따라 달라질 수 있습니다.</Text>
            <Text fontSize="xs">・도매몰마다 최소 주문 수량이나, 무료배송 조건, 배송 가능 여부의 차이가 있을 수 있습니다.</Text>
            <Text fontSize="xs">・[무럭]은 각 도매몰의 상품 정보 중개자로서, 상품의 배송 책임은 해당 도매몰에 있습니다.</Text>
            <Text fontSize="xs">・판매 가격이 위 정보와 다르거나, 서비스 이용 문의가 있으시면 카카오톡 채널로 연락주세요.</Text>
            <Text fontSize="xs">(카카오톡 링크: http://pf.kakao.com/_HDucG/chat)</Text>
            <Text fontSize="xs">사업자번호: 555-44-00770 | 상호명: 리오 | 대표자: 한규태, 임경택 | 고객센터: 010-2691-3194</Text>
            <Button mt={2} bg='#ffe300' color="black" w="100%" onClick={() => window.open("http://pf.kakao.com/_HDucG/chat")}>상담원 문의하기</Button>
          </Box>
        </Box>
      )
      }

      <Slide in={!visible} direction="bottom">
        <Box m="0 auto" verticalAlign="middle" maxW="400px" bg='white' p="3" borderRadius={'12px 12px 0 0'} borderTop="2px solid black" borderLeft="2px solid black" borderRight="2px solid black">
          {mall && mall.length > 0 &&
            <Box>
              <Text fontSize={'xs'} fontWeight="bold">배송비 안내</Text>
              {mall.map((item) => {
                if (item.price !== 0) {
                  return (
                    <Flex flexDir={'row'} gap={1} key={item.id} alignItems={'center'}>
                      <Box flex="1" alignContent={'center'}>
                        <Badge size="sm" colorScheme={BadgeColor[item.id]}>{item.name}</Badge>
                      </Box>
                      {/* <Box flex="2" alignContent={'center'}>
                            <Progress size="xs" value={item.price / (item.free / 100)} max={100} colorScheme="pink" />
                          </Box> */}
                      <Text textAlign="center" alignContent="center" fontSize="sm" flex="2.4">({toWon(item.price)}원/{toWon(item.free)}원)</Text>
                      <Box flex="1" alignContent={'center'} textAlign={'center'} >
                        {item.free <= item.price ?
                          <Tag size="sm" colorScheme="green">무료 배송</Tag>
                          : <Tag size="sm">+ {Math.ceil(item.price / item.option) * item.deliveryFee}원</Tag>
                        }
                      </Box>
                    </Flex>
                  )
                }
              })}
            </Box>
          }
        </Box>
      </Slide>
    </Box >
  );
}

export default Cart;