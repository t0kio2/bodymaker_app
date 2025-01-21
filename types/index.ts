export interface Item {
  id: string
  title: string
  video: string
  thumbnail: string
  schedule: Schedule
  goal: string
  createdAt: Date
}

export interface Schedule {
  recurring: number[]
  time: string
}

export interface Notification {
  id: string,
  itemId: string
}