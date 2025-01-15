// 初期スキーマを適用する
export const applyInitialSchema = async (db: any) => {
  try {
    await db.withTransactionAsync(async () => {
      /*
        txn.runAsync(
          SQL文,
          パラメータ
        )
      */
      // items テーブル作成
      try {
        await db.execAsync(
          `CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,  -- 自動インクリメント ID
            title TEXT NOT NULL,
            video TEXT,
            thumbnail TEXT,
            schedule TEXT NOT NULL, -- recurring time を文字列化した JSON 形式で保存
            goal TEXT,
            createdAt TEXT NOT NULL
          );`
        );
        console.log('items テーブルを作成しました')
      } catch (error) {
        console.error('items テーブルの作成に失敗しました:', error)
        throw error
      }
      

      // notifications テーブル作成
      try {
        await db.execAsync(
          `CREATE TABLE IF NOT EXISTS notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,  -- 自動インクリメント ID
            itemId INTEGER NOT NULL,
            FOREIGN KEY (itemId) REFERENCES items(id) ON DELETE CASCADE
          );`
        )
        console.log('notifications テーブルを作成しました')
      } catch (error) {
        console.error('notifications テーブルの作成に失敗しました:', error)
        throw error
      }
    })

    console.log('初期スキーマの適用が完了しました')
  } catch (error) {
    console.error('初期スキーマの適用に失敗しました:', error)
    throw error
  }
};
