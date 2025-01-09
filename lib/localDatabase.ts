import * as SQLite from 'expo-sqlite'

export const localDatabase = () => {

}

export const insertData = async () => {
  try {
    const db = await SQLite.openDatabaseAsync('test.db')
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS test (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        value TEXT
      );
      INSERT INTO test (value) VALUES ('test1');
      INSERT INTO test (value) VALUES ('test2');
      INSERT INTO test (value) VALUES ('test3');
    `)
    const rows = await db.getAllAsync('SELECT * FROM test')
    console.log(rows)
  } catch (error) {
    console.error(error)
    throw new Error('Failed to insert data')
  } 
}