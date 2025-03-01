import { timeToDate } from "@/lib/utils"
import { useEffect, useState } from "react"
import { Platform } from "react-native"

export const useTimePicker = (initialTimeStr: string) => {
  // iOSは最初からTimePickerを表示する
  // Androidは非表示で開始する
  const [timePickerVisible, setTimePickerVisible] = useState<boolean>(Platform.OS === 'ios')
  const [selectedTime, setSelectedTime] = useState<Date>(timeToDate(initialTimeStr || '00:00'))

  useEffect(() => {
    setSelectedTime(timeToDate(initialTimeStr))
  }, [initialTimeStr])

  const onTimeChange = (
    event: any,
    selectedDate: Date | undefined,
    handleTimeChange: (time: string) => void
  ) => {
    if (!selectedDate) return
    setSelectedTime(selectedDate)
    const hours = selectedDate.getHours().toString().padStart(2, '0')
    const minutes = selectedDate.getMinutes().toString().padStart(2, '0')
    const formattedTime = `${hours}:${minutes}`
    handleTimeChange(formattedTime)
    // Androidの場合は選択後にTimePickerを非表示にする
    setTimePickerVisible(Platform.OS === 'ios')
  }

  const showTimePicker = () => setTimePickerVisible(true)

  return {
    timePickerVisible,
    selectedTime,
    onTimeChange,
    showTimePicker,
    setTimePickerVisible
  }
}