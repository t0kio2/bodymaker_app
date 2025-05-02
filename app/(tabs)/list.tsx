import { FlatList, RefreshControl, Text, TouchableOpacity, SafeAreaView, View } from 'react-native'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { router } from 'expo-router'
import TaskCard from '@/components/TaskCard'
import { useTaskStore } from '@/hooks/useTaskStore'
import EmptyList from '@/components/EmptyList'

export default function List() {
  const { allTasks, isLoading, loadAllTasks } = useTaskStore()

  return (
    // デバイス毎に余白をよしなにしてくれる
    <SafeAreaProvider>
      <SafeAreaView className='h-full bg-[#F7F9FC]'>
        <FlatList
          data={ allTasks }
          keyExtractor={ task => task.id.toString()}
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              editMode={true}
              onTaskDeleted={loadAllTasks}
              date=''
            />
          )}
          // ListHeaderComponent={<Text>Header</Text>}
          ListEmptyComponent={
            <EmptyList />
          }
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={loadAllTasks} />
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
