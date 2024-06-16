import { ChakraProvider } from '@chakra-ui/react'
import Main from './search'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Cart from './cart'
import { StrictMode } from 'react'

export function App() {
  return (
    <StrictMode>
      <ChakraProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/cart" element={<Cart />} />
            <Route path="/" element={<Main title={'mooluck'} />} />
          </Routes>
        </BrowserRouter>
      </ChakraProvider>
    </StrictMode>
  )
}
