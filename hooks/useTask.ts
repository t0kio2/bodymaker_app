import { getTaskById, insertTask, updateTask } from "@/database/queries"
import { Schedule, Task } from "@/types"
import { useEffect, useState } from "react"
import { useDatabase } from "./useDatabase"

// タスクデータの取得・更新・保存を行うカスタムフック
export const useTask = (id: string | undefined, mode: 'create' | 'edit') => {
  const { db } = useDatabase()
  const [task, setTask] = useState<Task | null>(null)

  useEffect(() => {
    if (id && db) {
      (async () => {
        try {
          const fetchedTask = await getTaskById(db, id)
          if (fetchedTask) setTask(fetchedTask)

        } catch (error) {
          console.error(error)
        }
      })()
    }
  }, [id, db])

  const saveTask = async (task: Omit<Task, 'id'>, schedule: Schedule) => {
    // console.log('saveTask', task, schedule)
    // return
    if (!db) return false
    try {
      if (mode === 'create') {
        await insertTask(db, task, schedule)
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