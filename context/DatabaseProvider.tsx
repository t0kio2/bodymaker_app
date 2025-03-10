import { openDatabaseAsync } from "@/database/db"
import { applyMigrations } from "@/database/migrations"
import { applyInitialSchema } from "@/database/schema"
import { deleteDatabaseAsync } from "expo-sqlite"
import { ReactNode, createContext, useEffect, useState } from "react"

interface DatabaseContextType {
  db: any // expo-sqliteのDatabase型
}

export const DatabaseContext = createContext<DatabaseContextType | null>(null)

// コンテキストを提供するカスタムフック
export const DatabaseProvider = ({ children }: { children: ReactNode }) => {
  const [db, setDb] = useState(null)
  
  useEffect(() => {
    const initDatabase = async () => {
      try {
        const dbInstance = await openDatabaseAsync() as any
        await dbInstance.execAsync(`PRAGMA journal_mode=WAL;`)

        await applyInitialSchema(dbInstance)
        await applyMigrations(dbInstance)

        setDb(dbInstance)

      } catch (error) {
        console.error(error)
        throw new Error('Failed to open database')
      }
    
    }
    const deleteDB = async () => {
      try {
        await deleteDatabaseAsync('local_database.db');
        console.log('Database deleted successfully');
      } catch (error) {
        console.error(error);
      }
    }
    // deleteDB()
    initDatabase()
  }, []) // []を渡すことで初回レンダー時のみ実行される
  
  return (
    <DatabaseContext.Provider value={{ db }}>
      {children}
    </DatabaseContext.Provider>
  )
}