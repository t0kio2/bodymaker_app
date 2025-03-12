import { FlatList, RefreshControl, Text, TouchableOpacity, SafeAreaView } from 'react-native'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { router } from 'expo-router'
import TaskCard from '@/components/TaskCard'
import { useTaskList } from '@/hooks/useTaskList'

export default function List() {
  const { allTask, refreshing, loadAllTask } = useTaskList()

  return (
    // デバイス毎に余白をよしなにしてくれる
    <SafeAreaProvider>
      <SafeAreaView className='h-full bg-white'>
        <FlatList
          // className='border border-red-500'
          data={ allTask }
          keyExtractor={ task => task.id.toString()}
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              editMode={true}
              onTaskDeleted={loadAllTask}
              date=''
            />
          )}
          // ListHeaderComponent={<Text>Header</Text>}
          ListEmptyComponent={
            <Text>習慣が登録されていません。登録しましょう！</Text>
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={loadAllTask} />
          }
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
