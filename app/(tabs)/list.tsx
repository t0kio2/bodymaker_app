import { FlatList, RefreshControl, Text, TouchableOpacity, SafeAreaView, View } from 'react-native'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { router } from 'expo-router'
import TaskCard from '@/components/TaskCard'
import { useTaskList } from '@/hooks/useTaskList'
import EmptyList from '@/components/EmptyList'

export default function List() {
  const { allTask, refreshing, loadAllTask } = useTaskList()

  return (
    // デバイス毎に余白をよしなにしてくれる
    <SafeAreaProvider>
      <SafeAreaView className='h-full bg-[#F7F9FC]'>
        <FlatList
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
            <EmptyList />
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={loadAllTask} />
          }
        />
        <TouchableOpacity
          className='absolute bottom-8 right-8 shadow-sm w-16 h-16 bg-[#6C8BA7] rounded-full flex items-center justify-center'
          onPress={() => router.push('/taskForm?mode=create')}
        >
          <Icon name='plus' size={24} color='#FFFFFF' />
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}
