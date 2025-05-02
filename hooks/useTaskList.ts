import { TaskWithSchedule } from "@/types"
import { useDatabase } from "./useDatabase"
import { useEffect, useState } from "react"
import { completeTask, getAllTask, getTaskListByDay } from "@/database/queries"
import { formatDateToYYYYMMDD } from "@/lib/utils"
import { useRollingContinuityRate } from "./useRollingContinuityRate"

export const useTaskList = () => {
  const { db } = useDatabase()
  const { addContinuityRateToTask } = useRollingContinuityRate()
  const [taskList, setTaskList] = useState<TaskWithSchedule[]>([])
  const [allTask, setAllTask] = useState<TaskWithSchedule[]>([])
  const [refreshing, setRefreshing] = useState(false)

  const loadAllTask = async () => {
    if (!db) return
    setRefreshing(true)
    try {
      const taskData = await getAllTask(db)

      const taskWithRatePromises = taskData.map(async (task) => {
        const taskWithRate = await addContinuityRateToTask(db, task)
        return taskWithRate
      })
      const taskWithRate = await Promise.all(taskWithRatePromises)
      
      setAllTask(taskWithRate)
    } catch (error) {
      console.error(error)
    } finally {
      setRefreshing(false)
    }
  }

  const loadTaskListByDay = async (dateStr?: string) => {
    if (!db) return
    // 日付クリックの度にローディングアイコンが表示されるのでコメントアウト
    // setRefreshing(true)
    try {
      const effectiveDate = dateStr || formatDateToYYYYMMDD(new Date())
      const taskData = await getTaskListByDay(db, effectiveDate)

      const taskWithRatePromises = taskData.map(async (task) => {
        const taskWithRate = await addContinuityRateToTask(db, task)
        return taskWithRate
      })
      const taskWithRate = await Promise.all(taskWithRatePromises)
      setTaskList(taskWithRate)
    } catch (error) {
      console.error(error)
    } finally {
      setRefreshing(false)
    }
  }

  const handleTaskCompleted = async (taskId: string, taskScheduleId: string, date: string) => {
    if (!db) return
    try {
      const result = await completeTask(db, taskId, taskScheduleId, date)
      return result
    } catch (error) {
      console.error("completeTaskForDate error:", error)
    }
  }

  useEffect(() => {
    console.log('useTaskList: 更新')
    if (db) {
      loadTaskListByDay()
      loadAllTask()
    }
  }, [db])

  return { 
    taskList,
    refreshing,
    loadTaskListByDay,
    handleTaskCompleted,
    allTask,
    loadAllTask
  }
}