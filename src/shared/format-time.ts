import dayjs from 'dayjs'
import { $t } from './i18n'

/**
 * 格式化时间
 *
 * @param time  时间戳或者时间字符串
 * @example
 * formatTime(1707754188414)    // 刚刚
 * formatTime(1707754188410)    // 一分钟前
 * formatTime(1707754188210)    // 三分钟前
 * formatTime(1707754148210)    // 12:00
 * formatTime(1707754148210)    // 昨天 11:00
 * formatTime(1707704148210)    // 2月11日
 * formatTime(1507704148210)    // 2023年2月11日
 */
export const formatTime = (time: number | string): string => {
	const targetTime = dayjs(time)
	const currentTime = dayjs()
	// 获取当天的0点
	const startTime = currentTime.startOf('day')
	// 获取昨天点0点
	const beforeYestTime = currentTime.subtract(1, 'day').startOf('day')
	const difference = currentTime.diff(targetTime, 'minute') // 相差几分钟
	if (difference < 1) {
		return $t('刚刚')
	} else if (targetTime > startTime) {
		return dayjs(time).format('HH:mm')
	} else if (targetTime < startTime) {
		return $t('昨天') + ' ' + dayjs(time).format('HH:mm')
	} else if (targetTime < beforeYestTime) {
		return $t('前天') + ' ' + dayjs(time).format('HH:mm')
	} else if (difference < 60 * 24 * 7) {
		return dayjs(time).format('MM-DD HH:mm')
	} else if (difference < 60 * 24 * 30) {
		return dayjs(time).format('MM-DD')
	} else {
		return dayjs(time).format('YYYY-MM-DD')
	}
}

export const formatDialogListTime = (time: string): string => {
	const targetTime = dayjs(time)
	const currentTime = dayjs()
	// 获取当天的0点
	const startTime = currentTime.startOf('day')
	// 获取昨天点0点
	const beforeYestTime = currentTime.subtract(1, 'day').startOf('day')
	const difference = currentTime.diff(targetTime, 'minute') // 相差几分钟
	if (difference < 1) {
		return $t('刚刚')
	} else if (targetTime > startTime) {
		return dayjs(time).format('HH:mm')
	} else if (targetTime < startTime) {
		return $t('昨天') + ' ' + dayjs(time).format('HH:mm')
	} else if (targetTime < beforeYestTime) {
		return $t('前天') + ' ' + dayjs(time).format('HH:mm')
	} else if (difference < 60 * 24 * 7) {
		return dayjs(time).format('MM-DD')
	} else if (difference < 60 * 24 * 30) {
		return dayjs(time).format('MM-DD')
	} else {
		return dayjs(time).format('YYYY-MM-DD')
	}
}

/**
 * 格式完整时间格式 YYYY-MM-DD HH:mm
 * @param time
 */
export const formatTimeFull = (time: number | string): string => {
	return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}