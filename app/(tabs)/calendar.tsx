import { View, Text, SafeAreaView, FlatList, RefreshControl, Alert, SectionList } from 'react-native'
import React from 'react'
import {Calendar as CalendarComponent, LocaleConfig } from 'react-native-calendars'
import TaskCard from '@/components/TaskCard'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { formattedDate } from '@/lib/utils'
import { useTaskList } from '@/hooks/useTaskList'

LocaleConfig.locales.jp = {
  monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  monthNamesShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  dayNames: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
  dayNamesShort: ['日', '月', '火', '水', '木', '金', '土'],
}
LocaleConfig.defaultLocale = 'jp'

const markedDates = {
  '2025-02-01': { selected: true, selectedColor: '#239a3b' },
  '2025-02-02': { selected: true, selectedColor: '#7bc96f' },
  '2025-02-03': { selected: true, selectedColor: '#c6e48b' },
  '2025-02-04': { selected: true, selectedColor: '#e0e0e0' },
}

const Calendar = () => {
  const { taskList, refreshing, loadTaskList} = useTaskList()

  const sections = [
    {
      title: '今日のトレーニング',
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
            <TaskCard task={item} editMode={false} />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Text className="text-2xl pl-4 pt-4">{title}</Text>
          )}
          ListHeaderComponent={
            <>
              <Text className="text-3xl ml-3">{formattedDate()}</Text>
              <CalendarComponent
                onDayPress={(day) => {
                  console.log("selected day", day)
                }}
                markedDates={markedDates}
              />
            </>
          }
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadTaskList} />}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default Calendar