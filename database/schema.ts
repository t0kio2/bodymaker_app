// 初期スキーマを適用する
export const applyInitialSchema = async (db: any) => {
  try {
    await db.withTransactionAsync(async () => {
      // items テーブル作成
      const itemsSchema = `
        id INTEGER PRIMARY KEY AUTOINCREMENT,  -- 自動インクリメント ID
        title TEXT NOT NULL,
        video TEXT,
        thumbnail TEXT,
        schedule TEXT NOT NULL, -- recurring time を文字列化した JSON 形式で保存
        goal TEXT,
        createdAt TEXT NOT NULL
      `
      await createTableIfNotExists(db, 'items', itemsSchema)

      // notifications テーブル作成
      const notificationsSchema = `
        id INTEGER PRIMARY KEY AUTOINCREMENT,  -- 自動インクリメント ID
        itemId INTEGER NOT NULL,
        FOREIGN KEY (itemId) REFERENCES items(id) ON DELETE CASCADE 
      `
      await createTableIfNotExists(db, 'notifications', notificationsSchema)
    })

    console.log('初期スキーマの適用が完了しました')
  } catch (error) {
    console.error('初期スキーマの適用に失敗しました:', error)
    throw error
  }
}

const createTableIfNotExists = async (db: any, tableName: string, schema: string) => {
  try {
    const result = await db.getFirstAsync(`SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}';`)
    if (result) {
      console.log(`${tableName} テーブルは既に存在しています`)
      return
    }
    await db.execAsync(`CREATE TABLE IF NOT EXISTS ${tableName} (${schema});`)
    console.log(`${tableName} テーブルを作成しました`)
  } catch (error) {
    console.error(`${tableName} テーブルの作成に失敗しました:`, error)
    throw error
  }
}
