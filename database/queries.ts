import { Task, Schedule } from "@/types"
import { deleteDatabaseAsync } from "expo-sqlite"

export const getTasks = async (db: any): Promise<Task[]> => {
  try {
    const tasks = await db.getAllAsync(
      `SELECT
        tasks.id AS id,
        tasks.title,
        tasks.goal,
        tasks.start_date,
        tasks.is_push_notification,
        tasks.created_at,

        task_schedules.bitmask_days,
        task_schedules.time

        FROM tasks
        LEFT JOIN task_schedules ON tasks.id = task_schedules.task_id
        ;`
    )
    // tasks.forEach((task: any) => {
    //   task.schedule = parseSchedule(task.schedule)
    // })
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

// TODO
export const addTask = async (db: any, task: any, schedule: any) => {
  try {
    const result = await db.runAsync(
      `INSERT INTO tasks (title, goal, start_date, is_push_notification)
        VALUES (?, ?, ?, ?);`,
        [
          task.title,
          task.goal,
          task.startDate,
          task.isPushNotification,
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
          task.startDate,
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

export const insertTask = async (db: any, task: Omit<Task, 'id'>) => {
  try {
    await db.runAsync(
      `INSERT INTO tasks (title, goal)
        VALUES (?, ?);`,
      [
        task.title,
        task.goal,
      ]
    )
  } catch (error) {
    throw error
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
