export interface Task {
  id: string,
  title: string
  goal: string
  start_date: YYYYMMDD|string
  is_push_notification: boolean
  created_at?: Date
}

export interface Schedule {
  bitmask_days: number
  time: string
}

export interface TaskLog {
  task_log_id?: string,
  task_schedule_id?: string
  date?: YYYYMMDD|string
  is_completed?: boolean
}

export interface TaskWithSchedule extends Task, Schedule, TaskLog {}
export interface Notification {
  id: string,
  taskId: string
}

// YYYY-MM-DD形式の文字列型を定義
type Month = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11' | '12'
type Day =
  | '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09'
  | '10' | '11' | '12' | '13' | '14' | '15' | '16' | '17' | '18' | '19'
  | '20' | '21' | '22' | '23' | '24' | '25' | '26' | '27' | '28' | '29'
  | '30' | '31'
export type YYYYMMDD = `${string}-${Month}-${Day}`
