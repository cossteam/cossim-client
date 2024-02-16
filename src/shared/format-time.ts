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
export const formatTime = (time: number | string) => {
	const timestamp = typeof time === 'string' ? Date.parse(time) : time
	const now = Date.now()
	const diff = now - timestamp

	if (diff < 60 * 1000) {
		return $t('刚刚')
	} else if (diff < 60 * 60 * 1000) {
		return `${Math.floor(diff / (60 * 1000))}${$t('分钟前')}`
	} else if (diff < 24 * 60 * 60 * 1000) {
		return `${Math.floor(diff / (60 * 60 * 1000))}${$t('小时前')}`
	} else if (diff < 365 * 24 * 60 * 60 * 1000) {
		return dayjs(timestamp).format(`M${$t('月')}D${$t('日')}`)
	} else {
		return dayjs(timestamp).format(`YYYY${$t('年')}M${$t('月')}D${$t('日')}`)
	}
}
