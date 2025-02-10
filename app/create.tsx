import { ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import Form from '@/components/Form'

const Create = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <ScrollView className='px-4 my-6'>
          <Form
            mode='create'
          />
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default Create