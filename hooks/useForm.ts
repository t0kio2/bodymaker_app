import { DAY_OF_WEEK_BIT } from "@/constants/common";
import { allDaysMask, toggleDays } from "@/lib/utils";
import { TaskWithSchedule } from "@/types";
import { useEffect, useState } from "react";

// フォームの状態・バリデーション・入力変更ロジックを管理するカスタムフック
export const useForm = (mode: 'create' | 'edit', initialTask?: TaskWithSchedule | null) => {
  const [formData, setFormData] = useState<TaskWithSchedule>({
    id: '',
    title: '', 
    goal: '',
    start_date: new Date(),
    bitmask_days: 0,
    time: '',
    is_push_notification: false,
  })
  const [time, setTime] = useState('')
  const [selectedDays, setSelectedDays] = useState(0)
  const [isEveryday, setIsEveryday] = useState(false)
  const [pushNotification, setPushNotification] = useState(true)
  const [errors, setErrors] = useState<any>({})

  useEffect(() => {
    if (mode === 'edit' && initialTask) {
      setFormData({
        id: initialTask.id,
        title: initialTask.title,
        goal: initialTask.goal,
        start_date: new Date(initialTask.start_date),
        bitmask_days: initialTask.bitmask_days,
        time: initialTask.time,
        is_push_notification: initialTask.is_push_notification
      })
      setSelectedDays(initialTask.bitmask_days)
      setTime(initialTask.time)
      setPushNotification(initialTask.is_push_notification)
    }
  }, [mode, initialTask])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    if (!formData.title) {
      setErrors({ message: 'タイトルを入力してください'})
      return false
    }
    // if (!formData.goal) {
    //   setErrors({ message: '目標を入力してください'})
    //   return false
    // }
    if (!time) {
      setErrors({ message: '時間を入力してください'})
      return false
    }
    if (!selectedDays) {
      setErrors({ message: '曜日を選択してください'})
      return false
    }
    return true
  }

  const selectAllDays = () => {
    setIsEveryday(prev => {
      const nextState = !prev
      setSelectedDays(nextState ?
        Object.values(DAY_OF_WEEK_BIT.ja).reduce((acc, bit) => acc | bit, 0) :
        0
      )
      return nextState
    })
  }

  const handleToggleDays = (day: number) => {
    setSelectedDays(prev => {
      const updateDays = toggleDays(prev, day)
      setIsEveryday(updateDays === allDaysMask)
      return updateDays
    })
  }

  return {
    formData,
    time,
    selectedDays,
    isEveryday,
    pushNotification,
    errors,
    setTime,
    setPushNotification,
    handleChange,
    validateForm,
    selectAllDays,
    handleToggleDays
  }
}