import { Item } from "@/types"

export const getItems = async (db: any, setItems: any) => {
  try {
    await db.withTransactionAsync(async () => {
      const items = await db.getAllAsync(
        `SELECT * FROM items;`
      )
      setItems(items)
      console.log('Items fetched')
    })
  } catch (error) {
    throw error
  }
}

export const insertItem = async (db: any, item: Omit<Item, 'id'>) => {
  console.log('Inserting item:', item)
  console.log('items.title:', item.title)
  try {
    await db.withTransactionAsync(async () => {
      await db.execAsync(
        `INSERT INTO items (title, video, thumbnail, goal, schedule, createdAt)
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
    })
  } catch (error) {
    throw error
  }
}