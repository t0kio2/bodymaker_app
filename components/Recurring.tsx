import { View, Text } from 'react-native'
import React from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { getSelectedDays, isEverydayChecked } from '@/lib/utils'
import { Schedule } from '@/types'

interface RecurringProps {
  schedule: Schedule
}

const Recurring: React.FC<RecurringProps> = ({ schedule }) => {
  if (!schedule) return null
  return (
    <View className='flex-row items-center'>
      <View className='flex justify-end'>
        <MaterialIcons name='autorenew' size={20} color='#333333' />
      </View>
      <Text className='ml-1 text-[#333333]'>
        {
          isEverydayChecked(schedule.bitmask_days)
          ? '毎日'
          : getSelectedDays(schedule.bitmask_days)
        }
      </Text>
      <Text className='ml-2 text-[#333333]'>
        {schedule.time}
      </Text>
    </View>
  )
}

export default Recurring