import { useDatabase } from '@/hooks/useDatabase';
import { TaskWithSchedule } from '@/types';
import * as Notifications from 'expo-notifications'

export const scheduleNotification = async (task: TaskWithSchedule, schedule: any, nextDateTime: any) => {
  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: task.title,
      body: task.title,
    },
    trigger: nextDateTime.toDate()
  })
  // dbに通知予約を保存

  await saveScheduledNotification({
    task_id: task.id,
    task_schedule_id: schedule.id,
    notification_id: notificationId,
    scheduled_at: nextDateTime.toDate()
  })
}

const saveScheduledNotification = async ({ task_id, task_schedule_id, notification_id, scheduled_at }: any) => {
  const { db } = useDatabase()
  await db.execAsync(`
    INSERT INTO scheduled_notifications (
      task_id, task_schedule_id, notification_id, scheduled_at
    )
    VALUES (?, ?, ?, ?);
  `, [task_id, task_schedule_id, notification_id, scheduled_at])
}

export const cancelScheduledNotification = async (notificationId: any) => {
  const { db } = useDatabase()
  await Notifications.cancelScheduledNotificationAsync(notificationId)

  await db.execAsync(`
    DELETE FROM scheduled_notifications
    WHERE notification_id = ?;
  `, [notificationId])
}