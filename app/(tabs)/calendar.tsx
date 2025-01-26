import { View, Text } from 'react-native'
import React from 'react'
import {Calendar as CalendarComponent, CalendarList, Agenda} from 'react-native-calendars'

const Calendar = () => {
  return (
    <View>
      <Text>calendar</Text>
      <CalendarComponent
        onDayPress={day => {
          console.log('selected day', day);
        }}
      />
    </View>
  )
}

export default Calendar