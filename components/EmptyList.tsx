import { View, Text } from 'react-native'
import React from 'react'

const EmptyList = () => {
  return (
    <View className="py-10 items-center">
      <Text className="text-lg text-[#76828F]">タスクがありません</Text>
      <Text className="text-sm text-[#888888] mt-1">新しいタスクを作成してください。</Text>
    </View>
  )
}

export default EmptyList