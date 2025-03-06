import { Task, Schedule, TaskWithSchedule } from "@/types"

export const getTaskList = async (db: any): Promise<TaskWithSchedule[]> => {
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
        FROM tasks t
        LEFT JOIN task_schedules ts ON t.id = ts.task_id
        ;`
    )
    console.log("tasks: ", tasks)
    return tasks
  } catch (error) {
    throw error
  }
}

export const getTaskListByDay = async (db: any, dayBit: number): Promise<TaskWithSchedule[]> => {
  console.log('dayBit: ', dayBit)
  try {
    const query = `SELECT
      t.id AS id,
      t.title,
      t.goal,
      t.start_date,
      t.is_push_notification,
      t.created_at,
      ts.bitmask_days,
      ts.time
    FROM tasks t
    LEFT JOIN task_schedules ts ON t.id = ts.task_id
    WHERE ts.bitmask_days & ? != 0
    ;`
    const tasks = await db.getAllAsync(query, [dayBit])
    console.log("tasks: ", tasks)
    return tasks

  } catch (error) {
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

    // TODO : task_logsのスキーマをどうするか
    await db.execAsync(`
      INSERT INTO task_logs (
        task_schedule_id, date, is_completed
      )
      VALUES (${scheduleId}, '${task.start_date}', 0);
    `)

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
