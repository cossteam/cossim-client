import { type ClassValue, clsx } from 'clsx'
import { md5 } from 'js-md5'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * 深拷贝对象

 * @param value     克隆对象
 * @param seen      循环引用缓存
 * @returns 
 */
export function deepClone<T>(value: T, seen = new WeakMap<object, any>()): T {
    // 处理原始值、null 和 undefined
    if (value === null || typeof value !== 'object') {
        return value
    }

    // 检查循环引用
    if (seen.has(value as object)) {
        return seen.get(value as object)
    }

    // 处理 Date 对象
    if (value instanceof Date) {
        return new Date(value.getTime()) as any
    }

    // 处理 RegExp 对象
    if (value instanceof RegExp) {
        return new RegExp(value.source, value.flags) as any
    }

    // 处理 Map 对象
    if (value instanceof Map) {
        const mapCopy = new Map()
        seen.set(value, mapCopy) // 缓存克隆结果，防止循环引用
        value.forEach((val, key) => {
            mapCopy.set(deepClone(key, seen), deepClone(val, seen))
        })
        return mapCopy as any
    }

    // 处理 Set 对象
    if (value instanceof Set) {
        const setCopy = new Set()
        seen.set(value, setCopy) // 缓存克隆结果，防止循环引用
        value.forEach((val) => {
            setCopy.add(deepClone(val, seen))
        })
        return setCopy as any
    }

    // 处理数组
    if (Array.isArray(value)) {
        const arrCopy: any[] = []
        seen.set(value, arrCopy) // 缓存克隆结果，防止循环引用
        value.forEach((item) => {
            arrCopy.push(deepClone(item, seen))
        })
        return arrCopy as T
    }

    // 处理普通对象
    const objCopy = Object.create(Object.getPrototypeOf(value))
    seen.set(value, objCopy) // 缓存克隆结果，防止循环引用
    Object.keys(value).forEach((key) => {
        objCopy[key] = deepClone((value as { [key: string]: any })[key], seen)
    })
    return objCopy as T
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
