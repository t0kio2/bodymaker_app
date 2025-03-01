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

export interface TaskWithSchedule extends Task, Schedule {}
export interface Notification {
  id: string,
  taskId: string
}