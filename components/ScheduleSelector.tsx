import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { DAY_OF_WEEK_BIT } from '@/constants/common'

type Props = {
  selectedDays: number
  onToggle: (day: number) => void
}

const ScheduleSelector: React.FC<Props> = ({ selectedDays, onToggle }) => {
  return (
    <View className="mt-3 flex-row flex-nowrap justify-center gap-1">
      {Object.entries(DAY_OF_WEEK_BIT.ja).map(([day, bit]) => (
        <TouchableOpacity
          key={day}
          className={`w-14 h-14 rounded-full justify-center items-center ${
            selectedDays & bit ? 'bg-[#7FB3C0]' : 'bg-[#F3F4F6]'
          }`}
          onPress={() => onToggle(bit)}
        >
          <Text
            className={`text-xl font-bold ${
              selectedDays & bit ? 'text-white' : 'text-black'
            }`}
          >
            {day.slice(0, 3)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

export default ScheduleSelector
