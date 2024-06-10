import { ChakraProvider } from '@chakra-ui/react'

import Main from './nx-welcome'

export function App() {
  return (
    <ChakraProvider>
      <Main title="asd" />
    </ChakraProvider>
  )
}