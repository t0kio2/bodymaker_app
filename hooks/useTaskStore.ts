import { TaskWithSchedule } from "@/types"
import { useDatabase } from "./useDatabase"
import { useEffect, useState, useCallback } from "react"
import { completeTask, getAllTask, getTaskListByDay, deleteTask } from "@/database/queries"
import { formatDateToYYYYMMDD } from "@/lib/utils"
import { eventEmitter } from "@/lib/EventEmitter"
import * as Notifications from 'expo-notifications'

/**
 * Central task data store hook
 * Manages all task-related data and operations
 */
export const useTaskStore = () => {
  const { db } = useDatabase()
  const [allTasks, setAllTasks] = useState<TaskWithSchedule[]>([])
  const [tasksByDay, setTasksByDay] = useState<TaskWithSchedule[]>([])
  const [selectedDate, setSelectedDate] = useState<string>(formatDateToYYYYMMDD(new Date()))
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Load all tasks from the database
   */
  const loadAllTasks = useCallback(async () => {
    if (!db) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const taskData = await getAllTask(db)
      setAllTasks(taskData)
      return taskData
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load tasks'
      setError(errorMessage)
      console.error('Error loading all tasks:', err)
      return []
    } finally {
      setIsLoading(false)
    }
  }, [db])

  /**
   * Load tasks for a specific day
   */
  const loadTasksByDay = useCallback(async (dateStr?: string) => {
    if (!db) return
    
    const effectiveDate = dateStr || selectedDate
    
    try {
      const taskData = await getTaskListByDay(db, effectiveDate)
      setTasksByDay(taskData)
      return taskData
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load tasks for day'
      setError(errorMessage)
      console.error('Error loading tasks by day:', err)
      return []
    }
  }, [db, selectedDate])

  /**
   * Complete a task for a specific date
   */
  const completeTaskForDate = useCallback(async (taskId: string, taskScheduleId: string, date: string) => {
    if (!db) return false
    
    setError(null)
    
    try {
      const result = await completeTask(db, taskId, taskScheduleId, date)
      
      await Promise.all([
        loadAllTasks(),
        loadTasksByDay()
      ])
      
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete task'
      setError(errorMessage)
      console.error('Error completing task:', err)
      return false
    }
  }, [db, loadAllTasks, loadTasksByDay])

  /**
   * Delete a task and its related records
   */
  const removeTask = useCallback(async (id: string) => {
    if (!db) return false
    
    setError(null)
    
    try {
      await deleteTask(db, id)
      
      eventEmitter.emit('taskUpdated')
      
      await Promise.all([
        loadAllTasks(),
        loadTasksByDay()
      ])
      
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete task'
      setError(errorMessage)
      console.error('Error deleting task:', err)
      return false
    }
  }, [db, loadAllTasks, loadTasksByDay])

  /**
   * Change the selected date and load tasks for that date
   */
  const changeSelectedDate = useCallback((dateStr: string) => {
    setSelectedDate(dateStr)
    loadTasksByDay(dateStr)
  }, [loadTasksByDay])

  useEffect(() => {
    if (db) {
      loadAllTasks()
      loadTasksByDay()
    }
  }, [db, loadAllTasks, loadTasksByDay])

  useEffect(() => {
    const handleTaskUpdated = () => {
      loadAllTasks()
      loadTasksByDay()
    }
    
    eventEmitter.on('taskUpdated', handleTaskUpdated)
    
    return () => {
      eventEmitter.off('taskUpdated', handleTaskUpdated)
    }
  }, [loadAllTasks, loadTasksByDay])

  return {
    allTasks,
    tasksByDay,
    selectedDate,
    isLoading,
    error,
    loadAllTasks,
    loadTasksByDay,
    completeTaskForDate,
    removeTask,
    changeSelectedDate,
  }
}
