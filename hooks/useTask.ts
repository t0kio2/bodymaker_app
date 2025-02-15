import { openDatabaseAsync } from "@/database/db"
import { getTaskById, insertTask, updateTask } from "@/database/queries"
import { Task } from "@/types"
import { useEffect, useState } from "react"

// タスクデータの取得・更新・保存を行うカスタムフック
export const useTask = (id: string | undefined, mode: 'create' | 'edit') => {
  const [task, setTask] = useState<Task | null>(null)

  useEffect(() => {
    if (id) {
      loadData(id)
    }
  }, [id])

  const loadData = async (taskId: string) => {
    try {
      const db = await openDatabaseAsync()
      const task = await getTaskById(db, taskId)
      if (task) setTask(task)
    } catch (error) {
      console.error(error)
      throw new Error('Failed to load data')
    }
  }
  
  const saveTask = async (task: Omit<Task, 'id'>) => {
    try {
      const db = await openDatabaseAsync()
      if (mode === 'create') {
        await insertTask(db, task)
        return true
      }
      if (mode === 'edit') {
        if (!id) return false
        await updateTask(db, { ...task, id })
        return true
      }
      return false
    } catch (error) {
      console.error(error)
      return false
    }
  }
  return { task, saveTask }
}