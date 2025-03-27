import { useDatabase } from '@/hooks/useDatabase';
import { Schedule, TaskWithSchedule } from '@/types';
import * as Notifications from 'expo-notifications'
import { subMinutes } from 'date-fns'
import { SchedulableTriggerInputTypes } from 'expo-notifications'

const bitmaskToWeekDays = (bitmask: number) => {
  const days = []
  for (let i = 0; i < 7; i++) {
    if ((bitmask >> i) & 1) {
      days.push(i)
    }
  }
  return days
}

export const scheduleNotification = async (task: TaskWithSchedule, schedule: any, nextDateTime: any) => {
  const weekdays = bitmaskToWeekDays(schedule.bitmask_days)
  const { hour, minute} = getNotificationTimeBefore(schedule.time, 60)

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
      scheduled_at: nextDateTime.toDate()
    })

    notificationIds.push(notificationId)
  }
  return notificationIds
}

const saveScheduledNotification = async ({
  task_id,
  task_schedule_id,
  notification_id,
  scheduled_weekday,
  scheduled_hour,
  scheduled_minute,
  scheduled_at
}: any) => {
  const { db } = useDatabase()
  await db.execAsync(`
    INSERT INTO scheduled_notifications (
      task_id,
      task_schedule_id,
      notification_id,
      scheduled_weekday,
      scheduled_hour,
      scheduled_minute,
      scheduled_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?);
  `, [
      task_id,
      task_schedule_id,
      notification_id,
      scheduled_weekday,
      scheduled_hour,
      scheduled_minute,
      scheduled_at
    ])
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

export const getNotificationTimeBefore = (time: string, offsetMinutes = 60) => {
  const [hour, minute] = time.split(':').map(Number)
  const baseDate = new Date()
  baseDate.setHours(hour, minute, 0, 0)

  const adjustedDate = subMinutes(baseDate, offsetMinutes)

  return {
    hour: adjustedDate.getHours(),
    minute: adjustedDate.getMinutes()
  }
}