import { type ClassValue, clsx } from 'clsx'
import { md5 } from 'js-md5'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * 创建指纹
 *
 * @returns {string}
 */
export function createFingerprint() {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    ctx?.fillRect(0, 0, 0, 10)
    const data = canvas.toDataURL()
    canvas.remove()
    return md5(data)
}

/**
 * 传入时间戳，返回格式化后的时间字符串
 * @param timestamp 时间戳
 */
export function formatDate(timestamp: number) {
    const date = new Date(timestamp)
    return `${date.getHours()}:${date.getMinutes()}`
}

/**
 * 通过浏览器内核判断是否为移动端
 * @returns {boolean}
 */
export function isMobile() {
    const ua = navigator.userAgent
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)
}

/**
 * 根据每个对象的“group”属性将对象数组转换为组。
 *
 * @param {any[]} array -对象的输入数组
 * @return {Object} 一个对象，其中键是组名称，值是属于每个组的对象数组
 */
export const arrayToGroups = (array: any[]) => {
    array = !Array.isArray(array) ? [] : array
    array = array.filter((v) => v.group)
    return array.reduce((result, user) => {
        const group = user.group
        if (!group) return result
        if (!result[group]) result[group] = []
        result[group].push(user)
        return result
    }, {})
}

/**
 * 将组对象转换为对象数组。
 *
 * @param {Object} groups -对象的输入数组
 * @return {any[]} 一个对象数组
 */
export const groupsToArray = (groups: any): any[] => {
    return Object.entries(groups).reduce((result, [key, value]) => {
        // @ts-ignore
        const list = value.map((v) => ({ ...v, group: key }))
        // @ts-ignore
        return result.concat(list)
    }, [])
}
