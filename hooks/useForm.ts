import { DAY_OF_WEEK_BIT } from "@/constants/common";
import { toggleDays } from "@/lib/utils";
import { Task } from "@/types";
import { useEffect, useState } from "react";

// フォームの状態・バリデーション・入力変更ロジックを管理するカスタムフック
export const useForm = (mode: 'create' | 'edit', initialTask?: Task | null) => {
  const [formData, setFormData] = useState({
    title: '', 
    goal: '',
  })
  const [time, setTime] = useState('')
  const [selectedDays, setSelectedDays] = useState(0)
  const [isEveryday, setIsEveryday] = useState(false)
  const [pushNotification, setPushNotification] = useState(true)
  const [errors, setErrors] = useState<any>({ title: '', vide: '' })

  useEffect(() => {
    if (mode === 'edit' && initialTask) {
      setFormData({
        title: initialTask.title,
        goal: initialTask.goal,
      })
      // setSelectedDays(initialTask.schedule.recurring.map((day: number) => DAY_OF_WEEK[day]))
      // setIsEveryday(isEverydayChecked(initialTask.schedule.recurring))
    }
  }, [mode, initialTask])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    if (!formData.title) {
      setErrors({ title: 'タイトルを入力してください'})
      return false
    }
    return true
  }

  const selectAllDays = () => {
    setIsEveryday(prev => {
      const nextState = !prev
      setSelectedDays(nextState ?
        Object.values(DAY_OF_WEEK_BIT).reduce((acc, bit) => acc | bit, 0) :
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

  const allDaysMask = Object.values(DAY_OF_WEEK_BIT).reduce((acc, bit) => acc | bit, 0)

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