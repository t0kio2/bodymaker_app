import { DAY_OF_WEEK_BIT } from "@/constants/common"
import { TaskWithSchedule, YYYYMMDD } from "@/types"
import { Linking } from "react-native"

export const isDaySelected = (bitmask: number, day: number) => {
  return (bitmask & day) !== 0 // ANDで判定
}

export const toggleDays = (selectedDays: number, day: number) => {
  return selectedDays ^ day // XORでトグル
}

/**
 * 指定した日付から、曜日に対応するビットマスクを算出する関数
 * 例:
 *   日曜日 → 1 (1 << 0)
 *   月曜日 → 2 (1 << 1)
 *   ...
 *   金曜日 → 32 (1 << 5)
 *   土曜日 → 64 (1 << 6)
 *
 * @param date 対象の日付
 * @returns 曜日を表すビットマスク
 */
export const getDayBit = (date: Date): number => {
  return 1 << date.getDay()
}

export const generateMarkedDatesForMonth = (
  taskList: TaskWithSchedule[],
  year: number,
  month: number,
  selectedDay: string
): Record<string, { selected: boolean, selectedColor?: string }> => {
  const marked: Record<string, { marked: boolean, selected: boolean, selectedColor?: string }> = {}

  // 対象月の初日と最終日を取得
  const start = new Date(year, month, 1)
  const end = new Date(year, month + 1, 0)

  // 月初から月末までの日付をループ
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    // Date.getDay() は 0 (Sunday) ～ 6 (Saturday) を返す
    const dayBit = 1 << d.getDay()
    const dateStr = formatDateToYYYYMMDD(d)
    const hasTask = taskList.some(task => (task.bitmask_days & dayBit) !== 0)

    marked[dateStr] = { 
      marked: hasTask, // タスクがある日付
      selected: dateStr === selectedDay, // タップで選択された日付
      selectedColor: "#239a3b"
    }
  }
  return marked
}

// 'HH:mm'形式をDateオブジェクトに変換
export const timeToDate = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number)
  const date = new Date()
  date.setHours(hours)
  date.setMinutes(minutes)
  return date
}

// 現在時刻を'HH:mm'形式で取得
export const getCurrentTimeStr = () => {
  const date = new Date()
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

// M月D日 (ddd)
export const formattedDate = (date: Date) => {
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekdays = ['日', '月', '火', '水', '木', '金', '土']
  const weekday = weekdays[date.getDay()] // 曜日
  return `${month}月${day}日 (${weekday})`
}

// ビットマスクから曜日を取得
export const getSelectedDays = (bitmask: number) => {
  return Object.entries(DAY_OF_WEEK_BIT.ja)
    .filter(([_, day]) => bitmask & day)
    .map(([label]) => label)
}

// すべての曜日が選択されているか
export const isEverydayChecked = (bitmask: number) => {
  return bitmask === allDaysMask
}

export const allDaysMask = Object.values(DAY_OF_WEEK_BIT.ja).reduce((acc, bit) => acc | bit, 0)

export const getStringId = (id: string | string[]): string | null => {
  if (typeof id === 'string') {
    return id
  }
  if (Array.isArray(id) && id.length > 0) {
    return id[0]
  }
  return null
}

export const formatDate = (dateStr: undefined | Date) => {
  if (!dateStr) return ''
  // ISO形式の日付文字列をDateオブジェクトに変換
  const date = new Date(dateStr);
  // 年、月、日を取得
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0") // 月は0始まりなので+1
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}/${month}/${day}`
}

export const formatDateToYYYYMMDD = (dateStr: undefined | Date): YYYYMMDD => {
  if (!dateStr) return '' as YYYYMMDD
  // ISO形式の日付文字列をDateオブジェクトに変換
  const date = new Date(dateStr)
  // 年、月、日を取得
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0") // 月は0始まりなので+1
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}` as YYYYMMDD
}

const openYouTube = (video: string) => {
  if (!video) return
  Linking.openURL(video).catch(err => {
    throw new Error('Failed to open YouTube', err)
  })
}

const getThumbnailFromVideo = (videoURL: string) => {
  if (!videoURL) return ''
  const videoId = videoURL.split('v=')[1]?.split('&')[0]
  if (!videoId) return ''
  const thumbnailURL = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
  return thumbnailURL
}