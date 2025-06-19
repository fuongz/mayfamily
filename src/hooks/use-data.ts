import { CONFIG } from '@/constants/data'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

export const useData = () => {
  const currentDate = dayjs().tz('Asia/Ho_Chi_Minh')
  const side = Object.values(CONFIG).find((side) => {
    return dayjs(side.countdown).isAfter(currentDate)
  })
  return {
    side,
  }
}
