import { View, Text } from 'react-native'
import React from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { getDaysOfWeek, isEverydayChecked } from '@/lib/utils'

const Recurring = ({ schedule }: any) => {
  return (
    <View className='flex-row items-center'>
      <View className='flex justify-end'>
        <MaterialIcons name='autorenew' size={20} color='#161622' />
      </View>
      <Text className='ml-1  text-lg'>
        {
          isEverydayChecked(schedule.recurring)
          ? '毎日'
          : schedule.recurring.map((day: any, i: number) => (
            <Text key={i}>{ getDaysOfWeek(day) }</Text>
          ))
        }
      </Text>
      <Text className='ml-2 text-lg'>
        {schedule.time}
      </Text>
    </View>
  )
}

export default Recurring