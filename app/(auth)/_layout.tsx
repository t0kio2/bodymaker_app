import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const AuthLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="signin"
          options={{
            title: 'ログイン',
            // headerShown: false
          }}
        />
        <Stack.Screen
          name="signup"
          options={{ title: '新規登録' }}
        />
      </Stack>
    </>
  )
}

export default AuthLayout