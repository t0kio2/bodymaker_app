export interface Item {
  id: string
  title: string
  video: string
  thumbnail: string
  schedule: {
    recurring: number[]
    time: string
  }
  goal: string
  createdAt: Date
}
