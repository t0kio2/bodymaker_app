export interface Task {
  id: string,
  user_id? : number | null
  title: string
  goal: string
  createdAt?: Date
}

export interface Schedule {
  recurring: number[]
  time: string
}

export interface Notification {
  id: string,
  taskId: string
}