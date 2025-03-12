import { TaskWithSchedule } from "@/types"
import { useDatabase } from "./useDatabase"
import { useEffect, useState } from "react"
import { completeTask, getAllTask, getTaskListByDay } from "@/database/queries"
import { getLocalDateString } from "@/lib/utils"

export const useTaskList = () => {
  const { db } = useDatabase()
  const [taskList, setTaskList] = useState<TaskWithSchedule[]>([])
  const [allTask, setAllTask] = useState<TaskWithSchedule[]>([])
  const [refreshing, setRefreshing] = useState(false)

  const loadAllTask = async () => {
    if (!db) return
    setRefreshing(true)
    try {
      const taskData = await getAllTask(db)
      console.log('allTask', taskData)
      setAllTask(taskData)
    } catch (error) {
      console.error(error)
    } finally {
      setRefreshing(false)
    }
  }

  const loadTaskListByDay = async (dateStr?: string) => {
    if (!db) return
    setRefreshing(true)
    try {
      const effectiveDate = dateStr || getLocalDateString(new Date())
      console.log('effectiveDate', effectiveDate)
      const taskData = await getTaskListByDay(db, effectiveDate)
      console.log('taskData', taskData[0])
      setTaskList(taskData)
    } catch (error) {
      console.error(error)
    } finally {
      setRefreshing(false)
    }
  }

  const handleTaskCompleted = async (taskScheduleId: string, date: string) => {
    if (!db) return
    try {
      const result = await completeTask(db, taskScheduleId, date)
      return result
    } catch (error) {
      console.error("completeTaskForDate error:", error)
    }
  }

  useEffect(() => {
    if (db) loadTaskListByDay()
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