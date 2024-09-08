import { type ClassValue, clsx } from 'clsx'
import { md5 } from 'js-md5'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function deepClone<T>(obj: T): T {
    if (obj === null || obj === undefined) {
        return obj
    }

    if (typeof obj !== 'object') {
        return obj
    }

    if (obj instanceof Date) {
        return new Date(obj.getTime()) as T
    }

    if (Array.isArray(obj)) {
        return obj.map((item) => deepClone(item)) as unknown as T
    }

    if (obj instanceof Object) {
        const copy = {} as { [key: string]: any }
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                copy[key] = deepClone(obj[key])
            }
        }
        return copy as T
    }

    throw new Error("Unable to copy object! Its type isn't supported.")
}

export function createFingerprint() {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    ctx?.fillRect(0, 0, 0, 10)
    const data = canvas.toDataURL()
    canvas.remove()
    return md5(data)
}
