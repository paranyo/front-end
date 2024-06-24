import { Badge, Box, Button, Collapse, Divider, Flex, Image, Input, SimpleGrid, Slide, Tag, Text, useDisclosure, } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Logo from "public/logo.png";
import { getData, postData } from "src/lib/api";
import { useSearch } from "src/lib/useSearchAtom";
import { Data, GetProduct, } from "./interface"
import { useCart } from "./useAtom";
import { shortenWords, toWon, useDebounce } from "./utils";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

const BadgeColor = ["whiteAlpha", "blackAlpha", "gray", "red", "orange", "yellow", "green", "teal", "blue", "cyan", "purple", "pink"];

export function Main({ title }: { title: string }) {
  const { cart, mall, handleAddCart } = useCart();
  const { isOpen, onToggle } = useDisclosure();
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
    onToggle()
    getProductDetail(barcode).then((data) => {
      setProduct(data);
    })
  }


  useEffect(() => {
    setLoading(true);
    if (debounce) {
      getProduct(debounce).then((data) => {
        setArray(data);
        onToggle()
        setLoading(false);
      })
    }
  }, [debounce])

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

  return (
    <Box w="100%" pos="relative" >
      <Box maxW={'400px'} m="0 auto">
        <Box w='100%' h='64px' p="4" >
          <Image src={Logo} />
        </Box>
        <Box mt={4} p="4" mr={'2'} ml={'2'}>
          <Input onChange={TextSearch.onChange} value={TextSearch.value} placeholder="상품명을 입력해주세요. (자동 검색)" textAlign={'center'} border="2px solid black" autoComplete="true" />
          {isOpen === false && array.length > 0 &&
            <Button mt="2" leftIcon={<ChevronDownIcon />} colorScheme="blue" w="100%" onClick={() => onToggle()} size="sm">
              펼치기
            </Button>
          }
        </Box>
        <Box>
          {array.length > 0 &&
            (<Box><Collapse in={isOpen} animateOpacity>
              <Box pl="4" pr="4">
                <Text ml="2" mr="2" fontSize="lg" fontWeight={'bold'}>아래 상품 중 검색 대상을 클릭해주세요</Text>
                <SimpleGrid columns={2}>
                  {array.map((item) => {
                    return (
                      <Box flexDir={'column'} border="2px solid black" borderRadius={4} p={[2, 2]} m={3} onClick={() => onClickProduct(item.barcode)} >
                        {/* <Text>{shortenWords(item.name)}</Text> */}
                        <Box flex="1" mb="1" >
                          {(item && item.image) ?
                            <Image src={item.image} /> :
                            <Image src="https://soonroom.s3.ap-northeast-2.amazonaws.com/notfoundProduct.png" />}
                        </Box>
                        <Text flex="3">{item.name}</Text>
                      </Box>
                    )
                  })}
                </SimpleGrid>
              </Box>
            </Collapse>
            </Box>) || (
              TextSearch.value.length > 0 && !loading &&
              <Box minH="600px" alignContent={'center'} p="4">
                <Text textAlign="center" p={[0, 2]} fontSize="2xl" fontWeight={'bold'}>검색 결과가 없습니다.</Text>
              </Box>)}

          {product.length > 0 &&
            <Box background={'#f0f0f0'} p={4}>
              <Text p={[0, 2]} fontSize="lg" fontWeight={'bold'}>상품 상세</Text>
              {product.map((item: GetProduct) => {
                return (
                  <Box border="2px solid black" p={[2, 4]} m={2} borderRadius={8} background="white">
                    <Text fontWeight={'bold'} >{shortenWords(item.name, 22)}</Text>
                    <Flex alignItems={'center'} >
                      <Text fontWeight={'bold'} textDecor={'underline'}>
                        {toWon(item.price * item.stock)}원
                      </Text>
                      <Text fontSize={'small'}>({toWon(item.price)}원 * {item.stock}개)</Text>
                      <Text ml="2" mr="2">|</Text>
                      <Box>
                        <Badge size="lg" colorScheme={BadgeColor[item.MallId]}>{item.Mall.name}</Badge>
                      </Box>
                    </Flex>
                    <Text fontSize={'sm'}>유통기한 | {item.expiration.length > 1 ? item.expiration : '알 수 없음'}</Text>
                    {JSON.stringify(item.soldOut) === 'false' ?
                      <Button colorScheme='green' mt="1" size="sm" w="100%" onClick={() => handleAddCart(item)}>담기</Button>
                      : <Button size="lg" w="100%" disabled>품절</Button>}
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
          <Box>
            <Slide in={!visible} direction="bottom">
              <Box m="0 auto" mb="48px" bg='white' p="3" borderRadius={'12px 12px 0 0'} borderTop="2px solid black" borderLeft="2px solid black" borderRight="2px solid black" verticalAlign={'middle'} maxW="400px">
                <Text fontSize={'xs'} fontWeight="bold">배송비 안내</Text>
                {mall && mall.length > 0 &&
                  mall.map((item) => {
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
                  })
                }
              </Box>
            </Slide>
            <Slide in={true} direction="bottom">
              <Flex h="48px" p="2" borderTop={'2px solid black'} bg='white' verticalAlign={'middle'} maxW="400px" m="0 auto">
                <Text fontWeight={'bold'} ml="1" mt="1" fontSize={'xl'} flex="2">총 {cart.length}건 {toWon(cart.reduce((acc, item) => { return acc + item.price * item.stock * item.count }, 0))}원</Text>
                <Button flex="1" colorScheme="green" size="sm" w="40%" onClick={() => window.location.href = 'cart'}>
                  장바구니
                </Button>
              </Flex>
            </Slide>
          </Box>

        )
      }
    </Box >

  );
}

export default Main;
