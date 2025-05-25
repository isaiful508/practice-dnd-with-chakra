import { useState, useEffect } from 'react'
import { Box, Flex } from '@chakra-ui/react'
import Header from './components/Header'
import Board from './components/Board'
import { BoardProvider } from './context/BoardContext'

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <BoardProvider>
      <Flex direction="column" h="100vh">
        <Header />
        <Box 
          flex="1" 
          overflow="hidden" 
          p={{ base: 2, md: 4 }}
          bg="gray.50"
        >
          <Board isMobile={isMobile} />
        </Box>
      </Flex>
    </BoardProvider>
  )
}

export default App