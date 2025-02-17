import { DAY_OF_WEEK } from "@/constants/common";
import { isEverydayChecked } from "@/lib/utils";
import { Task } from "@/types";
import { useEffect, useState } from "react";

// フォームの状態・バリデーション・入力変更ロジックを管理するカスタムフック
export const useForm = (mode: 'create' | 'edit', initialTask?: Task | null) => {
  const [formData, setFormData] = useState({
    title: '', 
    goal: '',
  })
  const [time, setTime] = useState('')
  const [selectedDays, setSelectedDays] = useState<string[]>([])
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

  const toggleSwitch = () => {
    const nextState = !isEveryday
    setSelectedDays(nextState ? DAY_OF_WEEK : [])
    setIsEveryday(nextState)
  }

  const toggleDays = (day: string) => {
    setSelectedDays(prev => {
      const updated = prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
      const isSelectedAll = isEverydayChecked(updated)
      setIsEveryday(isSelectedAll)
      return updated
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
    toggleSwitch,
    toggleDays,
  }
}