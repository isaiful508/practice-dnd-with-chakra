import { useState } from 'react'
import { 
  Box, 
  Flex, 
  Button, 
  useDisclosure 
} from '@chakra-ui/react'
import { 
  DndContext, 
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import { FiPlus } from 'react-icons/fi'
import Column from './Column'
import TaskCard from './TaskCard'
import AddColumnModal from './AddColumnModal'
import { useBoard } from '../context/BoardContext'

const Board = ({ isMobile }) => {
  const { 
    boardData, 
    moveTask,
    reorderColumn,
    reorderTaskInColumn,
    searchTerm
  } = useBoard()
  
  const [activeTask, setActiveTask] = useState(null)
  const [activeColumn, setActiveColumn] = useState(null)
  const [lastOverId, setLastOverId] = useState(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const findContainer = (id) => {
    if (id in boardData.tasks) {
      return boardData.tasks[id].columnId
    }
    return id
  }

  const handleDragStart = (event) => {
    const { active } = event
    const { id } = active
    
    if (id.startsWith('task-')) {
      setActiveTask(boardData.tasks[id])
    } else if (id.startsWith('column-')) {
      setActiveColumn(boardData.columns.find(col => col.id === id))
    }
  }

  const handleDragOver = (event) => {
    const { active, over } = event
    
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId.startsWith('task-')) {
      const activeContainer = findContainer(activeId)
      const overContainer = findContainer(overId)
      
      if (activeContainer !== overContainer) {
        setLastOverId(overContainer)
      }
    }
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    
    if (!over) {
      setActiveTask(null)
      setActiveColumn(null)
      return
    }
    
    if (active.id.startsWith('task-')) {
      const activeContainer = findContainer(active.id)
      const overContainer = findContainer(over.id)
      
      if (activeContainer !== overContainer) {
        const activeIndex = boardData.columns.find(col => col.id === activeContainer)
          .taskIds.indexOf(active.id)
        const overIndex = over.id.startsWith('task-')
          ? boardData.columns.find(col => col.id === overContainer)
              .taskIds.indexOf(over.id)
          : boardData.columns.find(col => col.id === overContainer)
              .taskIds.length

        moveTask(active.id, activeContainer, overContainer, overIndex)
      } else if (over.id.startsWith('task-') && active.id !== over.id) {
        const column = boardData.columns.find(col => col.id === activeContainer)
        const oldIndex = column.taskIds.indexOf(active.id)
        const newIndex = column.taskIds.indexOf(over.id)
        
        reorderTaskInColumn(activeContainer, oldIndex, newIndex)
      }
    }
    
    if (active.id.startsWith('column-') && over.id.startsWith('column-')) {
      const activeColumnId = active.id
      const overColumnId = over.id
      
      if (activeColumnId !== overColumnId) {
        const oldIndex = boardData.columns.findIndex(col => col.id === activeColumnId)
        const newIndex = boardData.columns.findIndex(col => col.id === overColumnId)
        
        reorderColumn(oldIndex, newIndex)
      }
    }
    
    setActiveTask(null)
    setActiveColumn(null)
    setLastOverId(null)
  }

  const filteredColumns = boardData.columns.map(column => {
    if (!searchTerm) return column
    
    const filteredTaskIds = column.taskIds.filter(taskId => {
      const task = boardData.tasks[taskId]
      return (
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    })
    
    return { ...column, taskIds: filteredTaskIds }
  })

  return (
    <>
      <Box mb={4}>
        <Button 
          leftIcon={<FiPlus />} 
          colorScheme="brand" 
          size="sm"
          onClick={onOpen}
        >
          Add Column
        </Button>
      </Box>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <Flex 
          className="board-container"
          overflowX={isMobile ? "visible" : "auto"}
          overflowY={isMobile ? "auto" : "hidden"}
          h="calc(100% - 40px)"
          pb={4}
          direction={isMobile ? "column" : "row"}
          align="flex-start"
          spacing={4}
        >
          {filteredColumns.map(column => (
            <Column 
              key={column.id} 
              column={column} 
              tasks={column.taskIds.map(taskId => boardData.tasks[taskId])}
              isMobile={isMobile}
            />
          ))}
        </Flex>
        
        <DragOverlay>
          {activeTask && (
            <TaskCard task={activeTask} isDragging />
          )}
          {activeColumn && (
            <Box opacity={0.8} bg="gray.100" p={2} borderRadius="md">
              {activeColumn.title}
            </Box>
          )}
        </DragOverlay>
      </DndContext>
      
      <AddColumnModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}

export default Board