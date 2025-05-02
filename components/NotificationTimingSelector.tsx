import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

type Props = {
  selectedOffset: number
  onSelect: (offset: number) => void
}

const NOTIFICATION_TIMINGS = [
  { label: '5分前', value: 5 },
  { label: '15分前', value: 15 },
  { label: '30分前', value: 30 },
  { label: '60分前', value: 60 },
]

const NotificationTimingSelector: React.FC<Props> = ({ selectedOffset, onSelect }) => {
  return (
    <View className="mt-3 flex-row flex-wrap justify-center gap-2">
      {NOTIFICATION_TIMINGS.map((timing) => (
        <TouchableOpacity
          key={timing.value}
          className={`px-3 py-2 rounded-full justify-center items-center ${
            selectedOffset === timing.value ? 'bg-[#7FB3C0]' : 'bg-[#F3F4F6]'
          }`}
          onPress={() => onSelect(timing.value)}
        >
          <Text
            className={`text-base font-medium ${
              selectedOffset === timing.value ? 'text-white' : 'text-black'
            }`}
          >
            {timing.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

export default NotificationTimingSelector
