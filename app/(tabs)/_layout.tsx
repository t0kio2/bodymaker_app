import { Alert, Text, TouchableOpacity, } from 'react-native'
import { Tabs } from 'expo-router'
import Icon from 'react-native-vector-icons/FontAwesome5'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { formattedDate } from '@/lib/utils'
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
          name='calendar'
          options={{
            title: formattedDate(),
            headerShown: true,
            headerShadowVisible: false,
            tabBarIcon: ({ color, focused }) => (
              <Icon name='calendar' size={20} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name='list'
          options={{
            title: 'トレーニング一覧',
            headerShown: true,
            headerShadowVisible: false,
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons name='format-list-bulleted-square' size={25} color={color} />
            ),
            headerRight: () => (
              <TouchableOpacity
                onPress={async () => {
                  const notice = await Notifications.getAllScheduledNotificationsAsync()
                  // Alert.alert('通知予約', JSON.stringify(notice
                  //   .map((n) => ({
                  //     id: n.identifier,
                  //     content: n.content.title,
                  //     scheduled: n?.trigger?.date,
                  //   }))
                  // ))
                  Alert.alert('通知予約', JSON.stringify(notice))
                }}
                className="mr-4"
              >
                <Text>プッシュ通知内容</Text>
              </TouchableOpacity>
            ),
          }}
        />
        <Tabs.Screen
          name='report'
          options={{
            title: 'Report',
            headerShown: true,
            headerShadowVisible: false,
            tabBarIcon: ({ color, focused }) => (
              <MaterialIcons name='insert-chart' size={25} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  )
}

export default TabLayout
