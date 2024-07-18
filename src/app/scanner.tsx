import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType } from '@zxing/library';
import { Box, Button, Flex, Input, Text } from '@chakra-ui/react';
import { postData } from 'src/lib/api';
import { GetStoreProduct } from './interface';
import { EditIcon, RepeatIcon } from '@chakra-ui/icons';
import toast from 'react-hot-toast';
import { useDebounce } from './utils';

export function Scanner() {
  const [localStream, setLocalStream] = useState<MediaStream>();
  const Camera = useRef<HTMLVideoElement>(null);
  const hints = new Map();
  const formats = [BarcodeFormat.QR_CODE, BarcodeFormat.DATA_MATRIX, BarcodeFormat.CODE_128, BarcodeFormat.CODABAR, BarcodeFormat.EAN_13, BarcodeFormat.EAN_8, BarcodeFormat.CODE_39, BarcodeFormat.CODE_93];
  hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
  const Scan = new BrowserMultiFormatReader(hints, 500);
  const [barcode, setBarcode] = useState('')
  const [text, setText] = useState('')
  const [name, setName] = useState('');
  const [stock, setStock] = useState(0);
  const [price, setPrice] = useState(0);
  const [expiration, setExpiration] = useState('');
  const [newFlag, setNewFlag] = useState(4);

  const debounce = useDebounce(barcode, 1000);

  // const req = useRef<any>();

  const Scanning = async () => {
    // const t = await Scan.decodeOnce();
    console.log('scan');
    if (localStream && Camera.current) {
      try {
        const data = await Scan.decodeFromStream(localStream, Camera.current, (data, err) => {
          if (data) {
            setText(data.getText());
            Scan.stopContinuousDecode();
          }
          else setText("");
        });
      } catch (error) { console.log(error) }
    }
  }
  const Stop = () => {
    if (localStream) {
      const vidTrack = localStream.getVideoTracks();

      vidTrack.forEach(track => {
        localStream.removeTrack(track);
      });
    }
  }
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({
      // video: { facingMode: "user" }, //전면
      video: { facingMode: { exact: "environment" } }, //후면
    })
      .then(stream => {
        console.log(stream);
        setLocalStream(stream);
      })
    return () => { Stop(); }
  }, []);

  useEffect(() => {
    if (!Camera.current) return;
    if (localStream && Camera.current) Scanning();
    return () => { Stop() }
  }, [localStream]);

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }
  const onChangeBarcode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBarcode(e.target.value);
  }
  const onChangeStock = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStock(+e.target.value);
  }
  const onChangePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(+e.target.value);
  }
  const onChangeExpiration = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpiration(e.target.value);
  }

  const initData = () => {
    setName('');
    setStock(0);
    setPrice(0);
    setExpiration('');
    setBarcode('');
    setText('');
  }

  const initScan = () => {
    initData();
    Scanning();
    setNewFlag(4);
  }

  const onSubmit = async () => {
    const response = await postData('/storeProduct', { barcode, name, stock, price, expiration });
    toast(response.result ? '등록 성공!' : '등록 실패.. 관리자에게 문의해주세요.', { icon: '🚀' });
    initScan()
  }

  const getProduct = async () => { // 간식 연구소 매장 전용
    const response = await postData<GetStoreProduct>('/getStoreProduct', { barcode, id: 1 }).then(res => {
      return res.result ? res.result : null;
    });
    if (response !== null) {
      setName(response.isInProduct ? response.isInProduct : '');
      if (response.isInStoreProduct !== null) {
        setStock(response.isInStoreProduct.stock ? response.isInStoreProduct.stock : 0);
        setPrice(response.isInStoreProduct.price ? response.isInStoreProduct.price : 0);
        setExpiration(response.isInStoreProduct.Expire ? response.isInStoreProduct.Expire : '');
      }
      if (response.isInProduct !== '' && response.isInStoreProduct !== null) { setNewFlag(0); } // 도매몰에 있고 매장에 있는 상품 (재고)
      if (response.isInProduct !== '' && response.isInStoreProduct === null) { setNewFlag(1); } // 도매몰에 있고 매장에 없는 상품 (신상)
      if (response.isInProduct === '' && response.isInStoreProduct !== null) { setNewFlag(2); } // 도매몰에 없는데 매장에 있는 상품 (매장전용)
      if (response.isInProduct === '' && response.isInStoreProduct === null) { setNewFlag(3); } // 도매몰에도 없고 매장에도 없는 상품 (에러?)
    }
  }

  useEffect(() => {
    if (debounce) {
      getProduct()
    }
  }, [debounce])


  useEffect(() => {
    if (text.length > 0) { setBarcode(text); }
  }, [text])

  return (
    <Box>
      <Flex flexDir={'column'} gap="2" m="6">
        {newFlag === 0 && <Text fontSize="xl" textAlign="center" fontWeight={'bolder'}>기존 상품입니다</Text>}
        {newFlag === 1 && <Text fontSize="xl" textAlign="center" fontWeight={'bolder'}>신상품입니다.</Text>}
        {newFlag === 2 && <Text fontSize="xl" textAlign="center" fontWeight={'bolder'}>매장 전용 상품인 것 같습니다.</Text>}
        {newFlag === 3 && <Text fontSize="xl" textAlign="center" fontWeight={'bolder'}>이건 뭔가요? 여러번 스캔해도 똑같다면 모든 정보를 등록해주세요.</Text>}
        {newFlag === 4 && <Text fontSize="xl" textAlign="center" fontWeight={'bolder'}>제품을 스캔해주세요.</Text>}

        <Input placeholder="제품명" value={name} onChange={onChangeName} />
        <Input placeholder="바코드" value={barcode} disabled />
        <Input placeholder="재고 (5)" value={stock} onChange={onChangeStock} />
        <Input placeholder="가격 (1200)" value={price} onChange={onChangePrice} />
        <Input placeholder="유통기한 (24.03.03)" value={expiration} onChange={onChangeExpiration} />
        <Button onClick={onSubmit} leftIcon={<EditIcon />} colorScheme="teal">등록</Button>
        <Button onClick={initScan} leftIcon={<RepeatIcon />} colorScheme="yellow">초기화</Button>
        <Box>
          <video ref={Camera} id="video" />
        </Box>
      </Flex>
    </Box>
  );
};
export default Scanner;