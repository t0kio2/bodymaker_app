import { useEffect, useState, useCallback } from "react"
import { generateMarkedDatesForMonth } from "@/lib/utils"
import { TaskWithSchedule } from "@/types"
import { useTaskStore } from "./useTaskStore"

/**
 * Calendar data management hook
 * Handles calendar-specific state and operations
 */
export const useCalendarStore = () => {
  const {
    allTasks,
    tasksByDay,
    selectedDate,
    isLoading,
    loadTasksByDay,
    changeSelectedDate
  } = useTaskStore()

  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({})
  const [uncompletedTasks, setUncompletedTasks] = useState<TaskWithSchedule[]>([])
  const [completedTasks, setCompletedTasks] = useState<TaskWithSchedule[]>([])

  /**
   * Update marked dates for the calendar
   */
  const updateMarkedDates = useCallback(() => {
    const newMarkedDates = generateMarkedDatesForMonth(
      allTasks, 
      currentYear, 
      currentMonth, 
      selectedDate
    )
    setMarkedDates(newMarkedDates)
  }, [allTasks, currentYear, currentMonth, selectedDate])

  /**
   * Handle day press on calendar
   */
  const handleDayPress = useCallback((dateStr: string) => {
    changeSelectedDate(dateStr)
  }, [changeSelectedDate])

  useEffect(() => {
    updateMarkedDates()
  }, [updateMarkedDates])

  useEffect(() => {
    const uncompleted = tasksByDay.filter(task => !task.task_log_id)
    const completed = tasksByDay.filter(task => task.task_log_id)

    setUncompletedTasks(uncompleted)
    setCompletedTasks(completed)
  }, [tasksByDay])

  return {
    currentYear,
    currentMonth,
    markedDates,
    selectedDate,
    isLoading,
    uncompletedTasks,
    completedTasks,
    setCurrentYear,
    setCurrentMonth,
    handleDayPress,
    loadTasksByDay,
  }
}
