// データベース初期化処理をまとめたカスタムフック

import { openDatabaseAsync } from "@/database/db"
import { applyMigrations } from "@/database/migrations"
import { applyInitialSchema } from "@/database/schema"
import { deleteDatabaseAsync } from "expo-sqlite"
import { useEffect } from "react"

export const useDatabase = () => {
  useEffect(() => {
    const deleteDB = async () => {
      try {
        // await deleteDatabaseAsync('local_database.db');
        console.log('Database deleted successfully');
      } catch (error) {
        console.error(error);
      }
    }
    const initDatabase = async () => {
      try {
        const db = await openDatabaseAsync() as any
        console.log('トランザクション状態: ', db.isInTransactionSync())

        await db.execAsync(`
          PRAGMA journal_mode=WAL;
        `)
        console.log('トランザクション状態: ', db.isInTransactionSync())
        
        await applyInitialSchema(db)
        // マイグレーション適用
        await applyMigrations(db)
      } catch (error) {
        console.error(error)
        throw new Error('Failed to open database')
      }
    }
    deleteDB()
    initDatabase()
  }, []) // []を渡すことで初回レンダー時のみ実行される
}