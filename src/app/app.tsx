import { ChakraProvider } from '@chakra-ui/react'

import Main from './nx-welcome'
import { Toaster } from 'react-hot-toast'

export function App() {
  return (
    <ChakraProvider>
      <Toaster />
      <Main title="asd" />
    </ChakraProvider>
  )
}