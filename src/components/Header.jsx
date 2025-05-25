import { 
  Box, 
  Flex, 
  Heading, 
  Input, 
  InputGroup, 
  InputLeftElement, 
  useMediaQuery
} from '@chakra-ui/react'
import { FiSearch} from 'react-icons/fi'
import { useBoard } from '../context/BoardContext'

const Header = () => {
  const { searchTerm, setSearchTerm } = useBoard()
  const [isMobile] = useMediaQuery("(max-width: 768px)")

  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      p={4}
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.200"
      h="64px"
      position="sticky"
      top={0}
      zIndex={10}
      boxShadow="sm"
    >
      <Flex align="center">
        <Box 
          bg="brand.500" 
          w="24px" 
          h="24px" 
          borderRadius="4px" 
          mr={2}
        />
        <Heading 
          size={isMobile ? "sm" : "md"} 
          fontWeight="600"
          bgGradient="linear(to-r, brand.500, accent.500)"
          bgClip="text"
        >
          TaskFlow
        </Heading>
      </Flex>

      <Flex align="center" flex={1} mx={4} maxW={{ base: "auto", md: "400px" }} justifySelf="center">
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <FiSearch color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Search tasks..."
            variant="filled"
            bg="gray.100"
            _hover={{ bg: 'gray.200' }}
            _focus={{ bg: 'white', borderColor: 'brand.500' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="sm"
            borderRadius="md"
          />
        </InputGroup>
      </Flex>
    </Flex>
  )
}

export default Header