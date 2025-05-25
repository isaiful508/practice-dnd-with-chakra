import { useState } from 'react'
import { 
  Box, 
  Text, 
  Badge, 
  Flex, 
  IconButton, 
  useDisclosure 
} from '@chakra-ui/react'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import TaskDetailModal from './TaskDetailModal'
import EditTaskModal from './EditTaskModal'
import DeleteConfirmationModal from './DeleteConfirmationModal'
import { useBoard } from '../context/BoardContext'

const TaskCard = ({ task, isDragging }) => {
  const { deleteTask } = useBoard()
  const [isHovered, setIsHovered] = useState(false)
  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure()
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: task.id,
    data: {
      type: 'task',
      task,
    },
  })
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }
  
  const handleDeleteClick = (e) => {
    e.stopPropagation()
    setIsDeleteOpen(true)
  }
  
  const handleEditClick = (e) => {
    e.stopPropagation()
    onEditOpen()
  }
  
  const handleDeleteConfirm = () => {
    deleteTask(task.id)
    setIsDeleteOpen(false)
  }
  
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error.500'
      case 'medium':
        return 'warning.500'
      case 'low':
        return 'success.500'
      default:
        return 'gray.500'
    }
  }

  return (
    <>
      <Box
        ref={setNodeRef}
        style={style}
        className={`task-card ${isDragging ? 'task-dragging' : ''}`}
        mb={2}
        p={3}
        bg="white"
        borderRadius="md"
        boxShadow="card"
        cursor="pointer"
        _hover={{ boxShadow: 'cardHover' }}
        onClick={onDetailOpen}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        position="relative"
        transition="all 0.2s"
        {...attributes}
        {...listeners}
      >
        <Box 
          className={`priority-indicator priority-${task.priority}`}
          position="absolute"
          top={0}
          left={0}
          right={0}
          borderTopLeftRadius="md"
          borderTopRightRadius="md"
        />
        
        <Text 
          fontWeight="medium" 
          mb={2}
          mt={1} 
          noOfLines={2}
        >
          {task.title}
        </Text>
        
        {task.description && (
          <Text 
            fontSize="sm" 
            color="gray.600" 
            noOfLines={2} 
            mb={2}
          >
            {task.description}
          </Text>
        )}
        
        <Flex justify="space-between" align="center">
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
            {task.priority}
          </Badge>
          
          {isHovered && (
            <Flex>
              <IconButton
                icon={<FiEdit2 />}
                aria-label="Edit task"
                size="xs"
                variant="ghost"
                onClick={handleEditClick}
                mr={1}
              />
              <IconButton
                icon={<FiTrash2 />}
                aria-label="Delete task"
                size="xs"
                variant="ghost"
                colorScheme="red"
                onClick={handleDeleteClick}
              />
            </Flex>
          )}
        </Flex>
      </Box>
      
      <TaskDetailModal 
        isOpen={isDetailOpen} 
        onClose={onDetailClose}
        task={task}
        onEdit={onEditOpen}
        onDelete={handleDeleteClick}
      />
      
      <EditTaskModal 
        isOpen={isEditOpen} 
        onClose={onEditClose}
        task={task}
      />
      
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
      />
    </>
  )
}

export default TaskCard