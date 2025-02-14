import { View, Text, ScrollView, SafeAreaView, FlatList } from 'react-native'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import HeatMap from '@/components/HeatMap'

const Report = () => {
  
  return (
    <SafeAreaProvider>
      <SafeAreaView className='h-full bg-white'>
        <View className='pl-4 pt-4'>
          <Text className='text-2xl'>継続度カレンダー</Text>
        </View>
        <HeatMap />
        <View className='pl-4 pt-4'>
          <FlatList
            data={ [1,2,3,4] }
            // keyExtractor={ task => task.id.toString() }
            renderItem={({ item }) => (
              <Text>{item}</Text>
            )}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default Report