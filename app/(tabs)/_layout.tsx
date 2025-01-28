import { Alert, Text, TouchableOpacity, } from 'react-native'
import { Tabs } from 'expo-router'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { getAllSchedule } from '@/lib/pushNotification'
import * as Notifications from 'expo-notifications'

const TabLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#FFA001',
          tabBarInactiveTintColor: '#CDCDE0',
          tabBarStyle: {
            backgroundColor: '#161622',
            borderTopWidth: 1,
            borderTopColor: '#232533',
            height: 60,
            paddingTop: 10
          }
        }}
      >
        <Tabs.Screen
          name='home'
          options={({ route }) => ({
            title: route.params?.title || 'Home',
            headerShown: true,
            tabBarIcon: ({ color, focused }) => (
              <Icon name='home' size={20} color={color} />
            ),
            headerRight: () => (
              <TouchableOpacity
                onPress={async () => {
                  const schedule = await getAllSchedule()
                  Alert.alert('Schedule', JSON.stringify(schedule))
                }}
                className="mr-4"
              >
                <Text>show push</Text>
              </TouchableOpacity>
            ),
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => {
                  Notifications.cancelAllScheduledNotificationsAsync()
                }}
                className="ml-4"
              >
                <Text>delete push</Text>
              </TouchableOpacity>
            ),
          })}
        />
        <Tabs.Screen
          name='calendar'
          options={({ route }) => ({
            title: route.params?.title || 'Calendar',
            headerShown: true,
            tabBarIcon: ({ color, focused }) => (
              <Icon name='calendar' size={20} color={color} />
            ),
          })}
        />
      </Tabs>
    </>
  )
}

export default TabLayout
