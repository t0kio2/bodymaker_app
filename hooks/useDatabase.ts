// データベース初期化処理をまとめたカスタムフック

import { openDatabaseAsync } from "@/database/db"
import { applyMigrations } from "@/database/migrations"
import { applyInitialSchema } from "@/database/schema"
import { deleteDatabaseAsync } from "expo-sqlite"
import { useEffect } from "react"

export const useDatabase = () => {
  console.log('useDatabase hook called')
  useEffect(() => {
    const initDatabase = async () => {
      try {
        const db = await openDatabaseAsync()
        await applyInitialSchema(db)
        // マイグレーション適用
        await applyMigrations(db)
      } catch (error) {
        console.error(error)
        throw new Error('Failed to open database')
      }
    }
    initDatabase()
  }, []) // []を渡すことで初回レンダー時のみ実行される
}