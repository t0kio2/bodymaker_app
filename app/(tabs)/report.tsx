import { View, Text, SafeAreaView, FlatList, TouchableOpacity, RefreshControl } from 'react-native'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Heatmap from '@/components/HeatMap'
import { useTaskList } from '@/hooks/useTaskList'
import TaskCard from '@/components/TaskCard'
import EmptyList from '@/components/EmptyList'

export default function Report() {
  const { allTask, refreshing, loadAllTask } = useTaskList()

  return (
    <SafeAreaProvider>
      <SafeAreaView className='h-full bg-[#F7F9FC]'>
        <View className='px-5 py-4'>
          <Text className='text-2xl font-semibold text-[#333333]'>ヒートマップ</Text>
        </View>

        <Heatmap />

        <View className='flex-1 px-5 py-4'>
          <FlatList
            data={allTask}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TaskCard task={item} editMode={true} readonly={true} date='' />
            )}
            ListEmptyComponent={
              <EmptyList />
            }
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={loadAllTask} />
            }
          />

          {allTask.length > 3 && (
            <TouchableOpacity
              onPress={() => console.log('もっと読み込む')}
              className='mt-4 py-3 border border-[#B0B9C1] rounded-lg items-center'
            >
              <Text className='text-base text-[#555555]'>＋ もっと読み込む</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}
