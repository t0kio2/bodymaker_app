import { View, Text, Switch, Alert } from 'react-native'
import React from 'react'
import FormField from './FormField'
import TimePicker from './TimePicker'
import CustomButton from './CustomButton'
import { router } from 'expo-router'
import { useTaskActions } from '@/hooks/useTaskActions'
import { useFormState } from '@/hooks/useFormState'
import ScheduleSelector from './ScheduleSelector'
import NotificationTimingSelector from './NotificationTimingSelector'
import { Schedule } from '@/types'

const Form = ({
  mode,
  id,
  onTaskAdded,
}: {
  mode: 'create' | 'edit'
  id?: string
  onTaskAdded: () => void
}) => {
  const { task, saveTask } = useTaskActions(id, mode)
  const {
    formData,
    timeStr,
    selectedDays,
    isEveryday,
    pushNotification,
    notificationOffset,
    validationError,
    setTimeStr,
    setPushNotification,
    setNotificationOffset,
    handleChange,
    validateForm,
    selectAllDays,
    handleToggleDays,
    getSubmitData
  } = useFormState(mode, task)

  const handleSubmit = async () => {
    const submitData = getSubmitData()
    if (!submitData) {
      return Alert.alert('入力内容に不備があります', validationError)
    }

    const { task: taskData, schedule } = submitData

    const success = await saveTask(taskData, schedule)
    if (success) {
      Alert.alert('保存しました！')
      onTaskAdded()
    } else {
      Alert.alert('保存に失敗しました')
    }
  }

  return (
    <>
      <FormField
        title="習慣名"
        value={formData.title}
        placeholder="習慣名を入力"
        handleChangeText={(e: string) => handleChange('title', e)}
        containerStyle="mb-4"
      />
      <View className="mt-4">
        <ScheduleSelector selectedDays={selectedDays} onToggle={handleToggleDays} />
      </View>

      <View className="mt-6 flex-row items-center justify-between bg-white rounded-lg px-4 py-3 shadow-sm">
        <Text className="text-[#333333] text-base">毎日</Text>
        <Switch
          trackColor={{ true: '#6C8BA7', false: '#B0B9C1' }}
          thumbColor="#FFFFFF"
          ios_backgroundColor="#B0B9C1"
          onValueChange={selectAllDays}
          value={isEveryday}
        />
      </View>

      <View className="mt-6 flex-row items-center justify-between bg-white rounded-lg px-4 py-3 shadow-sm">
        <Text className="text-[#333333] text-base">時間</Text>
        <TimePicker timeStr={timeStr} handleTimeChange={(e) => setTimeStr(e)} />
      </View>

      <View className="mt-4 flex-row items-center justify-between bg-white rounded-lg px-4 py-3 shadow-sm">
        <Text className="text-[#333333] text-base">通知</Text>
        <Switch
          trackColor={{ true: '#6C8BA7', false: '#B0B9C1' }}
          thumbColor="#FFFFFF"
          ios_backgroundColor="#B0B9C1"
          onValueChange={() => setPushNotification((prev) => !prev)}
          value={pushNotification}
        />
      </View>

      {pushNotification && (
        <View className="mt-4 flex-row items-center flex-col bg-white rounded-lg px-4 py-3 shadow-sm">
          <Text className="text-[#333333] text-base self-start mb-2">通知タイミング</Text>
          <NotificationTimingSelector 
            selectedOffset={notificationOffset}
            onSelect={(offset) => setNotificationOffset(offset)}
          />
        </View>
      )}

      <View className="mt-8">
        <CustomButton
          title={mode === 'create' ? '登録' : '更新'}
          handlePress={() => handleSubmit()}
          containerStyle="bg-[#6C8BA7] py-3 rounded-lg"
          textStyle="text-[#333333] text-lg"
        />
      </View>

      <View className="mt-4">
        <CustomButton
          title="とじる"
          handlePress={() => router.replace('/list')}
          containerStyle="bg-[#D1D5DB] py-3 rounded-lg"
          textStyle="text-[#333333] text-lg"
        />
      </View>
    </>
  )
}

export default Form
