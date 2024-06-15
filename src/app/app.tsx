import { ChakraProvider } from '@chakra-ui/react'
import Main from './search'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Cart from './cart'

export function App() {
  return (
    <ChakraProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/cart" element={<Cart />} />
          <Route path="/" element={<Main title={'mooluck'} />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>

  )
}
