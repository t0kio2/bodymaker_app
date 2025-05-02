import { Text, SafeAreaView, RefreshControl, SectionList, View } from 'react-native'
import React from 'react'
import { Calendar as CalendarComponent, LocaleConfig } from 'react-native-calendars'
import TaskCard from '@/components/TaskCard'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { formatDateToYYYYMMDD } from '@/lib/utils'
import { useCalendarData } from '@/hooks/useCalendarData'
import { formattedDate } from '@/lib/utils'
import { eventEmitter } from '@/lib/EventEmitter'
import EmptyList from '@/components/EmptyList'
import { useTaskList } from '@/hooks/useTaskList'

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
    uncompletedTask,
    completedTask,
    loadTaskListByDay
  } = useCalendarData()

  const { 
    allTask
  } = useTaskList()

  const displayData = () => {
    if (taskList.length) {
      const displayData = []
      if (uncompletedTask.length) {
        displayData.push({
          title: selectedDate ===  formatDateToYYYYMMDD(new Date()) ? 
          '今日のトレーニング' : `${formattedDate(new Date(selectedDate))}のトレーニング`,
          data: uncompletedTask
        })
      }
      if (completedTask.length) {
        displayData.push({
          title: '完了',
          data: completedTask
        })
      }
      return displayData
    }
    return []
  }

  

  const sections = displayData()

  return (
    <SafeAreaProvider>
      <SafeAreaView className="h-full bg-[#F7F9FC]">
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            editMode={false}
            date={selectedDate}
            onTaskCompleted={() => {
              loadTaskListByDay(selectedDate)
              eventEmitter.emit('taskUpdated')
            }}
          />
        )}
        ListEmptyComponent={() => {
          if (allTask.length) {
            return (
              <View className="py-10 items-center">
                <Text className="text-lg text-[#76828F]">今日はおやすみ〜</Text>
              </View>
            )
          }
          return <EmptyList />
        }}          
        renderSectionHeader={({ section: { title } }) => (
          <Text className="text-2xl pl-4 pt-4 text-[#496279]">{title}</Text> // 少し濃い色に
        )}
        ListHeaderComponent={
          <CalendarComponent
            theme={{
              backgroundColor: '#FFFFFF',
              calendarBackground: '#F7F9FC',
              // selectedDayBackgroundColor: '#FFB6B9', // 選択日背景色（パステルピンクに変更）
              selectedDayTextColor: '#ffffff', // 選択日テキスト色（白色）
              todayTextColor: '#A7D3D8', // 今日の日付の色（パステルブルー）
              dayTextColor: '#333333', // 通常の日付のテキスト色（濃いグレー）
              textDisabledColor: '#C9D1D3', // 無効日付のテキスト色（薄いグレー）
              dotColor: '#A7D3D8', // ドットの色（パステルブルー）
              selectedDotColor: '#FFFFFF', // 選択日ドットの色（白色）
              arrowColor: '#6C8BA7', // 左右の矢印色（青色）
              monthTextColor: '#333333', // 月名の色（濃いグレー）
              indicatorColor: '#6C8BA7', // 月インジケーターの色（青色）
              textDayFontWeight: '400',
              textMonthFontWeight: '600',
              textDayHeaderFontWeight: '500',
              textDayFontSize: 14,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 13,
            }}
            onMonthChange={(month: any) => {
              setCurrentYear(month.year)
              setCurrentMonth(month.month - 1)
            }}
            onDayPress={(day: any) => {
              console.log('selected day', day)
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