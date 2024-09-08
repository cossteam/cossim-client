import { md5 } from 'js-md5'

export const createFingerprint = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    ctx?.fillRect(0, 0, 0, 10)
    const data = canvas.toDataURL()
    canvas.remove()
    return md5(data)
}
