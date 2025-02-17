// データベース接続ファイル
import * as SQLite from 'expo-sqlite'

export const openDatabaseAsync = async (dbName = 'local_database.db') =>{
  return new Promise((resolve, reject) => {
    try {
      const db = SQLite.openDatabaseAsync(dbName)
      resolve(db)
    } catch (error) {
      reject(error)
    }
  })
}
