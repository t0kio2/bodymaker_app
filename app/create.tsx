import { ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Item } from '@/types'
import { getDayNumber, getThumbnailFromVideo } from '@/lib/utils'
import Form from '@/components/Form'

const Create = () => {
  const [items, setItems] = useState<any>([])
  const [form, setForm] = useState<Item>({
    id: Date.now().toString(),
    title: '', 
    video: '',
    thumbnail: '',
    schedule: {
      recurring: [],
      time: '',
    },
    goal: '',
    createdAt: '',
  })
  const [errors, setErrors] = useState<any>({
    title: '',
    video: '',
  })

  const handleChange = (field: string, value: string) => {
    console.log('field: ', field, 'value: ', value)
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const loadData = async () => {
    try {
      const data = await AsyncStorage.getItem('items')
      if (data !== null) {
        setItems(JSON.parse(data))
      }
    } catch (error) {
      console.error(error)
      throw new Error('Failed to load data')
    }
  }
  useEffect(() => {
    // AsyncStorage.clear()
    loadData()
  }, [])
  const handleSubmit = async (time: string, selectedDays: []) => {
    if (!validateForm()) return Alert.alert('入力内容に不備があります')
    const selectedDaysNumber = selectedDays.map((e: string) => getDayNumber(e))
    const data = {
      id: Date.now().toString(),
      title: form.title, 
      video: form.video,
      thumbnail: getThumbnailFromVideo(form.video),
      schedule: {
        recurring: selectedDaysNumber, // For weekly: 0=Sunday, 1=Monday, etc.
        time: time,
      },
      goal: 'まずは2習慣継続!',
      createdAt: Date.now(),
    }
    console.log('data: ', data)
    try {
      const updatedItems = items ? [...items, data] : [data]
      await AsyncStorage.setItem('items', JSON.stringify(updatedItems))
      Alert.alert('登録しました！頑張りましょう！')
      router.replace('/home?updated=true')
    } catch (error) {
      console.error(error)
      throw new Error('Failed to save data')
    }
  }

  const validateForm = () => {
    if (!form.title) {
      setErrors({ title: '習慣名を入力してください' })
      return false
    }
    return true
  }

  return (
    <SafeAreaView>
      <ScrollView className='px-4 my-6'>
        <Form
          formData={form}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default Create