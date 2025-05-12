import React from 'react'
import { Alert, Text, TouchableOpacity } from 'react-native'
import { Tabs } from 'expo-router'
import Icon from 'react-native-vector-icons/FontAwesome5'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import * as Notifications from 'expo-notifications'

const TabLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#3A4B5E', // 濃い青灰色
          tabBarInactiveTintColor: '#8C97A8', // 濃い灰色
          tabBarStyle: {
            backgroundColor: '#F7F9FC',
            borderTopWidth: 1,
            borderTopColor: '#E0E6ED',
            height: 60,
            paddingVertical: 8,
          },
          headerStyle: {
            backgroundColor: '#F7F9FC',
          },
          headerTitleStyle: {
            color: '#333333',
          },
        }}
      >
        <Tabs.Screen
          name='calendar'
          options={{
            title: 'カレンダー',
            headerShown: true,
            headerShadowVisible: false,
            headerTitleStyle: {
              color: '#496279',
            },
            tabBarIcon: ({ color }) => (
              <Icon name='calendar-alt' size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name='list'
          options={{
            title: 'スケジュール',
            headerShown: true,
            headerShadowVisible: false,
            headerTitleStyle: {
              color: '#496279',
            },
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name='format-list-checkbox'
                size={25}
                color={color}
              />
            ),
            headerRight: () => (
              <TouchableOpacity
                onPress={async () => {
                  const notice = await Notifications.getAllScheduledNotificationsAsync()
                  Alert.alert('通知予約', JSON.stringify(notice))
                }}
                className="mr-4 px-2 py-1"
              >
                <Text className="text-[#6C8BA7]">通知内容</Text>
              </TouchableOpacity>
            ),
          }}
        />
        <Tabs.Screen
          name='report'
          options={{
            title: 'レポート',
            headerShown: true,
            headerShadowVisible: false,
            headerTitleStyle: {
              color: '#496279',
            },
            tabBarIcon: ({ color }) => (
              <MaterialIcons name='insert-chart-outlined' size={25} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  )
}

export default TabLayout
