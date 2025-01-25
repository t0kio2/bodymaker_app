import { DAY_OF_WEEK } from "@/constants/common"

export const getDaysOfWeek = (dayNumber: number) => {
  if (dayNumber < 0 || dayNumber > 6) {
    throw new Error('Invalid day number. Must be between 0 and 6')
  }
  return DAY_OF_WEEK[dayNumber]
}

export const getDayNumber = (day: string) => {
  const dayNumber = DAY_OF_WEEK.indexOf(day)
  if (dayNumber === -1) {
    throw new Error('Invalid day name')
  }
  return dayNumber
}

export const isEverydayChecked = (days: string[] | number[]) => days.length === DAY_OF_WEEK.length

export const getThumbnailFromVideo = (videoURL: string) => {
  if (!videoURL) return ''
  const videoId = videoURL.split('v=')[1]?.split('&')[0]
  if (!videoId) return ''
  const thumbnailURL = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
  return thumbnailURL
}

export const  getStringId = (id: string | string[]): string | null => {
  if (typeof id === 'string') {
    return id
  }
  if (Array.isArray(id) && id.length > 0) {
    return id[0]
  }
  return null
}