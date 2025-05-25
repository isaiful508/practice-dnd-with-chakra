import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text
} from '@chakra-ui/react'

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay backdropFilter="blur(2px)" />
      <ModalContent borderRadius="md" boxShadow="lg">
        <ModalHeader color="red.500">{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>{message}</Text>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={onConfirm}>
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default DeleteConfirmationModal