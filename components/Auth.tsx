import { View, AppState, Alert, ScrollView } from 'react-native'
import React from 'react'
import { supabase } from '@/lib/supabase'
import { Input } from '@rneui/themed'
import CustomButton from './CustomButton'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link } from 'expo-router'

AppState.addEventListener('change', (state) => {
  console.log('AppState', state)
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh
  }
})

const Auth = () => {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const signInWithEmail = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    })
    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  const signUpWithEmail = async () => {
    setLoading(true)
    const {
      data: { session },
      error
    } = await supabase.auth.signUp({
      email: email,
      password: password
    })
    if (error) Alert.alert(error.message)
    if (!session) Alert.alert('Check your email for the confirmation link')
    setLoading(false)
  }

  return (
    <SafeAreaView className='h-full'>
      <ScrollView>
        <View className='w-full justify-center min-h-[83vh] px-4 my-6'>
          <Input
            label="メールアドレス"
            leftIcon={{ type: 'font-awesome', name: 'envelope' }}
            value={email}
            onChangeText={(text) => setEmail(text)}
            placeholder="email@address.com"
            autoCapitalize={'none'}
          />
          <Input
            label="パスワード"
            leftIcon={{ type: 'font-awesome', name: 'lock' }}
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            placeholder="Password"
            autoCapitalize={'none'}
          />
          <CustomButton
            title="ログイン"
            handlePress={() => signInWithEmail()}
            isLoading={loading}
            containerStyle='mt-7'
          />
          <View className='justify-center pt-5 flex-row pag-2'>          
            <Link href='/signup'>新規登録はこちら</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Auth