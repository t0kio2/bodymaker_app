import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React from 'react'
import Form from '@/components/Form'

const Edit = () => {
  return (
    <SafeAreaView>
      <ScrollView className='px-4 my-6'>
        <Form
          mode='edit'
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default Edit