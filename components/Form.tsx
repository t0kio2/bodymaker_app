import { View, Text, Switch, Alert } from 'react-native'
import React from 'react'
import FormField from './FormField'
import TimePicker from './TimePicker'
import CustomButton from './CustomButton'
import { router } from 'expo-router'
import { useTask } from '@/hooks/useTask'
import { useForm } from '@/hooks/useForm'
import ScheduleSelector from './ScheduleSelector'
import { Schedule } from '@/types'

const Form = ({ mode, id, onTaskAdded }: { 
  mode: 'create' | 'edit'
  id?: string
  onTaskAdded: () => void
}) => {
  const { task, saveTask } = useTask(id as string, mode)
  const {
    formData,
    timeStr,
    selectedDays,
    isEveryday,
    pushNotification,
    setTimeStr,
    setPushNotification,
    handleChange,
    validateForm,
    selectAllDays,
    handleToggleDays,
  } = useForm(mode, task)

  const handleSubmit = async () => {
    const errorMessage = validateForm() 
    if (errorMessage) {
      return Alert.alert('入力内容に不備があります', errorMessage)
    }

    const taskData = {
      ...formData,
      is_push_notification: pushNotification
    }
    
    const schedule = {
      bitmask_days: selectedDays,
      time: timeStr
    } as Schedule

    const success = await saveTask(taskData, schedule)
    if (success) {
      Alert.alert("保存しました！")
      onTaskAdded()
    } else {
      Alert.alert("保存に失敗しました")
    }
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
          timeStr={timeStr}
          handleTimeChange={(e) => setTimeStr(e)}
        />
      </View>
      <ScheduleSelector selectedDays={selectedDays} onToggle={handleToggleDays} />
      <View className='mt-5 flex-row items-center'>
        <Text>毎日</Text>
        <View className='ml-3'>
          <Switch
            trackColor={{true: '#3b82f6'}}
            thumbColor={isEveryday ? '#d1d5db' : '#f4f3f4'}
            ios_backgroundColor="#d1d5db"
            onValueChange={selectAllDays}
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
        handlePress={() => router.replace('/list')}
        containerStyle='mt-2 bg-gray-500'
      />
    </>
  )
}

export default Form