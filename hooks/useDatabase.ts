// データベース初期化処理をまとめたカスタムフック

import { openDatabaseAsync } from "@/database/db"
import { applyMigrations } from "@/database/migrations"
import { applyInitialSchema } from "@/database/schema"
import { deleteDatabaseAsync } from "expo-sqlite"
import { useEffect } from "react"

export const useDatabase = () => {
  console.log('useDatabase hook called')
  useEffect(() => {
    // // for test
    // const listTables = async () => {
    //   try {
    //     const db = await openDatabaseAsync() as any
    //     const tables = await db.getAllAsync(
    //       `SELECT name FROM sqlite_master WHERE type='table';`
    //     )
    //     console.log('Tables:', tables)
    //   } catch (error) {
    //     console.error(error)
    //   }
    // }
    // // for test
    // const deleteDB = async () => {
    //   try {
    //     await deleteDatabaseAsync('local_database.db');
    //     console.log('Database deleted successfully');
    //   } catch (error) {
    //     console.error(error);
    //   }
    // }

    const initDatabase = async () => {
      console.log('Initializing database')
      try {
        const db = await openDatabaseAsync()
        await applyInitialSchema(db)
        // マイグレーション適用
        await applyMigrations(db)
        console.log('Database initialized')
      } catch (error) {
        console.error(error)
        throw new Error('Failed to open database')
      }
    }
    // deleteDB()
    // listTables()
    initDatabase()
  }, []) // []を渡すことで初回レンダー時のみ実行される
}