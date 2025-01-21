import { Item, Schedule } from "@/types"

export const getItems = async (db: any): Promise<Item[]> => {
  try {
    const items = await db.getAllAsync(
      `SELECT * FROM items;`
    )
    items.forEach((item: any) => {
      item.schedule = parseSchedule(item.schedule)
    })
    console.log('getItems ** items:', items)
    return items
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
        item.title || 'No title',
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

const parseSchedule = (schedule: string) => {
  try {
    return JSON.parse(schedule)
  } catch (error) {
    throw error
  }
}