import { Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import "./../global.css"
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native'
import { Redirect, router } from 'expo-router'
import { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import Auth from '@/components/Auth'
import CustomButton from '@/components/CustomButton'

const App = () => {
  const [session, setSession] = useState<Session | null>(null)

  // WIP: 認証機能
  // useEffect(() => {
  //   supabase.auth.getSession().then(({ data: { session } }) => {
  //     setSession(session)
  //   })
  //   supabase.auth.onAuthStateChange((_event, session) => {
  //     setSession(session)
  //   })
  // }, [])

  // WIP: 認証機能 (https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native?queryGroups=auth-store&auth-store=async-storage)
  // if (session && session?.user) return <Redirect href="/home" />
  return <Redirect href="/home" />

  return (
    <SafeAreaView className='h-full'>
      <ScrollView>
        <View>
          <Text>init画面</Text>
        </View>
        <CustomButton
          title="メールアドレスでログイン"
          handlePress={() => { router.push('/signin') }}
          containerStyle="w-full mt-7"
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default App
