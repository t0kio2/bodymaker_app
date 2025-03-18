import { getDayBit } from "@/lib/utils"
import { Task, Schedule, TaskWithSchedule } from "@/types"

export const getTaskListByDay = async (
    db: any,
    dateStr: string
  ): Promise<TaskWithSchedule[]> => {
    const dayBit = getDayBit(new Date(dateStr))
  try {
    const query = `SELECT
      t.id AS id,
      ts.id AS task_schedule_id,
      MIN(tl.id) AS log_id,
      t.title,
      t.goal,
      t.start_date,
      t.is_push_notification,
      t.created_at,
      ts.bitmask_days,
      ts.time,
      COALESCE(tl.is_completed, 0) AS is_completed
    FROM tasks t
    LEFT JOIN task_schedules ts
      ON t.id = ts.task_id
    LEFT JOIN task_logs tl
      ON ts.id = tl.task_schedule_id AND tl.date = ?
    WHERE ts.bitmask_days & ? != 0
    GROUP BY t.id, ts.id
    ;`
    const taskLogsQuery = `SELECT * FROM task_logs;`
    const taskLogs = await db.getAllAsync(taskLogsQuery)
    console.log('taskLogs', taskLogs)

    const tasks = await db.getAllAsync(query, [dateStr, dayBit])
    return tasks
  } catch (error) {
    throw error
  }
}

export const getAllTask = async (
    db: any,
  ): Promise<TaskWithSchedule[]> => {
  try {
    const query = `SELECT
      t.id AS id,
      ts.id AS task_schedule_id,
      t.title,
      t.goal,
      t.start_date,
      t.is_push_notification,
      t.created_at,
      ts.bitmask_days,
      ts.time
    FROM tasks t
    LEFT JOIN task_schedules ts ON t.id = ts.task_id;`
    const tasks = await db.getAllAsync(query)
    return tasks
  } catch (error) {
    throw error
  }
}

export const completeTask = async (
  db: any,
  taskId: string,
  taskScheduleId: string,
  date: string
): Promise<boolean> => {
  try {
    const existingLog = await db.getFirstAsync(
      `SELECT id FROM task_logs WHERE task_schedule_id = ? AND date = ?;`,
      [taskScheduleId, date]
    )
    
    if (existingLog) {
      await db.runAsync(
        `UPDATE task_logs SET is_completed = 1 WHERE id = ?;`,
        [existingLog.id]
      )
      await db.runAsync(
        `INSERT INTO task_logs (task_id, task_schedule_id, date, is_completed) VALUES (?, ?, ?, 1);`,
        [taskId, taskScheduleId, date]
      )
    } else {
      await db.runAsync(
        `INSERT INTO task_logs (task_schedule_id, date, is_completed) VALUES (?, ?, 1);`,
        [taskScheduleId, date]
      )
    }
    return true
  } catch (error) {
    console.error("completeTaskForDate error:", error);
    throw error
  }
}

export const getTaskById = async (db: any, id: string): Promise<TaskWithSchedule | null> => { 
  try {
    const task = await db.getFirstAsync(
      `SELECT
          t.id, 
          t.title, 
          t.goal, 
          t.start_date, 
          t.is_push_notification, 
          t.created_at, 
          ts.bitmask_days, 
          ts.time
        FROM tasks t
        LEFT JOIN task_schedules ts ON t.id = ts.task_id
        WHERE t.id = ?;`,
      [id]
    )
    if (!task) return null

    return task
  } catch (error) {
    throw error
  }
}

export const insertTask = async (db: any, task: Omit<Task, 'id'>, schedule: Schedule) => {
  try {
    await db.execAsync(`
    INSERT INTO tasks (
      title, goal, start_date, is_push_notification
    )
    VALUES ('${task.title}', '${task.goal}', '${task.start_date}', ${task.is_push_notification});
  `)
    const taskIdResult = await db.getFirstAsync(`SELECT last_insert_rowid() as id;`)
    const taskId = taskIdResult?.id
    
    if (!taskId) throw new Error('タスクID取得に失敗しました')

    await db.execAsync(`
      INSERT INTO task_schedules (
        task_id, bitmask_days, time
      )
      VALUES (${taskId}, ${schedule.bitmask_days}, '${schedule.time}');
    `);
    const scheduleIdResult = await db.getFirstAsync(`SELECT last_insert_rowid() as id;`)
    const scheduleId = scheduleIdResult?.id

    if (!scheduleId) throw new Error('スケジュールID取得に失敗しました')

    // notificationsのスキーマをどうするか
    await db.execAsync(`
      INSERT INTO notifications (
        task_id
      )
      VALUES (${taskId});
    `)

    console.log('タスク追加に成功')
    return taskId
    
  } catch (error) {
    console.error('タスク追加に失敗', error)
  }
}

export const updateTask = async (db: any, task: Task, schedule: Schedule) => {
  try {
    await db.execAsync(`
      UPDATE tasks
      SET title = '${task.title}',
          goal = '${task.goal}',
          start_date = '${task.start_date}',
          is_push_notification = ${task.is_push_notification}
      WHERE id = ${task.id};
    `)

    await db.execAsync(`
      UPDATE task_schedules
      SET bitmask_days = ${schedule.bitmask_days},
          time = '${schedule.time}'
      WHERE task_id = ${task.id};
    `)

    console.log('タスク更新に成功')
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
