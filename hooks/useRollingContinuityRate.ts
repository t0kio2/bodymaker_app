import { eachDayOfInterval, format, parseISO, subDays } from "date-fns"
import { useDatabase } from "./useDatabase"
import { useEffect, useState } from "react"
import { useTaskList } from "./useTaskList"
import { AggregatedLog, TaskWithSchedule } from "@/types"

export const useRollingContinuityRate = () => {
  // const { db } = useDatabase()
  // const { allTask } = useTaskList()
  const [rateByTask, setRateByTask] = useState<Record<string, number>>({})

  const calculateContinuityRateInLast30Days = async (
    db: any, taskId: string, startDateStr: string, endDateStr: string
  ): Promise<number> => {
    const startDate = parseISO(startDateStr)
    const endDate = parseISO(endDateStr)

    const schedules = await db.getAllAsync(
      `SELECT id, bitmask_days FROM task_schedules WHERE task_id = ?;`,
      [taskId]
    )

    if (!schedules.length) return 0

    const logs = await db.getAllAsync(
      `SELECT date FROM task_logs WHERE task_id = ? AND
      date BETWEEN ? AND ?;`,
      [taskId, startDateStr, endDateStr]
    )
    const completedDates = new Set(logs.map((log: AggregatedLog) => log.date))

    const days = eachDayOfInterval({ start: startDate, end: endDate })

    let expectedCount = 0
    let completedCount = 0
    days.forEach(day => {
      const dayOfWeek = day.getDay()
      schedules.forEach((schedule: any) => {
        if (schedule.bitmask_days & (1 << dayOfWeek)) {
          expectedCount++
          if (completedDates.has(format(day, 'yyyy-MM-dd'))) {
            completedCount++
          }
        }
      })
    })
    
    if (expectedCount === 0) return 0

    const rate = Math.round(completedCount / expectedCount * 100)
    return rate
  }

  const addContinuityRateToTask = async (
    db: any,
    task: TaskWithSchedule
  ): Promise<TaskWithSchedule> => {
      const today = new Date()
      // 今日を含めて過去30日間の日付を取得
      const startDate = format(subDays(today, 29), 'yyyy-MM-dd')
      const endDate = format(today, 'yyyy-MM-dd')

      const continuityRate = await calculateContinuityRateInLast30Days(
        db,
        task.id,
        startDate,
        endDate
      )
      return { ...task, rate: continuityRate }
  }

  // useEffect(() => {
  //   if (!db || !allTask.length) return

  //   const fetchAllRates = async () => {
  //     const rates: Record<string, number> = {}

  //     const today = new Date()
  //     // 今日を含めて過去30日間の日付を取得
  //     const startDate = format(subDays(today, 29), 'yyyy-MM-dd')
  //     const endDate = format(today, 'yyyy-MM-dd')

  //     for (const task of allTask) {
  //       const rate = await calculateContinuityRateInLast30Days(
  //         db, parseInt(task.id), startDate, endDate
  //       )
  //       rates[task.id] = rate
  //     }
  //     setRateByTask(rates)
  //   }
  //   fetchAllRates()
  // }, [db, allTask])
  
  return { rateByTask, addContinuityRateToTask }
}
