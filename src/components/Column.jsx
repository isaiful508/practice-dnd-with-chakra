import { useState } from 'react'
import { 
  Box, 
  Heading, 
  IconButton, 
  Flex, 
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  Badge,
  useDisclosure
} from '@chakra-ui/react'
import { FiMoreVertical, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import TaskCard from './TaskCard'
import AddTaskModal from './AddTaskModal'
import EditColumnModal from './EditColumnModal'
import DeleteConfirmationModal from './DeleteConfirmationModal'
import { useBoard } from '../context/BoardContext'

const Column = ({ column, tasks, isMobile }) => {
  const { deleteColumn } = useBoard()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const { isOpen: isAddTaskOpen, onOpen: onAddTaskOpen, onClose: onAddTaskClose } = useDisclosure()
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: column.id,
    data: {
      type: 'column',
      column,
    },
  })
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleDeleteClick = () => {
    setIsDeleteOpen(true)
  }

  const handleDeleteConfirm = () => {
    deleteColumn(column.id)
    setIsDeleteOpen(false)
  }

  return (
    <>
      <Box
        ref={setNodeRef}
        style={style}
        className="column"
        flex={isMobile ? "auto" : "0 0 300px"}
        w={isMobile ? "100%" : "300px"}
        h={isMobile ? "auto" : "100%"}
        bg={column.color || "gray.50"}
        borderRadius="md"
        boxShadow="sm"
        mr={isMobile ? 0 : 4}
        mb={isMobile ? 4 : 0}
        overflow="hidden"
        display="flex"
        flexDirection="column"
        transition="background-color 0.2s"
        {...attributes}
      >
        <Flex 
          className="column-header"
          px={3}
          py={2}
          borderBottom="1px solid"
          borderColor="gray.200"
          alignItems="center"
          bg="white"
          justify="space-between"
          userSelect="none"
          {...listeners}
        >
          <Flex align="center">
            <Heading size="sm">{column.title}</Heading>
            <Badge ml={2} colorScheme="gray" borderRadius="full">
              {tasks.length}
            </Badge>
          </Flex>
          
          <Flex>
            <IconButton
              icon={<FiPlus />}
              variant="ghost"
              size="sm"
              aria-label="Add task"
              onClick={onAddTaskOpen}
              mr={1}
            />
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<FiMoreVertical />}
                variant="ghost"
                size="sm"
                aria-label="Column options"
              />
              <MenuList fontSize="sm">
                <MenuItem icon={<FiEdit2 />} onClick={onEditOpen}>
                  Edit column
                </MenuItem>
                <MenuItem icon={<FiTrash2 />} color="red.500" onClick={handleDeleteClick}>
                  Delete column
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
        
        <Box 
          overflowY="auto" 
          p={2} 
          flex="1"
          className="fade-in"
          sx={{
            '&::-webkit-scrollbar': {
              width: '4px',
            },
            '&::-webkit-scrollbar-track': {
              width: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'gray.300',
              borderRadius: '24px',
            },
          }}
        >
          {tasks.length === 0 && (
            <Text 
              textAlign="center" 
              color="gray.500" 
              fontSize="sm" 
              p={4}
              fontStyle="italic"
            >
              No tasks yet
            </Text>
          )}
          
          {tasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
            />
          ))}
        </Box>
      </Box>

      <AddTaskModal 
        isOpen={isAddTaskOpen} 
        onClose={onAddTaskClose} 
        columnId={column.id}
      />
      
      <EditColumnModal 
        isOpen={isEditOpen} 
        onClose={onEditClose} 
        column={column}
      />
      
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Column"
        message={`Are you sure you want to delete "${column.title}" column? All tasks within this column will be permanently deleted.`}
      />
    </>
  )
}

export default Column