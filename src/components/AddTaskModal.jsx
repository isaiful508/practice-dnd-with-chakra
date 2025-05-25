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
  Input,
  Textarea,
  Select,
  VStack
} from '@chakra-ui/react'
import { useBoard } from '../context/BoardContext'

const AddTaskModal = ({ isOpen, onClose, columnId }) => {
  const { addTask } = useBoard()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium'
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.title.trim()) return
    
    addTask(columnId, formData)
    
    setFormData({
      title: '',
      description: '',
      priority: 'medium'
    })
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay backdropFilter="blur(2px)" />
      <ModalContent borderRadius="md" boxShadow="lg">
        <form onSubmit={handleSubmit}>
          <ModalHeader>Add New Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Title</FormLabel>
                <Input 
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Task title"
                  autoFocus
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Add details about this task..."
                  resize="vertical"
                  rows={4}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Priority</FormLabel>
                <Select 
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="brand" 
              type="submit"
              isDisabled={!formData.title.trim()}
            >
              Add Task
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}

export default AddTaskModal