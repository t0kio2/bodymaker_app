import { TaskWithSchedule } from "@/types"
import { useDatabase } from "./useDatabase"
import { useEffect, useState } from "react"
import { getTaskList, getTaskListByDay } from "@/database/queries"

export const useTaskList = (dayBit?: number) => {
  const { db } = useDatabase()
  const [taskList, setTaskList] = useState<TaskWithSchedule[]>([])
  const [refreshing, setRefreshing] = useState(false)

  const loadTaskList = async () => {
    if (!db) return
    setRefreshing(true)
    try {
      const taskData = dayBit ? await getTaskListByDay(db, dayBit) : await getTaskList(db)
      setTaskList(taskData)
    } catch (error) {
      console.error(error)
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    if (db) loadTaskList()
  }, [db, dayBit])

  return { taskList, refreshing, loadTaskList }
}