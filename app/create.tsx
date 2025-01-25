import { ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Item } from '@/types'
import { getDayNumber, getThumbnailFromVideo } from '@/lib/utils'
import Form from '@/components/Form'

const Create = () => {
  return (
    <SafeAreaView>
      <ScrollView className='px-4 my-6'>
        <Form
          mode='create'
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default Create