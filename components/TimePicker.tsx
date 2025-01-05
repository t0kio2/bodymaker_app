import { View, Text, Platform, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import Icon from 'react-native-vector-icons/FontAwesome5'

interface TimePickerProps {
  value: string
  handleTimeChange: (date: string) => void
}

const TimePicker: React.FC<TimePickerProps> = ({ value, handleTimeChange }) => {
  const [timePickerVisible, setTimePickerVisible] = useState<boolean>(Platform.OS === 'ios')
  const [selectedTime, setSelectedTime] = useState<Date>(new Date())

  const onTimeChange = (event: any, selectedDate: Date | undefined) => {
    if (!selectedDate) return
    const hours = selectedDate.getHours().toString().padStart(2, '0')
    const minutes = selectedDate.getMinutes().toString().padStart(2, '0')
    const formattedTime = `${hours}:${minutes}`
    handleTimeChange(formattedTime)
    setTimePickerVisible(Platform.OS === 'ios')
  }
  return (
    
    <View>
      {
        Platform.OS === 'android' && 
          <TouchableOpacity
            onPress={() => setTimePickerVisible(true)}
          >
            <View className='flex-row items-center'>
              <Icon
                name='clock'
                size={20}
                color='#161622'
                style={{ width: 24, textAlign: "center" }}
                className='flex'
              />
              <Text className='text-4xl'>{value || '選択されていません'}</Text>
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
            onChange={onTimeChange}
            locale="ja-JP"
          />
        </View>
      )}
    </View>
  )
}


export default TimePicker