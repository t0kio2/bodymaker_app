import { useEffect, useState } from "react"
import { useTaskList } from "./useTaskList"
import { generateMarkedDatesForMonth, formatDateToYYYYMMDD } from "@/lib/utils"
import { TaskWithSchedule } from "@/types"

export const useCalendarData = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({})
  const [selectedDate, setSelectedDate] = useState<string>(formatDateToYYYYMMDD(new Date()))
  const { taskList, allTask, refreshing, loadTaskListByDay} = useTaskList()

  const [uncompletedTask, setUncompletedTask] = useState<TaskWithSchedule[]>([])
  const [completedTask, setCompletedTask] = useState<TaskWithSchedule[]>([])

  const updateMarkedDates = (selectedDate: string) => {
    const newMarkedDates = generateMarkedDatesForMonth(allTask, currentYear, currentMonth, selectedDate)
    setMarkedDates(newMarkedDates)
  }

  useEffect(() => {
    updateMarkedDates(selectedDate)
  }, [currentYear, currentMonth, allTask, selectedDate])

  useEffect(() => {
    const uncompleted = taskList.filter(task => !task.task_log_id)
    const completed = taskList.filter(task => task.task_log_id)

    setUncompletedTask(uncompleted)
    setCompletedTask(completed)
  }, [taskList])

  const handleDayPress = (dateStr: string ) => {
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
    taskList,
    uncompletedTask,
    completedTask,
  }
}