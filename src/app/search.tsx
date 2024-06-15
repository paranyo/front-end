import { Box, Button, Divider, Flex, Image, Input, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Logo from "public/logo.png";
import { getData, postData } from "src/lib/api";
import { useSearch } from "src/lib/useSearchAtom";
import { Data, GetProduct } from "./interface"
import { useCart } from "./useAtom";
import { shortenWords, useDebounce } from "./utils";



export function Main({ title }: { title: string }) {
  const { cart, handleAddCart } = useCart();

  const [loading, setLoading] = useState(false);
  const { TextSearch } = useSearch();
  const debounce = useDebounce(TextSearch.value, 1000);
  const [array, setArray] = useState<Data[]>([]);
  const [product, setProduct] = useState<GetProduct[] | any>([]);

  const getProductDetail = async (barcode: string): Promise<GetProduct[]> => {
    const response = await getData<GetProduct[]>(`getProductDetail/${barcode}`);
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

  const onClickProduct = (barcode: string) => {
    getProductDetail(barcode).then((data) => {
      setProduct(data);
    })
  }


  useEffect(() => {
    setLoading(true);
    if (debounce) {
      getProduct(debounce).then((data) => {
        setArray(data);
        setLoading(false);
      })
    }
  }, [debounce])


  return (
    <Box w="100%" pos="relative" >
      <Box maxW={'400px'} m="0 auto">
        <Box w='100%' h='64px' p="4" >
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
            </Box>) || (
              TextSearch.value.length > 0 && !loading &&
              <Box p="4">
                <Text textAlign="center" p={[0, 2]} fontSize="2xl" fontWeight={'bold'}>검색 결과가 없습니다.</Text>
              </Box>
            )
          }
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
                        {JSON.stringify(item.soldOut) === 'false' ?
                          <Button colorScheme='green' size="lg" w="100%" onClick={() => handleAddCart(item)}>담기</Button>
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
          {array.length < 1 && loading &&
            (<Box minH="600px" alignContent={'center'}>
              <Text textAlign={'center'} fontSize="xl" fontWeight={"bolder"}>안녕하세요.</Text>
              <Text textAlign={'center'} fontSize="lg" fontWeight={"bolder"}>상품을 검색하시면 이용이 시작됩니다.</Text>
            </Box>
            )
          }
          <Box textAlign={'center'} background="#f0f0f0" p="4">
            <Divider m="2" />
            <Text fontSize="xs">사업자번호: 555-44-00770 | 상호명: 리오 | 대표자: 한규태, 임경택 | 고객센터: 010-2691-3194</Text>
          </Box>
        </Box>
      </Box>
      {cart.length > 0 &&
        (
          <Flex position={'sticky'} h="48px" bg='white' p="2" verticalAlign={'middle'} borderTop={'2px solid black'} bottom="0" maxW="400px" m="0 auto">
            <Text fontWeight={'bold'} ml="1" mt="1" fontSize={'xl'} flex="2">총 {cart.length}건 {(cart.reduce((acc, item) => { return acc + item.price * item.stock * item.count }, 0)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원</Text>
            <Button flex="1" colorScheme="green" size="sm" w="40%" onClick={() => window.location.href = 'aa'}>
              장바구니
            </Button>
          </Flex>
        )
      }
    </Box >

  );
}

export default Main;
