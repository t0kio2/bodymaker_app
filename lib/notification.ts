import { useDatabase } from '@/hooks/useDatabase';
import { Task } from '@/types';
import * as Notifications from 'expo-notifications'
import { subMinutes } from 'date-fns'
import { SchedulableTriggerInputTypes } from 'expo-notifications'

export const scheduleNotification = async (task: Task, schedule: any) => {
  const weekdays = bitmaskToWeekDays(schedule.bitmask_days)
  
  const { hour, minute} = getNotificationTimeBefore(schedule.time, task.notification_offset || 60)

  const notificationIds = []

  for (const weekday of weekdays) {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: task.title,
        body: task.title,
        data: { taskId: task.id },
      },
      trigger: {
        type: SchedulableTriggerInputTypes.WEEKLY,
        weekday: weekday + 1, // Expoは日曜日が1から始まるため
        hour,
        minute,
      }
    })
    // dbに通知予約を保存
    await saveScheduledNotification({
      task_id: task.id,
      task_schedule_id: schedule.id,
      notification_id: notificationId,
      scheduled_weekday: weekday,
      scheduled_hour: hour,
      scheduled_minute: minute,
    })

    notificationIds.push(notificationId)
  }
  return notificationIds
}

export const cancelScheduledNotification = async (notificationId: any) => {
  const { db } = useDatabase()
  await Notifications.cancelScheduledNotificationAsync(notificationId)

  await db.execAsync(`
    DELETE FROM scheduled_notifications
    WHERE notification_id = ?;
  `, [notificationId])
}

export const requestPermissionAsync = async () => {
  const { granted } = await Notifications.getPermissionsAsync()
  if (granted) return
  await Notifications.requestPermissionsAsync()
}

const saveScheduledNotification = async ({
  task_id,
  task_schedule_id,
  notification_id,
  scheduled_weekday,
  scheduled_hour,
  scheduled_minute,
}: any) => {
  const { db } = useDatabase()
  await db.runAsync(`
    INSERT INTO scheduled_notifications (
      task_id,
      task_schedule_id,
      notification_id,
      scheduled_weekday,
      scheduled_hour,
      scheduled_minute
    )
    VALUES (?, ?, ?, ?, ?, ?);
  `, [
      task_id,
      task_schedule_id,
      notification_id,
      scheduled_weekday,
      scheduled_hour,
      scheduled_minute,
    ])
}

const bitmaskToWeekDays = (bitmask: number) => {
  const days = []
  for (let i = 0; i < 7; i++) {
    if ((bitmask >> i) & 1) {
      days.push(i)
    }
  }
  return days
}

const getNotificationTimeBefore = (time: string, offsetMinutes = 60) => {
  const [hour, minute] = time.split(':').map(Number)
  const baseDate = new Date()
  baseDate.setHours(hour, minute, 0, 0)

  const adjustedDate = subMinutes(baseDate, offsetMinutes)

  return {
    hour: adjustedDate.getHours(),
    minute: adjustedDate.getMinutes()
  }
}
