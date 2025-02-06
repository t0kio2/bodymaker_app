import { Task, Schedule } from "@/types"

export const getTasks = async (db: any): Promise<Task[]> => {
  try {
    const tasks = await db.getAllAsync(
      `SELECT * FROM tasks;`
    )
    tasks.forEach((task: any) => {
      task.schedule = parseSchedule(task.schedule)
    })
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
    task.schedule = parseSchedule(task.schedule)
    return task
  } catch (error) {
    throw error
  }
}

export const insertTask = async (db: any, task: Omit<Task, 'id'>) => {
  try {
    await db.runAsync(
      `INSERT INTO tasks (title, video, thumbnail, schedule, goal, createdAt)
      VALUES (?, ?, ?, ?, ?, ?);`,
      [
        task.title,
        task.video,
        task.thumbnail,
        JSON.stringify(task.schedule),
        task.goal,
        task.createdAt.toISOString(),
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
      SET title = ?, video = ?, thumbnail = ?, schedule = ?, goal = ?
      WHERE id = ?;`,
      [
        task.title,
        task.video,
        task.thumbnail,
        JSON.stringify(task.schedule),
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