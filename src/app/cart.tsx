import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Box, Button, Divider, Flex, Input, Text, } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useCart } from "./useAtom";
import { shortenWords } from "./utils";
import { postData } from "src/lib/api";
import { useState } from "react";
import toast from "react-hot-toast";

export function Cart() {
  const { cart, handleRemoveCart, ItemIncrease, ItemDecrease } = useCart();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');


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

  return (
    <Box>
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
            <Text fontSize="xs"> * 주문하기 클릭 시, MooLuck에서 확인 후 연락 드립니다.</Text>
            <Text fontSize="xs"> * 배송비는 최종 주문서에서 별도 안내 드립니다. </Text>
          </Box>
          <Box p="4">
            <Text textAlign={'center'} fontSize="xl" fontWeight={'bold'} mb="4">
              아래 정보 입력 후, 주문을 완료해 주세요.
            </Text>
            <Input border="2px solid black" placeholder="이름" onChange={onChangeName} value={name} mb="2" />
            <Input border="2px solid black" placeholder="전화번호" onChange={onChangePhone} value={phone} mb="2" />
            <Button w="100%" onClick={() => order()} colorScheme="blue">주문 완료하기</Button>
            <Divider m="4" />
            <Text textAlign={'center'} fontWeight={'bold'} fontSize="lg">주문 완료 시 담당 매니저가 연락드립니다.</Text>
            <Text textAlign={'center'}>*영업 시간 오전 10시 ~ 오후 12시</Text>
            <Divider m="4" />
            <Text fontWeight={'bold'} fontSize="lg">*안내사항*</Text>
            <Text fontSize="sm"> 업체 사정에 따른 품절 및 배송 조건 변동이 있을 수 있습니다. 이 경우 결제 금액도 함께 변동될 수 있으니, 이 점 양해 부탁드립니다. </Text>
          </Box>
          <Box p={[4, 6]}>
            <Text fontSize="xs">・재고 및 판매 가격은 도매몰 상황에 따라 달라질 수 있습니다.</Text>
            <Text fontSize="xs">・도매몰마다 최소 주문 수량이나, 무료배송 조건, 배송 가능 여부의 차이가 있을 수 있습니다.</Text>
            <Text fontSize="xs">・[무럭]은 각 도매몰의 상품 정보 중개자로서, 상품의 배송 책임은 해당 도매몰에 있습니다.</Text>
            <Text fontSize="xs">・판매 가격이 위 정보와 다르거나, 서비스 이용 문의가 있으시면 카카오톡 채널로 연락주세요.</Text>
            <Text fontSize="xs">(카카오톡 링크: http://pf.kakao.com/_HDucG/chat)</Text>
            <Text fontSize="xs">사업자번호: 555-44-00770 | 상호명: 리오 | 대표자: 한규태, 임경택 | 고객센터: 010-2691-3194</Text>
            <Button mt={2} bg='#ffe300' color="black" w="100%" onClick={() => window.open("http://pf.kakao.com/_HDucG/chat")}>상담원 문의하기</Button>
          </Box>
        </Box>
      )}

    </Box>
  );
}

export default Cart;