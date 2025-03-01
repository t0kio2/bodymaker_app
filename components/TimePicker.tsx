import { View, Text, Platform, TouchableOpacity } from 'react-native'
import React from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { useTimePicker } from '@/hooks/useTimePicker'
import { getCurrentTimeStr } from '@/lib/utils'

interface TimePickerProps {
  timeStr: string
  handleTimeChange: (date: string) => void
}

const TimePicker: React.FC<TimePickerProps> = ({ timeStr, handleTimeChange }) => {
  const { timePickerVisible, selectedTime, onTimeChange, showTimePicker } = useTimePicker(timeStr || getCurrentTimeStr())
  
  const handleChange = (event: any, date: Date | undefined) => {
    onTimeChange(event, date, handleTimeChange)
  }

  return (
    <View>
      {
        Platform.OS === 'android' && 
          <TouchableOpacity onPress={showTimePicker}>
            <View className='flex-row items-center'>
              <Icon
                name='clock'
                size={20}
                color='#161622'
                style={{ width: 24, textAlign: "center" }}
                className='flex mr-1'
              />
              <Text className='text-4xl'>{timeStr}</Text>
            </View>
          </TouchableOpacity>
      }

      { timePickerVisible && (
        <View className='flex-row items-center'>
          {  Platform.OS === 'ios' && 
            <Icon
              name='clock'
              size={20}
              color='#161622'
              style={{ width: 24, textAlign: "center" }}
              className='flex'
            />}
          <DateTimePicker
            value={selectedTime}
            mode='time'
            is24Hour={true}
            display='default'
            onChange={handleChange}
            locale="ja-JP"
          />
        </View>
      )}
    </View>
  )
}

export default TimePicker