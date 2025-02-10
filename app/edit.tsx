import { SafeAreaView, ScrollView } from 'react-native'
import React from 'react'
import Form from '@/components/Form'
import { SafeAreaProvider } from 'react-native-safe-area-context'

const Edit = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <ScrollView className='px-4 my-6'>
          <Form
            mode='edit'
          />
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default Edit