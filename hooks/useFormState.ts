import { useEffect, useState, useCallback } from "react"
import { DAY_OF_WEEK_BIT } from "@/constants/common"
import { allDaysMask, getCurrentTimeStr, toggleDays, formatDateToYYYYMMDD } from "@/lib/utils"
import { TaskWithSchedule } from "@/types"

/**
 * Form state management hook
 * Handles form state, validation, and input changes
 */
export const useFormState = (mode: 'create' | 'edit', initialTask?: TaskWithSchedule | null) => {
  const [formData, setFormData] = useState<TaskWithSchedule>({
    id: '',
    title: '', 
    goal: '',
    start_date: formatDateToYYYYMMDD(new Date()),
    bitmask_days: 0,
    time: '',
    is_push_notification: false,
    notification_offset: 60,
  })
  
  const [timeStr, setTimeStr] = useState(getCurrentTimeStr())
  const [selectedDays, setSelectedDays] = useState(0)
  const [isEveryday, setIsEveryday] = useState(false)
  const [pushNotification, setPushNotification] = useState(true)
  const [notificationOffset, setNotificationOffset] = useState(60)
  const [validationError, setValidationError] = useState<string>('')

  useEffect(() => {
    if (mode === 'edit' && initialTask) {
      setFormData({
        id: initialTask.id,
        title: initialTask.title,
        goal: initialTask.goal || '',
        start_date: formatDateToYYYYMMDD(new Date(initialTask.start_date)),
        bitmask_days: initialTask.bitmask_days,
        time: initialTask.time,
        is_push_notification: initialTask.is_push_notification,
        notification_offset: initialTask.notification_offset || 60,
      })
      setSelectedDays(initialTask.bitmask_days)
      setTimeStr(initialTask.time)
      setPushNotification(!!initialTask.is_push_notification)
      setNotificationOffset(initialTask.notification_offset || 60)
    }
  }, [mode, initialTask])

  /**
   * Handle form field changes
   */
  const handleChange = useCallback((field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  /**
   * Validate form fields
   */
  const validateForm = useCallback((): string => {
    if (!formData.title) {
      return 'タイトルを入力してください'
    }
    if (!timeStr) {
      return '時間を入力してください'
    }
    if (!selectedDays) {
      return '曜日を選択してください'
    }
    return ''
  }, [formData.title, timeStr, selectedDays])

  /**
   * Toggle all days selection
   */
  const selectAllDays = useCallback(() => {
    setIsEveryday(prev => {
      const nextState = !prev
      setSelectedDays(nextState ?
        Object.values(DAY_OF_WEEK_BIT.ja).reduce((acc, bit) => acc | bit, 0) :
        0
      )
      return nextState
    })
  }, [])

  /**
   * Toggle individual day selection
   */
  const handleToggleDays = useCallback((day: number) => {
    setSelectedDays(prev => {
      const updatedDays = toggleDays(prev, day)
      setIsEveryday(updatedDays === allDaysMask)
      return updatedDays
    })
  }, [])

  /**
   * Get final form data for submission
   */
  const getSubmitData = useCallback(() => {
    const error = validateForm()
    setValidationError(error)
    
    if (error) {
      return null
    }
    
    const taskData = {
      ...formData,
      is_push_notification: pushNotification,
      notification_offset: notificationOffset,
    }
    
    const scheduleData = {
      bitmask_days: selectedDays,
      time: timeStr,
    }
    
    return {
      task: taskData,
      schedule: scheduleData,
    }
  }, [formData, pushNotification, notificationOffset, selectedDays, timeStr, validateForm])

  return {
    formData,
    timeStr,
    selectedDays,
    isEveryday,
    pushNotification,
    notificationOffset,
    validationError,
    setTimeStr,
    setPushNotification,
    setNotificationOffset,
    handleChange,
    validateForm,
    selectAllDays,
    handleToggleDays,
    getSubmitData,
  }
}
