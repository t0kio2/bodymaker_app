import { Task, Schedule, TaskWithSchedule } from "@/types"
import { deleteDatabaseAsync } from "expo-sqlite"

export const getTasks = async (db: any): Promise<TaskWithSchedule[]> => {
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

export const insertTask = async (db: any, task: Omit<Task, 'id'>, schedule: Schedule) => {
  try {
    await db.execAsync(`
    INSERT INTO tasks (title, goal, start_date, is_push_notification)
    VALUES ('${task.title}', '${task.goal}', '${task.start_date}', ${task.is_push_notification});
  `)
    const taskIdResult = await db.getFirstAsync(`SELECT last_insert_rowid() as id;`)
    const taskId = taskIdResult?.id
    
    if (!taskId) throw new Error('タスクID取得に失敗しました')

    await db.execAsync(`
      INSERT INTO task_schedules (task_id, bitmask_days, time)
      VALUES (${taskId}, ${schedule.bitmask_days}, '${schedule.time}');
    `);
    const scheduleIdResult = await db.getFirstAsync(`SELECT last_insert_rowid() as id;`)
    const scheduleId = scheduleIdResult?.id

    if (!scheduleId) throw new Error('スケジュールID取得に失敗しました')

    // TODO : task_logsのスキーマをどうするか
    await db.execAsync(`
      INSERT INTO task_logs (task_schedule_id, date, is_completed)
      VALUES (${scheduleId}, '${task.start_date}', 0);
    `)

    // notificationsのスキーマをどうするか
    await db.execAsync(`
      INSERT INTO notifications (task_id)
      VALUES (${taskId});
    `)

    console.log('タスク追加に成功')
    return taskId
    
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
