import { Task, Schedule } from "@/types"
import { deleteDatabaseAsync } from "expo-sqlite"

export const getTasks = async (db: any): Promise<Task[]> => {
  try {
    const tasks = await db.getAllAsync(
      `SELECT
        t.id AS id,
        t.title,
        t.goal,
        t.start_date,
        t.is_push_notification,
        t.created_at,

        ts.bitmask_days,
        ts.time

        FROM tasks AS t
        LEFT JOIN task_schedules AS ts ON t.id = ts.task_id
        ;`
    )
    return tasks
  } catch (error) {
    throw error
  }
}

export const getTaskById = async (db: any, id: string): Promise<Task | null> => { 
  try {
    const task = await db.getFirstAsync(
      `SELECT * FROM tasks WHERE id = ?;`,
      [id]
    )
    if (!task) return null
    // task.schedule = parseSchedule(task.schedule)
    return task
  } catch (error) {
    throw error
  }
}

export const insertTask = async (db: any, task: Omit<Task, 'id'>, schedule: any) => {
  try {
    const result = await db.runAsync(
      `INSERT INTO tasks (title, goal, start_date, is_push_notification)
        VALUES (?, ?, ?, ?);`,
        [
          task.title,
          task.goal,
          task.start_date,
          task.is_push_notification,
        ]
    )
    const taskId = result.lastInsertRowId

    const scheduleResult = await db.runAsync(
      `INSERT INTO task_schedules (taskId, bitmask_days, time)
        VALUES (?, ?, ?);`,
        [
          taskId,
          schedule.bitmaskDays,
          schedule.time,
        ]
    )
    const taskScheduleId = scheduleResult.lastInsertRowId

    await db.runAsync(
      `INSERT INTO task_logs (task_schedule_id, date, is_completed)
        VALUES (?, ?, ?);`,
        [
          taskScheduleId,
          task.start_date,
          0
        ]
    )

    await db.runAsync(
      `INSERT INTO notifications (taskId)
        VALUES (?);`,
        [taskId]
    )
    
  } catch (error) {
    console.error('タスク追加に失敗', error)
  }

}

export const updateTask = async (db: any, task: Task) => {
  try {
    await db.runAsync(
      `UPDATE tasks
        SET title = ?, goal = ?
        WHERE id = ?;`,
      [
        task.title,
        task.goal,
        task.id,
      ]
    )
  } catch (error) {
    throw error
  }
}

export const deleteTask = async (db: any, id: string) => {
  try {
    await db.runAsync(
      `DELETE FROM tasks WHERE id = ?;`,
      [id]
    )
  } catch (error) {
    throw error
  }
}

const parseSchedule = (schedule: string) => {
  try {
    return JSON.parse(schedule)
  } catch (error) {
    throw error
  }
}
