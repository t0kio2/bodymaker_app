import { DAY_OF_WEEK } from "@/constants/common"

export const getDaysOfWeek = (dayNumber: number) => {
  if (dayNumber < 0 || dayNumber > 6) {
    throw new Error('Invalid day number. Must be between 0 and 6')
  }
  return DAY_OF_WEEK[dayNumber]
}