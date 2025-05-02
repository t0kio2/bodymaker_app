export const tasksSchema = `
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  goal TEXT,
  start_date TEXT NOT NULL,
  is_push_notification BOOLEAN NOT NULL DEFAULT 1,
  notification_offset INTEGER NOT NULL DEFAULT 60,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
`

export const taskSchedulesSchema = `
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  task_id INTEGER NOT NULL,
  bitmask_days INTErGER NOT NULL,
  time TEXT NOT NULL,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
`

// タスク完了時のみ記録
export const taskLogsSchema = `
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  task_id INTEGER NOT NULL,
  task_schedule_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  FOREIGN KEY (task_schedule_id) REFERENCES task_schedules(id) ON DELETE CASCADE
`

export const scheduledNotificationsSchema = `
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  task_id INTEGER NOT NULL,
  task_schedule_id INTEGER NOT NULL,
  notification_id TEXT NOT NULL UNIQUE,
  scheduled_weekday INTEGER NOT NULL,
  scheduled_hour INTEGER NOT NULL,
  scheduled_minute INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (task_schedule_id) REFERENCES task_schedules(id) ON DELETE CASCADE
`
