import { useCallback } from "react"
import { Schedule, Task, TaskWithSchedule } from "@/types"
import { useDatabase } from "./useDatabase"
import { getTaskById, insertTask, updateTask } from "@/database/queries"
import { useState, useEffect } from "react"
import { eventEmitter } from "@/lib/EventEmitter"

/**
 * Task actions hook
 * Handles task CRUD operations
 */
export const useTaskActions = (id?: string, mode?: 'create' | 'edit') => {
  const { db } = useDatabase()
  const [task, setTask] = useState<TaskWithSchedule | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Fetch task by ID
   */
  useEffect(() => {
    if (!id || !db) return
    
    const fetchTask = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const fetchedTask = await getTaskById(db, id)
        setTask(fetchedTask)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch task'
        setError(errorMessage)
        console.error('Error fetching task:', err)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchTask()
  }, [id, db])

  /**
   * Save a task (create or update)
   */
  const saveTask = useCallback(async (task: Task, schedule: Schedule) => {
    if (!db) return false
    
    setIsLoading(true)
    setError(null)
    
    try {
      if (mode === 'create') {
        await insertTask(db, task, schedule)
      } else if (mode === 'edit' && id) {
        await updateTask(db, task, schedule)
      } else {
        throw new Error('Invalid mode or missing task ID')
      }
      
      eventEmitter.emit('taskUpdated')
      
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save task'
      setError(errorMessage)
      console.error('Error saving task:', err)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [db, id, mode])

  return {
    task,
    isLoading,
    error,
    saveTask,
  }
}
