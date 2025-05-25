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
  useSensors 
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
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
    searchTerm
  } = useBoard()
  
  const [activeTask, setActiveTask] = useState(null)
  const [activeColumn, setActiveColumn] = useState(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event) => {
    const { active } = event
    const { id } = active
    
    if (id.startsWith('task-')) {
      setActiveTask(boardData.tasks[id])
    } else if (id.startsWith('column-')) {
      setActiveColumn(boardData.columns.find(col => col.id === id))
    }
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    
    if (!over) {
      setActiveTask(null)
      setActiveColumn(null)
      return
    }
    
    if (active.id.startsWith('task-') && over.id.startsWith('column-')) {
      const taskId = active.id
      const task = boardData.tasks[taskId]
      const sourceColumnId = task.columnId
      const destinationColumnId = over.id
      
      if (sourceColumnId !== destinationColumnId) {
        moveTask(
          taskId,
          sourceColumnId,
          destinationColumnId,
          boardData.columns.find(col => col.id === destinationColumnId).taskIds.length
        )
      }
    }
    
    if (active.id.startsWith('task-') && over.id.startsWith('task-')) {
      const activeTaskId = active.id
      const overTaskId = over.id
      const activeTask = boardData.tasks[activeTaskId]
      const overTask = boardData.tasks[overTaskId]
      
      if (activeTask.columnId === overTask.columnId) {
        const columnId = activeTask.columnId
        const column = boardData.columns.find(col => col.id === columnId)
        const oldIndex = column.taskIds.indexOf(activeTaskId)
        const newIndex = column.taskIds.indexOf(overTaskId)
        
        if (oldIndex !== newIndex) {
          const newTaskIds = arrayMove(column.taskIds, oldIndex, newIndex)
          
          const updatedColumns = boardData.columns.map(col => 
            col.id === columnId ? { ...col, taskIds: newTaskIds } : col
          )
          
        }
      } else {
        const sourceColumnId = activeTask.columnId
        const destinationColumnId = overTask.columnId
        const destinationColumn = boardData.columns.find(col => col.id === destinationColumnId)
        const newIndex = destinationColumn.taskIds.indexOf(overTaskId)
        
        moveTask(activeTaskId, sourceColumnId, destinationColumnId, newIndex)
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
        onDragStart={handleDragStart}
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