import { TaskWithSchedule } from "@/types"
import { useDatabase } from "./useDatabase"
import { useEffect, useState } from "react"
import { getTasks } from "@/database/queries"

export const useTaskList = () => {
  const { db } = useDatabase()
  const [taskList, setTaskList] = useState<TaskWithSchedule[]>([])
  const [refreshing, setRefreshing] = useState(false)

  const loadTaskList = async () => {
    if (!db) return
    setRefreshing(true)
    try {
      const taskData = await getTasks(db)
      setTaskList(taskData)
    } catch (error) {
      console.error(error)
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    if (db) loadTaskList()
  }, [db])

  return { taskList, refreshing, loadTaskList }
}