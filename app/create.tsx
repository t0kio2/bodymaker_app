import { Text, ScrollView, TouchableOpacity, View, Switch } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import FormField from '@/components/FormField'
import TimePicker from '@/components/TimePicker'
import CustomButton from '@/components/CustomButton'
import { DAY_OF_WEEK } from '@/constants/common'
import { router } from 'expo-router'

const Create = () => {
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [isEveryday, setIsEveryday] = useState(false)

  const toggleSwitch = () => {
    const nextState = !isEveryday
    setSelectedDays(nextState ? DAY_OF_WEEK : [])
    setIsEveryday(nextState)
  }

  const toggleDays = (day: string) => {
    setSelectedDays(prev => {
      const updated = prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
      const isSelectedAll = updated.length === DAY_OF_WEEK.length
      setIsEveryday(isSelectedAll)
      return updated
    })
  }

  return (
    <SafeAreaView>
      <ScrollView className='px-4 my-6'>
        <FormField
          title='習慣名'
          value=''
          placeholder='習慣名を入力'
          handleChangeText={() => {}}
          containerStyle='mb-4'
        />
        <View className='mt-5'>
          <TimePicker />
        </View>
        <View className='mt-5 flex-row items-center'>
          <Text>毎日</Text>
          <View className=''>
            <Switch
              trackColor={{true: '#3b82f6'}}
              thumbColor={isEveryday ? '#d1d5db' : '#f4f3f4'}
              ios_backgroundColor="#d1d5db"
              onValueChange={toggleSwitch}
              value={isEveryday}
            />
          </View>
        </View>
        <View className='mt-2 flex-row flex-wrap justify-center gap-2'>
          {DAY_OF_WEEK.map((day, i) => (
            <TouchableOpacity
              key={i}
              className={`px-4 bg-[#D9D9D9] rounded-full w-12 h-12
              justify-center items-center
              ${selectedDays.includes(day) ? 'bg-blue-500' : 'bg-gray-300'}
              `}
              onPress={() => toggleDays(day)}
            >
              <Text
                className={`text-base font-bold ${
                  selectedDays.includes(day) ? "text-white" : "text-black"
                }`}
              >{day}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <View className='mt-10'>
          <FormField
            title='動画URL'
            value=''
            placeholder='URLを入力'
            handleChangeText={() => {}}
            containerStyle='mb-4'
          />
        </View>
        <CustomButton
          title='登録'
          handlePress={() => {}}
          // containerStyle='mt-7'
          containerStyle='mt-7 bg-primary'
        />
        <CustomButton
          title='とじる'
          handlePress={() => router.replace('/home')}
          containerStyle='mt-2 bg-gray-500'
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default Create