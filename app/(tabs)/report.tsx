import { View, Text, ScrollView, SafeAreaView, FlatList, TouchableOpacity, RefreshControl } from 'react-native'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Heatmap from '@/components/Heatmap'
import { useTaskList } from '@/hooks/useTaskList'
import TaskCard from '@/components/TaskCard'

export default function Report() {
  const { allTask, refreshing, loadAllTask } = useTaskList()
  
  return (
    <SafeAreaProvider>
      <SafeAreaView className='h-full bg-white'>
        <View className='pl-4 pt-4'>
          <Text className='text-2xl'>ヒートマップ</Text>
        </View>
        <Heatmap />
        <View
          className='pl-4 pt-4' 
          style={{ margin:10, padding: 10, borderWidth: 1, borderColor: "#ddd" }}
        >
          <FlatList
            data={ allTask }
            renderItem={({ item }) => (
              <TaskCard
                task={item}
                editMode={true}
                readonly={true}
                date=''
              />
            )}
            ListEmptyComponent={
              <Text>習慣が登録されていません。登録しましょう！</Text>
            }
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={loadAllTask} />
            }
          />
          {
            allTask.length > 3 && (
              <TouchableOpacity
                onPress={() => console.log('もっと読み込む')}
                style={{
                  marginTop: 12,
                  padding: 10,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "#ddd",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={{ fontSize: 16, color: "#555" }}>＋ もっと読み込む</Text>
              </TouchableOpacity>
            )
          }
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}
