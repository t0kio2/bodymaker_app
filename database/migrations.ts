// データベースのマイグレーションを管理
const SCHEMA_VERSION = 1

export const applyMigrations = async (db: any) => {
  try {
    // スキーマバージョンを保持するテーブルを作成
    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS meta (
        key TEXT PRIMARY KEY,
        value INTEGER
      );`
    )

    // 現在のスキーマバージョンを取得
    const result = await db.getFirstAsync(
      `SELECT value FROM meta WHERE key = 'schema_version';`
    )
    const currentVersion = result ? result.value : 0;

    console.log(`Current schema version: ${currentVersion}`)

    // 必要なマイグレーションを実行
    await performMigrations(db, currentVersion)

    // スキーマバージョンを更新
    await db.execAsync(
      `INSERT OR REPLACE INTO meta (key, value) VALUES ('schema_version', ?);`,
      [SCHEMA_VERSION]
    )
    console.log('Migrations applied successfully')
  } catch (error) {
    console.error('Error applying migrations:', error)
    throw error;
  }
};


const performMigrations = async (db: any, currentVersion: number) => {
  if (currentVersion < 1) {
    console.log('No initial migrations needed')
    return
  }
  /*
    新規テーブル追加等、バージョンアップに伴うマイグレーションを追加
  */

  if (currentVersion < 2) {
  }
}
