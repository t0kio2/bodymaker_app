import { FlatList, RefreshControl, Text, TouchableOpacity, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { router } from 'expo-router'
import { TaskWithSchedule } from '@/types'
import { getTasks } from '@/database/queries'
import TaskCard from '@/components/TaskCard'
import { useDatabase } from '@/hooks/useDatabase'

export default function List() {
  const { db } = useDatabase()
  const [tasks, setTasks] = useState<TaskWithSchedule[]>([])

  const loadTasks = async () => {
    if (!db) return
    const taskData = await getTasks(db)
    setTasks(taskData)
  }

  useEffect(() => {
    loadTasks()
  }, [db])

  if (!db) return null

  return (
    // デバイス毎に余白をよしなにしてくれる
    <SafeAreaProvider>
      <SafeAreaView className='h-full bg-white'>
        <FlatList
          // className='border border-red-500'
          data={ tasks }
          keyExtractor={ task => task.id.toString()}
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              editMode={true}
            />
          )}
          // ListHeaderComponent={<Text>Header</Text>}
          ListEmptyComponent={<Text>習慣が登録されていません。登録しましょう！</Text>}
          refreshControl={<RefreshControl refreshing={false} onRefresh={() => {}} />}
        />
        <TouchableOpacity
          className='absolute bottom-8 right-8 shadow-lg w-20 h-20 bg-[#161622] rounded-full
          flex items-center justify-center'
          onPress={() => router.push('/taskForm?mode=create')}
        >
          <Icon name='plus' size={20} color='#FFF' />
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}
