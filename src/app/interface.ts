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

interface GetStoreProduct {
  isInProduct: string,
  isInStoreProduct: {
    StoreId: number,
    barcode: number,
    price?: number,
    Expire?: string,
    stock: number,
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
  GetStoreProduct,
  Data,
  Mall,
}