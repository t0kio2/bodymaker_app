import { useEffect, useState, useCallback } from "react"
import { useDatabase } from "./useDatabase"
import { TaskWithSchedule, ContinuityRate } from "@/types"

/**
 * Analytics hook for task completion metrics
 * Handles calculation of continuity rates and other analytics
 */
export const useAnalytics = () => {
  const { db } = useDatabase()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Calculate rolling continuity rate for a task
   */
  const calculateContinuityRate = useCallback(async (
    task: TaskWithSchedule,
    days: number = 30
  ): Promise<ContinuityRate> => {
    if (!db) {
      return { rate: 0, completedCount: 0, totalCount: 0 }
    }

    setIsLoading(true)
    setError(null)

    try {
      const today = new Date()
      
      const startDate = new Date()
      startDate.setDate(today.getDate() - days)
      
      const startDateStr = startDate.toISOString().split('T')[0]
      const endDateStr = today.toISOString().split('T')[0]
      
      const taskLogs = await db.getAllAsync(`
        SELECT date FROM task_logs 
        WHERE task_schedule_id = ? 
        AND date BETWEEN ? AND ?
      `, [task.task_schedule_id, startDateStr, endDateStr])
      
      const completedCount = taskLogs.length
      
      const totalDays = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      let totalScheduledDays = 0
      
      for (let i = 0; i < totalDays; i++) {
        const date = new Date(startDate)
        date.setDate(startDate.getDate() + i)
        
        const dayOfWeek = date.getDay() // 0 = Sunday, 1 = Monday, etc.
        const dayBit = 1 << dayOfWeek
        
        if ((task.bitmask_days & dayBit) !== 0) {
          totalScheduledDays++
        }
      }
      
      const rate = totalScheduledDays > 0 ? (completedCount / totalScheduledDays) * 100 : 0
      
      return {
        rate,
        completedCount,
        totalCount: totalScheduledDays
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to calculate continuity rate'
      setError(errorMessage)
      console.error('Error calculating continuity rate:', err)
      return { rate: 0, completedCount: 0, totalCount: 0 }
    } finally {
      setIsLoading(false)
    }
  }, [db])

  /**
   * Add continuity rate to a task object
   */
  const addContinuityRateToTask = useCallback(async (
    task: TaskWithSchedule
  ): Promise<TaskWithSchedule> => {
    try {
      const continuityRate = await calculateContinuityRate(task)
      return {
        ...task,
        continuityRate
      }
    } catch (err) {
      console.error('Error adding continuity rate to task:', err)
      return task
    }
  }, [calculateContinuityRate])

  /**
   * Process multiple tasks to add continuity rates
   */
  const processTasks = useCallback(async (
    tasks: TaskWithSchedule[]
  ): Promise<TaskWithSchedule[]> => {
    try {
      const tasksWithRates = await Promise.all(
        tasks.map(task => addContinuityRateToTask(task))
      )
      return tasksWithRates
    } catch (err) {
      console.error('Error processing tasks:', err)
      return tasks
    }
  }, [addContinuityRateToTask])

  return {
    isLoading,
    error,
    calculateContinuityRate,
    addContinuityRateToTask,
    processTasks
  }
}
