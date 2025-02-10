import { FlatList, RefreshControl, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { router, useLocalSearchParams } from 'expo-router'
import { Task } from '@/types'
import { getTasks } from '@/database/queries'
import { openDatabaseAsync } from '@/database/db'
import TaskCard from '@/components/TaskCard'

export default function List() {
  const [tasks, setTasks] = useState<Task[]>([])
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

  return (
    // デバイス毎に余白をよしなにしてくれる
    <SafeAreaProvider>
      <SafeAreaView className='h-full'>
        <Text>継続度カレンダー</Text>
        <FlatList
          // className='border border-red-500'
          data={ tasks }
          keyExtractor={ task => task.id.toString()}
          renderItem={({ item }) => (
            <TaskCard
              task={item}
            />
          )}
          // ListHeaderComponent={<Text>Header</Text>}
          ListEmptyComponent={<Text>習慣が登録されていません。登録しましょう！</Text>}
          refreshControl={<RefreshControl refreshing={false} onRefresh={() => {}} />}
        />
        <TouchableOpacity
          className='absolute bottom-8 right-8 shadow-lg w-20 h-20 bg-[#161622] rounded-full
          flex items-center justify-center'
          onPress={() => router.push('/create')}
        >
          <Icon name='plus' size={20} color='#FFF' />
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}
