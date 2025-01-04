import { View, Text } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { getDaysOfWeek } from '@/lib/utils'

const Recurring = ({ schedule }: any) => {
  return (
    <View className='flex-row items-center'>
      <View className='flex justify-end'>
        <Icon name='calendar-alt' size={20} color='#161622' />
      </View>
      <Text className='ml-2  text-lg'>
        {schedule.recurring.map((day: any, i: number) => (
          <Text key={i}>{getDaysOfWeek(day)}</Text>
        ))}
      </Text>
      <Text className='ml-2 text-lg'>
        {schedule.time}
      </Text>
    </View>
  )
}

export default Recurring