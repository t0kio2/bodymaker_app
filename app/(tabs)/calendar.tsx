import { View, Text, SafeAreaView, FlatList, TouchableOpacity, RefreshControl, Alert, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Modal from 'react-native-modal'
import {Calendar as CalendarComponent, LocaleConfig } from 'react-native-calendars'
import { Task } from '@/types'
import { router, useLocalSearchParams } from 'expo-router'
import { deleteNotificationById } from '@/lib/pushNotification'
import { openDatabaseAsync } from '@/database/db'
import { deleteTask, getTasks } from '@/database/queries'
import TaskCard from '@/components/TaskCard'
import { SafeAreaProvider } from 'react-native-safe-area-context'

LocaleConfig.locales.jp = {
  monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  monthNamesShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  dayNames: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
  dayNamesShort: ['日', '月', '火', '水', '木', '金', '土'],
}
LocaleConfig.defaultLocale = 'jp'

const markedDates = {
  '2025-01-01': { selected: true, selectedColor: '#239a3b' },
  '2025-01-02': { selected: true, selectedColor: '#7bc96f' },
  '2025-01-03': { selected: true, selectedColor: '#c6e48b' },
  '2025-01-04': { selected: true, selectedColor: '#e0e0e0' },
}


const Calendar = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [taskOnModal, setTaskOnModal] = useState<Task | null>(null)

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [iconPosition, setIconPosition] = useState({ x: 0, y: 0 })

  const params = useLocalSearchParams()
  
  useEffect(() => {
    loadData()
  }, [params?.updated])

  const loadData = async () => {
    try {
      const db = await openDatabaseAsync()
      const tasks = await getTasks(db)
      if (tasks !== null) {
        setTasks(tasks)
      }
    } catch (error) {
      console.error(error)
      throw new Error('Failed to load data')
    }
  }
  const handleEdit = () => {
    setIsModalVisible(false)
    router.push(`/edit?id=${taskOnModal?.id}`)
  }
  const handleDelete = async () => {
    if (!taskOnModal) return
    Alert.alert(
      taskOnModal.title, // タイトル
      '削除してもよろしいですか？', // メッセージ
      [ // ボタン
        {
          text: 'キャンセル',
          style: 'cancel',
          onPress: () => setIsModalVisible(false)
        },
        {
          text: 'OK',
          onPress: async () => {
            setIsModalVisible(false)
            deleteNotificationById(taskOnModal.id)
            const updatedTasks = tasks.filter((task: any) => task.id !== taskOnModal.id)
            try {
              const db = await openDatabaseAsync()
              await deleteTask(db, taskOnModal.id)
              setTasks(updatedTasks)
              Alert.alert('削除しました')
            } catch (error) {
              throw new Error('Failed to delete task')
            } finally {
              setIsModalVisible(false)
            }
          }
        }
      ]
    )
  }
  return (
    <SafeAreaProvider>
      <SafeAreaView className='h-full'>
        <CalendarComponent
          onDayPress={day => {
            console.log('selected day', day);
          }}
          markedDates={markedDates}
        />
        <Text>今日のトレーニング</Text>
        <FlatList
          data={ tasks }
          keyExtractor={ task => task.id.toString() }
          renderItem={({ item }) => (
            <TaskCard
              task={item}
            />
          )}
          ListEmptyComponent={<Text>習慣が登録されていません。登録しましょう！</Text>}
          refreshControl={<RefreshControl refreshing={false} onRefresh={() => {}} />}
        />
        <Modal
          isVisible={isModalVisible}
          onBackdropPress={() => setIsModalVisible(false)}
          backdropOpacity={0.1}
          animationInTiming={1} // アニメーション無効
          animationOutTiming={1} // アニメーション無効
          style={{
            margin: 0,
            position: "absolute",
            top: iconPosition.y,
            left: iconPosition.x - 60, // ダイアログの横位置調整
          }}
          useNativeDriver={true} // チラつき防止
          hideModalContentWhileAnimating={true} // チラつき防止
        >
          <View className="bg-white p-2 rounded shadow-lg">
            <TouchableOpacity onPress={() => handleEdit()} className="mb-2">
              <Text className="text-blue-500 text-lg">編集</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete()}>
              <Text className="text-red-500 text-lg">削除</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default Calendar