import { View, Text, Platform, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import Icon from 'react-native-vector-icons/FontAwesome5'

const TimePicker = () => {
  const [date, setDate] = useState(new Date())
  const [timePickerVisible, setTimePickerVisible] = useState<boolean>(Platform.OS === 'ios')
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
  }

  const onTimeChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || date
    setTimePickerVisible(Platform.OS === 'ios')
    setDate(currentDate)
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
              <Text className='text-4xl'>{date.toLocaleTimeString('ja-JP', timeOptions)}</Text>
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
            value={date}
            mode='time'
            is24Hour={true}
            display='default'
            onChange={onTimeChange}
            locale="ja-JP"
            // themeVariant="dark" // "light" or "dark" モードを指定
            // textColor="#FFD700" // テキストの色
            // accentColor="#1E90FF" // ハイライト（OK/Cancelボタン）の色
          />
        </View>
      )}
    </View>
  )
}


export default TimePicker