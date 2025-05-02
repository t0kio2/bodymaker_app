import { View, Text, SafeAreaView, FlatList, TouchableOpacity, RefreshControl } from 'react-native'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Heatmap from '@/components/Heatmap'
import { useTaskStore } from '@/hooks/useTaskStore'
import TaskCard from '@/components/TaskCard'
import EmptyList from '@/components/EmptyList'
import { useEffect, useState } from 'react'

export default function Report() {
  const { allTasks, isLoading, loadAllTasks } = useTaskStore()
  const [displayedCount, setDisplayedCount] = useState(3)

  const loadMore = () => {
    setDisplayedCount((prevCount: number) => prevCount + 3)
  }

  const loadLess = () => {
    setDisplayedCount(3)
  }

  const displayedTasks = allTasks.slice(0, displayedCount)

  return (
    <SafeAreaProvider>
      <SafeAreaView className='h-full bg-[#F7F9FC]'>
        {/* <View className='px-5 py-4'>
          <Text className='text-2xl font-semibold text-[#333333]'>ヒートマップ</Text>
        </View> */}

        <Heatmap />

        <View className='flex-1 px-5 py-4'>
          <Text className='text-2xl font-semibold text-[#333333]'>ランキング</Text>
          <FlatList
            data={displayedTasks}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TaskCard task={item} editMode={true} readonly={true} date='' />
            )}
            ListEmptyComponent={
              <EmptyList />
            }
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={loadAllTasks} />
            }
            ListFooterComponent={() => (
              <>
                {displayedCount > 3 ? (
                  <TouchableOpacity
                    onPress={loadLess}
                    className='mt-4 py-3 border border-[#B0B9C1] rounded-lg items-center'
                  >
                    <Text className='text-base text-[#555555]'>← 元に戻す</Text>
                  </TouchableOpacity>
                ) : (
                  displayedCount < allTask.length && (
                    <TouchableOpacity
                      onPress={loadMore}
                      className='mt-4 py-3 border border-[#B0B9C1] rounded-lg items-center'
                    >
                      <Text className='text-base text-[#555555]'>＋ もっと読み込む</Text>
                    </TouchableOpacity>
                  )
                )}
              </>
            )}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}
