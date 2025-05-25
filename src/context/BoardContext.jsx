import { createContext, useContext, useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

const BoardContext = createContext()

export const useBoard = () => useContext(BoardContext)

const defaultBoard = {
  columns: [
    {
      id: 'column-1',
      title: 'To Do',
      taskIds: [],
      color: 'gray.100'
    },
    {
      id: 'column-2',
      title: 'In Progress',
      taskIds: [],
      color: 'blue.50'
    },
    {
      id: 'column-3',
      title: 'Done',
      taskIds: [],
      color: 'green.50'
    }
  ],
  tasks: {}
}

const sampleTasks = [
  {
    id: 'task-1',
    title: 'Research user needs',
    description: 'Conduct user interviews to understand pain points',
    priority: 'medium',
    columnId: 'column-1'
  },
  {
    id: 'task-2',
    title: 'Create wireframes',
    description: 'Design initial wireframes for the application',
    priority: 'high',
    columnId: 'column-1'
  },
  {
    id: 'task-3',
    title: 'Develop landing page',
    description: 'Code the landing page based on approved design',
    priority: 'low',
    columnId: 'column-2'
  },
  {
    id: 'task-4',
    title: 'Test navigation',
    description: 'Ensure navigation works on all devices',
    priority: 'medium',
    columnId: 'column-2'
  },
  {
    id: 'task-5',
    title: 'Setup analytics',
    description: 'Implement analytics tracking to monitor user behavior',
    priority: 'low',
    columnId: 'column-3'
  }
]

const initialBoardWithTasks = () => {
  const tasks = {}
  const columns = defaultBoard.columns.map(column => {
    const columnTasks = sampleTasks.filter(task => task.columnId === column.id)
    const taskIds = columnTasks.map(task => {
      tasks[task.id] = task
      return task.id
    })
    return { ...column, taskIds }
  })
  
  return { columns, tasks }
}

export const BoardProvider = ({ children }) => {
  const [boardData, setBoardData] = useState(() => {
    const savedBoard = localStorage.getItem('boardData')
    return savedBoard ? JSON.parse(savedBoard) : initialBoardWithTasks()
  })
  
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    localStorage.setItem('boardData', JSON.stringify(boardData))
  }, [boardData])

  const addTask = (columnId, task) => {
    const taskId = `task-${uuidv4()}`
    const newTask = {
      id: taskId,
      ...task,
      columnId
    }
    
    setBoardData(prev => {
      const column = prev.columns.find(col => col.id === columnId)
      const updatedTaskIds = [...column.taskIds, taskId]
      
      const updatedColumns = prev.columns.map(col => 
        col.id === columnId ? { ...col, taskIds: updatedTaskIds } : col
      )
      
      return {
        columns: updatedColumns,
        tasks: { ...prev.tasks, [taskId]: newTask }
      }
    })
  }

  const updateTask = (taskId, updatedTask) => {
    setBoardData(prev => {
      const existingTask = prev.tasks[taskId]
      const newColumnId = updatedTask.columnId || existingTask.columnId
      
      if (newColumnId !== existingTask.columnId) {
        const oldColumn = prev.columns.find(col => col.id === existingTask.columnId)
        const newColumn = prev.columns.find(col => col.id === newColumnId)
        
        const updatedOldTaskIds = oldColumn.taskIds.filter(id => id !== taskId)
        const updatedNewTaskIds = [...newColumn.taskIds, taskId]
        
        const updatedColumns = prev.columns.map(col => {
          if (col.id === existingTask.columnId) {
            return { ...col, taskIds: updatedOldTaskIds }
          }
          if (col.id === newColumnId) {
            return { ...col, taskIds: updatedNewTaskIds }
          }
          return col
        })
        
        return {
          columns: updatedColumns,
          tasks: { 
            ...prev.tasks, 
            [taskId]: { 
              ...existingTask, 
              ...updatedTask, 
              columnId: newColumnId 
            } 
          }
        }
      }
      
      return {
        ...prev,
        tasks: { 
          ...prev.tasks, 
          [taskId]: { ...existingTask, ...updatedTask } 
        }
      }
    })
  }

  const deleteTask = (taskId) => {
    setBoardData(prev => {
      const { [taskId]: taskToRemove, ...remainingTasks } = prev.tasks
      const columnId = taskToRemove.columnId
      
      const updatedColumns = prev.columns.map(col => {
        if (col.id === columnId) {
          return {
            ...col,
            taskIds: col.taskIds.filter(id => id !== taskId)
          }
        }
        return col
      })
      
      return {
        columns: updatedColumns,
        tasks: remainingTasks
      }
    })
  }

  const addColumn = (title) => {
    const columnId = `column-${uuidv4()}`
    const newColumn = {
      id: columnId,
      title,
      taskIds: [],
      color: 'gray.50'
    }
    
    setBoardData(prev => ({
      ...prev,
      columns: [...prev.columns, newColumn]
    }))
  }

  const updateColumn = (columnId, updates) => {
    setBoardData(prev => ({
      ...prev,
      columns: prev.columns.map(col => 
        col.id === columnId ? { ...col, ...updates } : col
      )
    }))
  }

  const deleteColumn = (columnId) => {
    setBoardData(prev => {
      const column = prev.columns.find(col => col.id === columnId)
      const taskIdsToRemove = column.taskIds
      
      const updatedTasks = { ...prev.tasks }
      taskIdsToRemove.forEach(taskId => {
        delete updatedTasks[taskId]
      })
      
      return {
        columns: prev.columns.filter(col => col.id !== columnId),
        tasks: updatedTasks
      }
    })
  }

  const moveTask = (taskId, sourceColumnId, destinationColumnId, newIndex) => {
    setBoardData(prev => {
      const sourceColumn = prev.columns.find(col => col.id === sourceColumnId)
      const sourceTaskIds = [...sourceColumn.taskIds]
      const sourceIndex = sourceTaskIds.indexOf(taskId)
      sourceTaskIds.splice(sourceIndex, 1)
      
      const destinationColumn = prev.columns.find(col => col.id === destinationColumnId)
      const destinationTaskIds = [...destinationColumn.taskIds]
      destinationTaskIds.splice(newIndex, 0, taskId)
      
      const updatedTask = {
        ...prev.tasks[taskId],
        columnId: destinationColumnId
      }
      
      const updatedColumns = prev.columns.map(col => {
        if (col.id === sourceColumnId) {
          return { ...col, taskIds: sourceTaskIds }
        }
        if (col.id === destinationColumnId) {
          return { ...col, taskIds: destinationTaskIds }
        }
        return col
      })
      
      return {
        columns: updatedColumns,
        tasks: { 
          ...prev.tasks, 
          [taskId]: updatedTask 
        }
      }
    })
  }

  const reorderTaskInColumn = (columnId, oldIndex, newIndex) => {
    setBoardData(prev => {
      const column = prev.columns.find(col => col.id === columnId)
      const newTaskIds = [...column.taskIds]
      const [movedTask] = newTaskIds.splice(oldIndex, 1)
      newTaskIds.splice(newIndex, 0, movedTask)
      
      const updatedColumns = prev.columns.map(col =>
        col.id === columnId ? { ...col, taskIds: newTaskIds } : col
      )
      
      return {
        ...prev,
        columns: updatedColumns
      }
    })
  }

  const reorderColumn = (sourceIndex, destinationIndex) => {
    setBoardData(prev => {
      const columns = [...prev.columns]
      const [movedColumn] = columns.splice(sourceIndex, 1)
      columns.splice(destinationIndex, 0, movedColumn)
      
      return {
        ...prev,
        columns
      }
    })
  }

  const value = {
    boardData,
    searchTerm,
    setSearchTerm,
    addTask,
    updateTask,
    deleteTask,
    addColumn,
    updateColumn,
    deleteColumn,
    moveTask,
    reorderTaskInColumn,
    reorderColumn
  }

  return (
    <BoardContext.Provider value={value}>
      {children}
    </BoardContext.Provider>
  )
}