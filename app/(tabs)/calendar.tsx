import { Text, SafeAreaView, RefreshControl, SectionList } from 'react-native'
import React from 'react'
import {Calendar as CalendarComponent, LocaleConfig } from 'react-native-calendars'
import TaskCard from '@/components/TaskCard'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { generateMarkedDatesForMonth, getDayBit } from '@/lib/utils'
import { useTaskList } from '@/hooks/useTaskList'
import { DAY_OF_WEEK_BIT } from '@/constants/common'

LocaleConfig.locales.jp = {
  monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  monthNamesShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  dayNames: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
  dayNamesShort: ['日', '月', '火', '水', '木', '金', '土'],
}
LocaleConfig.defaultLocale = 'jp'


const Calendar = () => {
  const { taskList, refreshing, loadTaskList} = useTaskList()

  // 例: 月、水、金がスケジュールされた場合
  const scheduleBitmask = DAY_OF_WEEK_BIT.en.Monday
  const markedDates = generateMarkedDatesForMonth(taskList, 2025, 2); // 2025年3月（monthは0始まり）
  console.log('markedDates: ', markedDates)

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
          ListEmptyComponent={
            <Text>習慣が登録されていません。登録しましょう！</Text>
          }
          renderSectionHeader={({ section: { title } }) => (
            <Text className="text-2xl pl-4 pt-4">{title}</Text>
          )}
          ListHeaderComponent={
            <>
              {/* <Text className="text-3xl ml-3">{formattedDate()}</Text> */}
              <CalendarComponent
                onMonthChange={(month) => {

                }}
                onDayPress={(day) => {
                  console.log("selected day", day)
                }}
                markedDates={markedDates}
                enableSwipeMonths
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