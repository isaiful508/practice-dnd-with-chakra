import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Badge,
  Button,
  Box,
  Flex,
  IconButton
} from '@chakra-ui/react'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import { useBoard } from '../context/BoardContext'

const TaskDetailModal = ({ isOpen, onClose, task, onEdit, onDelete }) => {
  const { boardData } = useBoard()
  
  if (!task) return null
  
  const column = boardData.columns.find(col => col.id === task.columnId)
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay backdropFilter="blur(2px)" />
      <ModalContent borderRadius="md" boxShadow="lg">
        <Box 
          className={`priority-indicator priority-${task.priority}`} 
          position="absolute"
          top={0}
          left={0}
          right={0}
          height="8px"
          borderTopLeftRadius="md"
          borderTopRightRadius="md"
        />
        
        <ModalHeader pt={6} display="flex" justifyContent="space-between" alignItems="center">
          <Text>{task.title}</Text>
          <Flex>
            <IconButton
              icon={<FiEdit2 />}
              aria-label="Edit task"
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation()
                onClose()
                onEdit()
              }}
              mr={1}
            />
            <IconButton
              icon={<FiTrash2 />}
              aria-label="Delete task"
              size="sm"
              variant="ghost"
              colorScheme="red"
              onClick={(e) => {
                e.stopPropagation()
                onClose()
                onDelete(e)
              }}
            />
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <Flex mb={4} wrap="wrap" gap={2}>
            <Badge colorScheme="gray" fontSize="xs">
              {column ? column.title : 'Unknown column'}
            </Badge>
            
            <Badge 
              colorScheme={
                task.priority === 'high' 
                  ? 'red' 
                  : task.priority === 'medium' 
                  ? 'orange' 
                  : 'green'
              }
              fontSize="xs"
            >
              {task.priority} priority
            </Badge>
          </Flex>
          
          <Box mb={4}>
            <Text fontWeight="medium" mb={1} fontSize="sm" color="gray.600">
              Description
            </Text>
            <Text whiteSpace="pre-line">
              {task.description || 'No description provided.'}
            </Text>
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="brand" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default TaskDetailModal