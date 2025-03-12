export interface Task {
  id: string,
  title: string
  goal: string
  start_date: Date
  is_push_notification: boolean
  created_at?: Date
}

export interface Schedule {
  bitmask_days: number
  time: string
}

export interface TaskLog {
  task_log_id: string,
  task_schedule_id: string
  date: Date
  is_completed: boolean
}

export interface TaskWithSchedule extends Task, Schedule, TaskLog {}
export interface Notification {
  id: string,
  taskId: string
}