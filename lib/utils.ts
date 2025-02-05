import { DAY_OF_WEEK } from "@/constants/common"
import { Linking } from "react-native"

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

export const getStringId = (id: string | string[]): string | null => {
  if (typeof id === 'string') {
    return id
  }
  if (Array.isArray(id) && id.length > 0) {
    return id[0]
  }
  return null
}

export const formatDate = (dateStr: string | Date) => {
  // ISO形式の日付文字列をDateオブジェクトに変換
  const date = new Date(dateStr);
  // 年、月、日を取得
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0") // 月は0始まりなので+1
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}/${month}/${day}`
}

const openYouTube = (video: string) => {
  if (!video) return
  Linking.openURL(video).catch(err => {
    throw new Error('Failed to open YouTube', err)
  })
}