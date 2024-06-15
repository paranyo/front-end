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

export {
  CartItem,
  GetProduct,
  Data
}