import { scheduledNotificationsSchema, taskLogsSchema, taskSchedulesSchema, tasksSchema } from "./ddl"

export const applyInitialSchema = async (db: any) => {
  try {
    await db.execAsync("BEGIN TRANSACTION;")

    await createTableIfNotExists(db, 'tasks', tasksSchema)
    await createTableIfNotExists(db, 'task_schedules', taskSchedulesSchema)
    await createTableIfNotExists(db, 'task_logs', taskLogsSchema)
    await createTableIfNotExists(db, 'notifications', scheduledNotificationsSchema)
    
    db.execAsync('COMMIT;')
    console.log('初期スキーマの適用が完了しました')
    
  } catch (error) {
    console.error('初期スキーマの適用に失敗しました:', error)
    try {
      await db.execAsync('ROLLBACK')
    } catch (rollbackError) {
      console.error('ロールバックに失敗しました:', rollbackError)
    }
    throw error
  }
}

const createTableIfNotExists = async (db: any, tableName: string, schema: string) => {
  try {
    await db.execAsync(`CREATE TABLE IF NOT EXISTS ${tableName} (${schema});`)
    console.log(`${tableName} テーブルを作成しました`)
  } catch (error) {
    console.error(`${tableName} テーブルの作成に失敗しました:`, error)
    throw error
  }
}
