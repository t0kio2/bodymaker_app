import { useState } from "react"

export const useSchedule = () => {
  const [selectedDays, setSelectedDays] = useState(0)

  // 曜日のトグル
  const toggleDays = (day: number) => {
    // XORでトグル
    setSelectedDays(prev => prev ^ day)
  }

  const isDaySelected = (day: number) => {
    return (selectedDays & day) !== 0
  }

  return {
    selectedDays,
    toggleDays,
    isDaySelected
  }
}