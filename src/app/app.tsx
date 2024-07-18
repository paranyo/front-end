import { ChakraProvider } from '@chakra-ui/react'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { StrictMode } from 'react'
import Main from './search'
import Cart from './cart'
import Delivery from './delivery'
import Scanner from './scanner'
import Scanner6 from './scanner6'
import Scanner7 from './scanner7'

export function App() {
  return (
    <StrictMode>
      <ChakraProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/cart" element={<Cart />} />
            <Route path="/delivery" element={<Delivery />} />
            <Route path="/scanner" element={<Scanner />} />
            <Route path="/scanner6" element={<Scanner6 />} />
            <Route path="/scanner7" element={<Scanner7 />} />
            <Route path="/" element={<Main title={'mooluck'} />} />
          </Routes>
        </BrowserRouter>
      </ChakraProvider>
    </StrictMode>
  )
}
