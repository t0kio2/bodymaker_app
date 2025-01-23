import { Item, Schedule } from "@/types"

export const getItems = async (db: any): Promise<Item[]> => {
  try {
    const items = await db.getAllAsync(
      `SELECT * FROM items;`
    )
    items.forEach((item: any) => {
      item.schedule = parseSchedule(item.schedule)
    })
    return items
  } catch (error) {
    throw error
  }
}

export const getItemById = async (db: any, id: string): Promise<Item | null> => { 
  try {
    const item = await db.getFirstAsync(
      `SELECT * FROM items WHERE id = ?;`,
      [id]
    )
    if (!item) return null
    item.schedule = parseSchedule(item.schedule)
    return item
  } catch (error) {
    throw error
  }
}

export const insertItem = async (db: any, item: Omit<Item, 'id'>) => {
  try {
    await db.runAsync(
      `INSERT INTO items (title, video, thumbnail, schedule, goal, createdAt)
      VALUES (?, ?, ?, ?, ?, ?);`,
      [
        item.title,
        item.video,
        item.thumbnail,
        JSON.stringify(item.schedule),
        item.goal,
        item.createdAt.toISOString(),
      ]
    )
  } catch (error) {
    throw error
  }
}

export const updateItem = async (db: any, item: Item) => {
  try {
    await db.runAsync(
      `UPDATE items
      SET title = ?, video = ?, thumbnail = ?, schedule = ?, goal = ?
      WHERE id = ?;`,
      [
        item.title,
        item.video,
        item.thumbnail,
        JSON.stringify(item.schedule),
        item.goal,
        item.id,
      ]
    )
  } catch (error) {
    throw error
  }
}

export const deleteItem = async (db: any, id: string) => {
  try {
    await db.runAsync(
      `DELETE FROM items WHERE id = ?;`,
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