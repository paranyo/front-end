import { Text, Box, Button, Image, Input, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { postData } from "src/lib/api";

export function Delivery() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }
  const onChangePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  }
  const onChangeAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  }

  const order = async () => {
    const response = await postData('/order', { name, phone, cart: address });
    toast('주문이 접수되었습니다. 담당 매니저가 3분 내에 연락드리겠습니다.', { icon: '🚀' });
  }

  return (
    <Box maxW="400px" m="0 auto" border="1px solid black">
      <Box m="3">
        <Text mb="2">
          주문하기
        </Text>
        <Input border="2px solid black" placeholder="주소" onChange={onChangeName} value={name} mb="2" />
        <Input border="2px solid black" placeholder="전화번호" onChange={onChangePhone} value={phone} mb="2" />
        <Input border="2px solid black" placeholder="주문 내용" onChange={onChangeAddress} value={address} mb="2" />
        <Button w="100%" onClick={() => order()} colorScheme="blue" isDisabled={name.length < 1 || phone.length < 1 || address.length < 1} mb='2'>
          주문 완료하기
        </Button>
        <Text fontSize={12} fontWeight={'bold'} textAlign={'center'} mb='2'>
          주문은 상품 명과 개수로만 적어주시면 담당 매니저가 인근 무인매장의 가격을 확인 후 가장 저렴한 것으로 최종 비용을 안내드립니다.
        </Text>
        <Text fontSize={12} fontWeight={'bold'} textAlign={'center'} mb='2'>
          안내받으신 금액과 함께 안내된 계좌번호에 최종 입금을 해주셔야 배송이 시작됩니다.
        </Text>

        <Button size="sm" bg='#ffe300' color="black" w="100%" onClick={() => window.open("http://pf.kakao.com/_HDucG/chat")}>상담원 문의하기</Button>
      </Box>
      <Text fontWeight={'bold'} fontSize={'lg'} mt="3" ml="3">
        상품 참고 내용
      </Text>
      <Text fontSize={12} fontWeight={'bold'} ml="3">
        매장 상품은 예시 자료이며 품절, 소량 가격 변동이 있을 수 있습니다.
      </Text>
      <Tabs>
        <TabList>
          <Tab>아이스크림&과자</Tab>
          <Tab>냉동식품</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Image mb={2} src="https://soonroom.s3.ap-northeast-2.amazonaws.com/picture/bobki/bobki_1.jpeg" />
            <Image mb={2} src="https://soonroom.s3.ap-northeast-2.amazonaws.com/picture/bobki/bobki_2.jpeg" />
            <Image mb={2} src="https://soonroom.s3.ap-northeast-2.amazonaws.com/picture/bobki/bobki_3.jpeg" />
            <Image mb={2} src="https://soonroom.s3.ap-northeast-2.amazonaws.com/picture/bobki/bobki_4.jpeg" />
            <Image mb={2} src="https://soonroom.s3.ap-northeast-2.amazonaws.com/picture/bobki/bobki_5.jpeg" />
            <Image mb={2} src="https://soonroom.s3.ap-northeast-2.amazonaws.com/picture/bobki/bobki_6.jpeg" />
            <Image mb={2} src="https://soonroom.s3.ap-northeast-2.amazonaws.com/picture/bobki/bobki_7.jpeg" />
            <Image mb={2} src="https://soonroom.s3.ap-northeast-2.amazonaws.com/picture/bobki/bobki_8.jpeg" />
            <Image mb={2} src="https://soonroom.s3.ap-northeast-2.amazonaws.com/picture/bobki/bobki_9.jpeg" />
            <Image mb={2} src="https://soonroom.s3.ap-northeast-2.amazonaws.com/picture/bobki/bobki_10.jpeg" />
            <Image mb={2} src="https://soonroom.s3.ap-northeast-2.amazonaws.com/picture/bobki/bobki_11.jpeg" />
            <Image mb={2} src="https://soonroom.s3.ap-northeast-2.amazonaws.com/picture/bobki/bobki_12.jpeg" />
            <Image mb={2} src="https://soonroom.s3.ap-northeast-2.amazonaws.com/picture/bobki/bobki_13.jpeg" />
            <Image mb={2} src="https://soonroom.s3.ap-northeast-2.amazonaws.com/picture/bobki/bobki_14.jpeg" />
            <Image mb={2} src="https://soonroom.s3.ap-northeast-2.amazonaws.com/picture/bobki/bobki_15.jpeg" />
            <Image mb={2} src="https://soonroom.s3.ap-northeast-2.amazonaws.com/picture/bobki/bobki_16.jpeg" />
            <Image mb={2} src="https://soonroom.s3.ap-northeast-2.amazonaws.com/picture/bobki/bobki_17.jpeg" />
          </TabPanel>
          <TabPanel>
            <Image mb={2} src="https://soonroom.s3.ap-northeast-2.amazonaws.com/picture/icecream/icecream_1.jpeg" />
            <Image mb={2} src="https://soonroom.s3.ap-northeast-2.amazonaws.com/picture/icecream/icecream_2.jpeg" />
            <Image mb={2} src="https://soonroom.s3.ap-northeast-2.amazonaws.com/picture/icecream/icecream_3.jpeg" />
            <Image mb={2} src="https://soonroom.s3.ap-northeast-2.amazonaws.com/picture/icecream/icecream_4.jpeg" />
            <Image mb={2} src="https://soonroom.s3.ap-northeast-2.amazonaws.com/picture/icecream/icecream_5.jpeg" />
            <Image mb={2} src="https://soonroom.s3.ap-northeast-2.amazonaws.com/picture/icecream/icecream_6.jpeg" />
            <Image mb={2} src="https://soonroom.s3.ap-northeast-2.amazonaws.com/picture/icecream/icecream_7.jpeg" />
            <Image mb={2} src="https://soonroom.s3.ap-northeast-2.amazonaws.com/picture/icecream/icecream_8.jpeg" />
            <Image mb={2} src="https://soonroom.s3.ap-northeast-2.amazonaws.com/picture/icecream/icecream_9.jpeg" />
            <Image mb={2} src="https://soonroom.s3.ap-northeast-2.amazonaws.com/picture/icecream/icecream_10.jpeg" />
            <Image mb={2} src="https://soonroom.s3.ap-northeast-2.amazonaws.com/picture/icecream/icecream_11.jpeg" />
            <Image mb={2} src="https://soonroom.s3.ap-northeast-2.amazonaws.com/picture/icecream/icecream_12.jpeg" />
            <Image mb={2} src="https://soonroom.s3.ap-northeast-2.amazonaws.com/picture/icecream/icecream_13.jpeg" />
            <Image mb={2} src="https://soonroom.s3.ap-northeast-2.amazonaws.com/picture/icecream/icecream_14.jpeg" />
            <Image mb={2} src="https://soonroom.s3.ap-northeast-2.amazonaws.com/picture/icecream/icecream_15.jpeg" />
            <Image mb={2} src="https://soonroom.s3.ap-northeast-2.amazonaws.com/picture/icecream/icecream_16.jpeg" />
            <Image mb={2} src="https://soonroom.s3.ap-northeast-2.amazonaws.com/picture/icecream/icecream_17.jpeg" />
            <Image mb={2} src="https://soonroom.s3.ap-northeast-2.amazonaws.com/picture/icecream/icecream_18.jpeg" />
            <Image mb={2} src="https://soonroom.s3.ap-northeast-2.amazonaws.com/picture/icecream/icecream_19.jpeg" />
            <Image mb={2} src="https://soonroom.s3.ap-northeast-2.amazonaws.com/picture/icecream/icecream_20.jpeg" />
            <Image mb={2} src="https://soonroom.s3.ap-northeast-2.amazonaws.com/picture/icecream/icecream_21.jpeg" />
            <Image mb={2} src="https://soonroom.s3.ap-northeast-2.amazonaws.com/picture/icecream/icecream_22.jpeg" />
            <Image mb={2} src="https://soonroom.s3.ap-northeast-2.amazonaws.com/picture/icecream/icecream_23.jpeg" />
            <Image mb={2} src="https://soonroom.s3.ap-northeast-2.amazonaws.com/picture/icecream/icecream_24.jpeg" />
            <Image mb={2} src="https://soonroom.s3.ap-northeast-2.amazonaws.com/picture/icecream/icecream_25.jpeg" />
            <Image mb={2} src="https://soonroom.s3.ap-northeast-2.amazonaws.com/picture/icecream/icecream_26.jpeg" />
            <Image mb={2} src="https://soonroom.s3.ap-northeast-2.amazonaws.com/picture/icecream/icecream_27.jpeg" />
            <Image mb={2} src="https://soonroom.s3.ap-northeast-2.amazonaws.com/picture/icecream/icecream_28.jpeg" />
            <Image mb={2} src="https://soonroom.s3.ap-northeast-2.amazonaws.com/picture/icecream/icecream_29.jpeg" />
            <Image mb={2} src="https://soonroom.s3.ap-northeast-2.amazonaws.com/picture/icecream/icecream_30.jpeg" />
            <Image mb={2} src="https://soonroom.s3.ap-northeast-2.amazonaws.com/picture/icecream/icecream_31.jpeg" />
            <Image mb={2} src="https://soonroom.s3.ap-northeast-2.amazonaws.com/picture/icecream/icecream_32.jpeg" />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}

export default Delivery;