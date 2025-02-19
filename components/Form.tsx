import { View, Text, Switch, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import FormField from './FormField'
import TimePicker from './TimePicker'
import { DAY_OF_WEEK } from '@/constants/common'
import CustomButton from './CustomButton'
import { router, useLocalSearchParams } from 'expo-router'
import { useTask } from '@/hooks/useTask'
import { useForm } from '@/hooks/useForm'

const Form = ({ mode }: { mode: 'create' | 'edit'}) => {
  const { id } = useLocalSearchParams()
  const { task, saveTask } = useTask(id as string, mode)
  const {
    formData,
    time,
    selectedDays,
    isEveryday,
    pushNotification,
    errors,
    setTime,
    setPushNotification,
    handleChange,
    validateForm,
    toggleSwitch,
    toggleDays,
  } = useForm(mode, task)

  const handleSubmit = async () => {
    console.log('formData', formData)
    // if (!validateForm()) {
    //   return Alert.alert('入力内容に不備があります', errors.title)
    // }
    // const taskData = {
    //   title: formData.title,
    //   schedule: { recurring: selectedDays, time },
    //   goal: formData.goal,
    // }
    // const success = await saveTask(taskData)
    // Alert.alert(success ? "保存成功！" : "保存失敗")
  }
  

  return (
    <>
      <FormField
        title='習慣名'
        value={formData.title}
        placeholder='習慣名を入力'
        handleChangeText={(e: string) => handleChange('title', e)}
        containerStyle='mb-4'
      />
      <View className='mt-5'>
        <TimePicker
          value={time}
          handleTimeChange={(e) => setTime(e)}
        />
      </View>
      <View className='mt-3 flex-row flex-wrap justify-center gap-1'>
        {DAY_OF_WEEK.map((day, i) => (
          <TouchableOpacity
            key={i}
            className={`px-4 bg-[#D9D9D9] rounded-full w-14 h-14
            justify-center items-center
            ${selectedDays.includes(day) ? 'bg-blue-500' : 'bg-gray-300'}
            `}
            onPress={() => toggleDays(day)}
          >
            <Text
              className={`text-xl font-bold ${
                selectedDays.includes(day) ? "text-white" : "text-black"
              }`}
            >{day}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View className='mt-5 flex-row items-center'>
        <Text>毎日</Text>
        <View className='ml-3'>
          <Switch
            trackColor={{true: '#3b82f6'}}
            thumbColor={isEveryday ? '#d1d5db' : '#f4f3f4'}
            ios_backgroundColor="#d1d5db"
            onValueChange={toggleSwitch}
            value={isEveryday}
          />
        </View>
      </View>
      <View className='mt-5 flex-row items-center'>
        <Text>通知</Text>
        <View className='ml-3'>
          <Switch
            trackColor={{true: '#3b82f6'}}
            thumbColor={isEveryday ? '#d1d5db' : '#f4f3f4'}
            ios_backgroundColor="#d1d5db"
            onValueChange={() => setPushNotification((prev) => !prev)} 
            value={pushNotification}
          />
        </View>
      </View>
      <CustomButton
        title={mode === 'create' ? '登録' : '更新'}
        handlePress={() => handleSubmit()}
        containerStyle='mt-7 bg-primary'
      />
      <CustomButton
        title='とじる'
        handlePress={() => router.replace('/calendar')}
        containerStyle='mt-2 bg-gray-500'
      />
    </>
  )
}

export default Form