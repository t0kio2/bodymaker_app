export const tasksSchema = `
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  goal TEXT,
  start_date TEXT NOT NULL,
  is_push_notification BOOLEAN NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
`

export const taskSchedulesSchema = `
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  taskId INTEGER NOT NULL,
  bitmask_days INTErGER NOT NULL,
  time TEXT NOT NULL,
  FOREIGN KEY (taskId) REFERENCES tasks(id) ON DELETE CASCADE
`

export const taskLogsSchema = `
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  task_schedule_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  is_completed BOOLean NOT NULL DEFAULT 0,
  FOREIGN KEY (task_schedule_id) REFERENCES task_schedules(id) ON DELETE CASCADE
`

export const notificationsSchema = `
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  taskId INTEGER NOT NULL,
  FOREIGN KEY (taskId) REFERENCES tasks(id) ON DELETE CASCADE
`