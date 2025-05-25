import { useState, useEffect } from 'react'
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

const EditColumnModal = ({ isOpen, onClose, column }) => {
  const { updateColumn } = useBoard()
  const [title, setTitle] = useState('')

  useEffect(() => {
    if (column) {
      setTitle(column.title || '')
    }
  }, [column, isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!title.trim()) return
    
    updateColumn(column.id, { title })
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay backdropFilter="blur(2px)" />
      <ModalContent borderRadius="md" boxShadow="lg">
        <form onSubmit={handleSubmit}>
          <ModalHeader>Edit Column</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Column Title</FormLabel>
              <Input 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Column title"
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
              Update Column
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

export default EditColumnModal