import { View, Text, Switch, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import FormField from './FormField'
import TimePicker from './TimePicker'
import { DAY_OF_WEEK } from '@/constants/common'
import CustomButton from './CustomButton'
import { router, useLocalSearchParams } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Item } from '@/types'
import { getDayNumber, getThumbnailFromVideo, isEverydayChecked } from '@/lib/utils'
import { registerNotification } from '@/lib/pushNotification'
import { openDatabaseAsync } from '@/database/db'
import { insertItem } from '@/database/queries'

const Form = ({ mode }: { mode: 'create' | 'edit'}) => {
  const { id } = useLocalSearchParams()
  const [time, setTime] = useState<any>('')
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [isEveryday, setIsEveryday] = useState(false)
  const [items, setItems] = useState<any>([])
  const [formData, setFormData] = useState({
    title: '', 
    video: '',
    goal: '',
  })
  const [errors, setErrors] = useState<any>({
    title: '',
    video: '',
  })

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    try {
      const data = await AsyncStorage.getItem('items')
      if (data === null) return
      const parseData = JSON.parse(data)
      setItems(parseData)
      if (mode === 'edit' && id) {
        const targetItem = parseData.find((item: Item) => item.id === id)
        if (targetItem) {
          setFormData({
            title: targetItem.title,
            video: targetItem.video,
            goal: targetItem.goal,
          })
          setTime(targetItem.schedule.time)
          setSelectedDays(targetItem.schedule.recurring.map((day: number) => DAY_OF_WEEK[day]))
          isEverydayChecked(targetItem.schedule.recurring) && setIsEveryday(true)
        }
      }
    } catch (error) {
      console.error(error)
      throw new Error('Failed to load data')
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }


  const handleSubmit = async (time: string, selectedDays: string[]) => {
    if (!validateForm()) {
      return Alert.alert(
        '入力内容に不備があります',
        errors.title
      )
    }

    const selectedDaysNumber = selectedDays.map((e: string) => getDayNumber(e))
    const item: Omit<Item, 'id'> = {
      title: formData.title,
      video: formData.video,
      thumbnail: getThumbnailFromVideo(formData.video),
      schedule: {
        // For weekly: 0=Sunday, 1=Monday, etc.
        recurring: selectedDaysNumber,
        time: time,
      },
      goal: 'まずは2習慣継続!',
      createdAt: new Date(),
    }
    // const updatedItems = mode === 'create'
    //   ? [...items, item]
    //   : items.map((item: Item) => item.id === id ? item : item)
    try {
      // await AsyncStorage.setItem('items', JSON.stringify(updatedItems))
      // Alert.alert('登録しました！頑張りましょう！')

      // // Push通知の登録
      // await registerNotification(data)

      const db = await openDatabaseAsync()
      console.log("db: ", db)
      await insertItem(db, item)
      Alert.alert('登録しました！頑張りましょう！')

      router.replace('/home?updated=true')
    } catch (error) {
      console.error(error)
      throw new Error('Failed to save data')
    }
  }
  
  const validateForm = () => {
    if (!formData.title) {
      setErrors({ title: '習慣名を入力してください' })
      return false
    }
    return true
  }
  
  const toggleSwitch = () => {
    const nextState = !isEveryday
    setSelectedDays(nextState ? DAY_OF_WEEK : [])
    setIsEveryday(nextState)
  }

  const toggleDays = (day: string) => {
    setSelectedDays(prev => {
      const updated = prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
      const isSelectedAll = isEverydayChecked(updated)
      setIsEveryday(isSelectedAll)
      return updated
    })
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
      
      <View className='mt-10'>
        <FormField
          title='動画URL'
          value={formData.video}
          placeholder='URLを入力'
          handleChangeText={(e: string) => handleChange('video', e )}
          containerStyle='mb-4'
        />
      </View>
      <CustomButton
        title={mode === 'create' ? '登録' : '更新'}
        handlePress={() => handleSubmit(time, selectedDays)}
        // containerStyle='mt-7'
        containerStyle='mt-7 bg-primary'
      />
      <CustomButton
        title='とじる'
        handlePress={() => router.replace('/home')}
        containerStyle='mt-2 bg-gray-500'
      />
    </>
  )
}

export default Form