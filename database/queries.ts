import { Item } from "@/types"

export const getItems = async (db: any, setItems: any) => {
  try {
    await db.withTransactionAsync(async () => {
      const items = await db.getAllAsync(
        `SELECT * FROM items;`
      )
      console.log('items:', items)
      setItems(items)
      console.log('Items fetched')
    })
  } catch (error) {
    throw error
  }
}

export const insertItem = async (db: any, item: Omit<Item, 'id'>) => {
  try {
    await db.execAsync('BEGIN;')
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
    db.execAsync('COMMIT;')
  } catch (error) {
    throw error
  }
}