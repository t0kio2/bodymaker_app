import { Text, SafeAreaView, RefreshControl, SectionList } from 'react-native'
import React, { useEffect, useState } from 'react'
import {Calendar as CalendarComponent, LocaleConfig } from 'react-native-calendars'
import TaskCard from '@/components/TaskCard'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { generateMarkedDatesForMonth, getDayBit, getLocalDateString } from '@/lib/utils'
import { useTaskList } from '@/hooks/useTaskList'
import { TaskWithSchedule } from '@/types'

LocaleConfig.locales.jp = {
  monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  monthNamesShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  dayNames: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
  dayNamesShort: ['日', '月', '火', '水', '木', '金', '土'],
}
LocaleConfig.defaultLocale = 'jp'

const Calendar = () => {
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


  const sections = [
    {
      title: selectedDate ===  getLocalDateString(new Date()) ? 
        '今日のトレーニング' : `${selectedDate}のトレーニング`,
      data: filterTasks
    }
  ]
  
  return (
    <SafeAreaProvider>
      <SafeAreaView className="h-full bg-white">
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TaskCard task={item} editMode={false} />
          )}
          ListEmptyComponent={
            <Text>習慣が登録されていません。登録しましょう！</Text>
          }
          renderSectionHeader={({ section: { title } }) => (
            <Text className="text-2xl pl-4 pt-4">{title}</Text>
          )}
          ListHeaderComponent={
            <CalendarComponent
              onMonthChange={(month) => {
                setCurrentYear(month.year)
                setCurrentMonth(month.month - 1)
              }}
              onDayPress={(day) => {
                handleDayPress(day.dateString)
              }}
              markedDates={markedDates}
              enableSwipeMonths
            />
          }
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadTaskList} />}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default Calendar