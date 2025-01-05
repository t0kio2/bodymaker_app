import { Item } from '@/types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Notifications from 'expo-notifications'


export const requestPermissionAsync = async () => {
  const { granted } = await Notifications.getPermissionsAsync()
  if (granted) return
  await Notifications.requestPermissionsAsync()
}

export const registerPushNotification = async () => {
  const itemsStr = await AsyncStorage.getItem('items')
  const items = itemsStr ? JSON.parse(itemsStr) : []

  items.forEach((item: any) => {
    item.schedule.recurring.forEach((weekday: number) => {
      schedulePushNotification(item, weekday)
    })
  })
}

const schedulePushNotification = async (item: Item, weekday: number) => {
  const [hour, minute] = item.schedule.time.split(':').map(Number)

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `${item.title}の時間です`,
      body: '時間です！行動を始めましょう！',
    },
    trigger: {
      weekday,
      hour,
      minute,
      repeats: true
    }
  })
}

const notificationHandler = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => {
      return {
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true
      }
    }
  })
}