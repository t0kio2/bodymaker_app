import { View, Text, ScrollView, SafeAreaView, FlatList } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Heatmap from '@/components/Heatmap'
import { useRollingContinuityRate } from '@/hooks/useRollingContinuityRate'
import { useTaskList } from '@/hooks/useTaskList'
import TaskCard from '@/components/TaskCard'

export default function Report() {
  const { allTask } = useTaskList()

  // フックに定義
  const { rateByTask } = useRollingContinuityRate()
  console.log('rateByTask in report', rateByTask)
  
  return (
    <SafeAreaProvider>
      <SafeAreaView className='h-full bg-white'>
        <View className='pl-4 pt-4'>
          <Text className='text-2xl'>ヒートマップ</Text>
        </View>
        <Heatmap />
        <View className='pl-4 pt-4'>
          <FlatList
            data={ allTask }
            renderItem={({ item }) => (
              <View style={{ margin:10, padding: 10, borderWidth: 1, borderColor: "#ddd" }}>
                <TaskCard
                  task={item}
                  editMode={false}
                  date=''
                />
              </View>
            )}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}
