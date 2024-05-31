import { $t } from '@/i18n'

/**
 * 格式化时间，把传入的时间戳转为最近时间
 * @example
 * formatTime(1000000000000) => 昨天
 * formatTime(2435435646546) => 11:12
 * formatTime(1243455467567) => 星期一
 * formatTime(1243455469567) => 星期日
 * formatTime(1243455467367) => 2024/05/02
 * formatTime(2434554674367) => 2024/12/02
 */
export function formatTime(timestamp: number): string {
  const now = Date.now()
  const date = new Date(timestamp)
  const today = new Date(now)

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    )
  }

  const isYesterday = (d: Date) => {
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)
    return isSameDay(d, yesterday)
  }

  const getWeekDay = (d: Date) => {
    const days = [
      $t('星期日'),
      $t('星期一'),
      $t('星期二'),
      $t('星期三'),
      $t('星期四'),
      $t('星期五'),
      $t('星期六')
    ]
    return days[d.getDay()]
  }

  const formatDate = (d: Date) => {
    const year = d.getFullYear()
    const month = (d.getMonth() + 1).toString().padStart(2, '0')
    const day = d.getDate().toString().padStart(2, '0')
    return `${year}/${month}/${day}`
  }

  if (isSameDay(date, today)) {
    // 'HH:MM'
    return date.toTimeString().slice(0, 5)
  }
  if (isYesterday(date)) {
    return '昨天'
  }

  if (date.getTime() > today.getTime() - today.getDay() * 86400000) {
    return getWeekDay(date)
  }
  return formatDate(date)

  // if (isSameDay(date, today)) {
  // 	const hours = date.getHours().toString().padStart(2, '0')
  // 	const minutes = date.getMinutes().toString().padStart(2, '0')
  // 	return `${hours}:${minutes}`
  // } else if (isYesterday(date)) {
  // 	return '昨天'
  // } else if (date.getTime() > today.getTime() - today.getDay() * 86400000) {
  // 	return getWeekDay(date)
  // } else {
  // 	const year = date.getFullYear()
  // 	const month = (date.getMonth() + 1).toString().padStart(2, '0')
  // 	const day = date.getDate().toString().padStart(2, '0')
  // 	return `${year}/${month}/${day}`
  // }
}
