import { TaskWithSchedule } from "@/types"
import { useDatabase } from "./useDatabase"
import { useEffect, useState } from "react"
import { completeTask, getTaskList } from "@/database/queries"
import { getLocalDateString } from "@/lib/utils"

export const useTaskList = () => {
  const { db } = useDatabase()
  const [taskList, setTaskList] = useState<TaskWithSchedule[]>([])
  const [refreshing, setRefreshing] = useState(false)

  const loadTaskList = async (dateStr?: string) => {
    if (!db) return
    setRefreshing(true)
    try {
      const effectiveDate = dateStr || getLocalDateString(new Date())
      const taskData = await getTaskList(db, effectiveDate)
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
    if (db) loadTaskList()
  }, [db])

  return { taskList, refreshing, loadTaskList, handleTaskCompleted }
}