import { Text, SafeAreaView, RefreshControl, SectionList } from 'react-native'
import React from 'react'
import {Calendar as CalendarComponent, LocaleConfig } from 'react-native-calendars'
import TaskCard from '@/components/TaskCard'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { getLocalDateString } from '@/lib/utils'
import { useCalendarData } from '@/hooks/useCalendarData'

LocaleConfig.locales.jp = {
  monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  monthNamesShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  dayNames: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
  dayNamesShort: ['日', '月', '火', '水', '木', '金', '土'],
}
LocaleConfig.defaultLocale = 'jp'

const Calendar = () => {
  const {
    refreshing,
    setCurrentYear,
    setCurrentMonth,
    markedDates,
    selectedDate,
    handleDayPress,
    taskList,
    loadTaskListByDay
  } = useCalendarData()

  const sections = [
    {
      title: selectedDate ===  getLocalDateString(new Date()) ? 
        '今日のトレーニング' : `${selectedDate}のトレーニング`,
      data: taskList
    }
  ]
  
  return (
    <SafeAreaProvider>
      <SafeAreaView className="h-full bg-white">
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TaskCard task={item} editMode={false} date={selectedDate} />
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
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadTaskListByDay} />}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default Calendar