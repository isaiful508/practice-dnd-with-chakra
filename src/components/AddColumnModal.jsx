import { useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input
} from '@chakra-ui/react'
import { useBoard } from '../context/BoardContext'

const AddColumnModal = ({ isOpen, onClose }) => {
  const { addColumn } = useBoard()
  const [title, setTitle] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!title.trim()) return
    
    addColumn(title)
    setTitle('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay backdropFilter="blur(2px)" />
      <ModalContent borderRadius="md" boxShadow="lg">
        <form onSubmit={handleSubmit}>
          <ModalHeader>Add New Column</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Column Title</FormLabel>
              <Input 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. In Review, Blocked, etc."
                autoFocus
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="brand" 
              type="submit"
              isDisabled={!title.trim()}
            >
              Add Column
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

export default AddColumnModal