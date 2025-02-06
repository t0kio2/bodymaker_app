import { Task, Notification } from '@/types'
// import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Notifications from 'expo-notifications'


export const requestPermissionAsync = async () => {
  const { granted } = await Notifications.getPermissionsAsync()
  if (granted) return
  await Notifications.requestPermissionsAsync()
}

export const registerNotification = async (task :Task) => {
  console.log('通知登録', task)
  const [hour, minute] = task.schedule.time.split(':').map(Number)
  // 通知のスケジュール登録
  const notificationIds = await Promise.all(
    task.schedule.recurring.map(async (weekday: number) => {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `${task.title}の時間です`,
          body: '時間です！行動を始めましょう！',
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
          weekday,
          hour,
          minute,
          repeats: true
        }
      })
      return notificationId
    })
  )
  // 通知IDを保存
  // const notificationsStr = await AsyncStorage.getTask('notifications')
  // const notificationsStore = notificationsStr ? JSON.parse(notificationsStr) : []
  // notificationIds.forEach(async (notificationId) => {
  //   const notification = {
  //     id: notificationId,
  //     taskId: task.id
  //   } as Notification
  //   await AsyncStorage.setTask(
  //     'notifications',
  //     JSON.stringify([...notificationsStore, notification])
  //   )
    
  // })
}

export const deleteNotificationById = async (taskId: string) => {
  // try {
  //   const notificationsStr = await AsyncStorage.getTask('notifications')
  //   const notifications = notificationsStr ? JSON.parse(notificationsStr) : []
  //   const notificationIds = notifications.map(async (notification: Notification) => {
  //     // 通知のキャンセル
  //     if (notification.taskId === taskId) {
  //       await Notifications.cancelScheduledNotificationAsync(notification.id)
  //       return notification.id
  //     }
  //   })
  //   const updatedNotifications = notifications.filter((notification: Notification) => notification.taskId !== taskId)
  //   await AsyncStorage.setTask('notifications', JSON.stringify(updatedNotifications))

  // } catch (error) {
  //   throw new Error('通知のキャンセルに失敗しました') 
  // }
}

export const getAllSchedule = async () => {
  const schedules = await Notifications.getAllScheduledNotificationsAsync()
  const trigger = schedules.map((schedule) => {
    return schedule.trigger
  })
  console.log('スケジュールされた通知', trigger)
  return trigger
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