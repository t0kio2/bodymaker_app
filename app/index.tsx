import { Text, View, SafeAreaView } from 'react-native'
import React, { useEffect } from 'react'
import "./../global.css"
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native'
import { Redirect, router } from 'expo-router'
import CustomButton from '@/components/CustomButton'
import { requestPermissionAsync } from '@/lib/notification'

import { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import Auth from '@/components/Auth'
import { useDatabase } from '@/hooks/useDatabase'

export default function App () {
  // データベース初期化
  const { db } = useDatabase()
  
  useEffect(() => {
    requestPermissionAsync()
  })
  if (!db) return <Text>データベースの初期化中...</Text>
  
  return <Redirect href="/calendar" />

  // WIP: 認証機能
  // const [session, setSession] = useState<Session | null>(null)
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

  return (
    <SafeAreaProvider>
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
    </SafeAreaProvider>
  )
}
