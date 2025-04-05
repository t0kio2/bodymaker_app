import { ScrollView, SafeAreaView } from 'react-native'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Form from '@/components/Form'
import { router, useLocalSearchParams } from 'expo-router'
import { eventEmitter } from '@/lib/EventEmitter'

const TaskForm = () => {
  const { mode, id } = useLocalSearchParams()

  return (
    <SafeAreaProvider>
      <SafeAreaView className='h-full bg-[#F7F9FC]'>
        <ScrollView className='px-4 my-6'>
          <Form
            mode={mode as 'create' | 'edit'}
            id={id as string}
            onTaskAdded={() => {
              eventEmitter.emit('taskUpdated')
              router.push('/list')
            }}
          />
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default TaskForm