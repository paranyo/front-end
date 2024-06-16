interface CartItem extends GetProduct {
  count: number
}

interface GetProduct {
  expiration: string,
  name: string,
  price: number,
  barcode: string,
  stock: number,
  soldOut: string,
  delivery: string,
  MallId: number,
  Mall: {
    name: string
  }
}
interface Data {
  name: string,
  barcode: string,
  image: string
}

interface Mall {
  id: number,
  name: string,
  price: number,
  free: number,
  deliveryFee: number,
  option: number
}

export {
  CartItem,
  GetProduct,
  Data,
  Mall
}