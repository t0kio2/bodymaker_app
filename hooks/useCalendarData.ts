import { useEffect, useState } from "react"
import { useTaskList } from "./useTaskList"
import { generateMarkedDatesForMonth, getDayBit, getLocalDateString } from "@/lib/utils"
import { TaskWithSchedule } from "@/types"

export const useCalendarData = () => {
  const { taskList, refreshing, loadTaskList} = useTaskList()
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({})

  const [selectedDate, setSelectedDate] = useState(getLocalDateString(new Date()))
  const [filterTasks, setFilterTasks] = useState<TaskWithSchedule[]>([])

  const updateMarkedDates = () => {
    const today = getLocalDateString(new Date())
    const newMarkedDates = generateMarkedDatesForMonth(taskList, currentYear, currentMonth, today)
    setMarkedDates(newMarkedDates)
  }

  const filterTasksByDate = (taskList: TaskWithSchedule[], date: Date) => {
    const dayBit = getDayBit(date)
    const tasksForDay = taskList.filter(task => (task.bitmask_days & dayBit) !== 0)
    return tasksForDay
  }

  useEffect(() => {
    const tasksForDay = taskList.filter(task => {
      // 各タスクのスケジュールビットマスクと、タップされた日のビットマスクを比較
      const dayBit = getDayBit(new Date(selectedDate))
      return (task.bitmask_days & dayBit) !== 0;
    })
    setFilterTasks(tasksForDay)
  }, [taskList, selectedDate])

  useEffect(() => {
    updateMarkedDates()
  }, [currentYear, currentMonth, taskList, selectedDate])

  const handleDayPress = (dateStr: string ) => {
    setSelectedDate(dateStr)
    const tasksForDay = filterTasksByDate(taskList, new Date(dateStr))
    setFilterTasks(tasksForDay)
  }

  return {
    setCurrentYear,
    setCurrentMonth,
    markedDates,
    refreshing,
    loadTaskList,
    handleDayPress,
    filterTasks,
    selectedDate
  }
}