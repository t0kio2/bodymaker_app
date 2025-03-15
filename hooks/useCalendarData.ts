import { useEffect, useState } from "react"
import { useTaskList } from "./useTaskList"
import { generateMarkedDatesForMonth, getDayBit, getLocalDateString } from "@/lib/utils"

export const useCalendarData = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({})
  const [selectedDate, setSelectedDate] = useState(getLocalDateString(new Date()))
  const { taskList, refreshing, loadTaskListByDay} = useTaskList()

  const updateMarkedDates = (selectedDate: string) => {
    const newMarkedDates = generateMarkedDatesForMonth(taskList, currentYear, currentMonth, selectedDate)
    setMarkedDates(newMarkedDates)
  }

  useEffect(() => {
    const tasksForDay = taskList.filter(task => {
      // 各タスクのスケジュールビットマスクと、タップされた日のビットマスクを比較
      const dayBit = getDayBit(new Date(selectedDate))
      return (task.bitmask_days & dayBit) !== 0;
    })
  }, [taskList, selectedDate])

  useEffect(() => {
    updateMarkedDates(selectedDate)
  }, [currentYear, currentMonth, taskList, selectedDate])

  const handleDayPress = (dateStr: string ) => {
    console.log('handleDayPress', dateStr)
    setSelectedDate(dateStr)
    loadTaskListByDay(dateStr)
  }

  return {
    setCurrentYear,
    setCurrentMonth,
    markedDates,
    refreshing,
    handleDayPress,
    selectedDate,
    loadTaskListByDay,
    taskList
  }
}