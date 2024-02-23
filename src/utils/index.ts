import { Device } from '@capacitor/device'

/**
 * 判断当前平台
 * 
 * @returns  
 */
export const platform = async () => (await Device.getInfo()).platform

/**
 * 判断是否是 web 平台 且是移动端
 * 
 * @returns
 */
export const isWebDevice = async () =>  {
    const platform = await Device.getInfo()
    return platform.platform === 'web' && ['ios','android'].includes(platform.operatingSystem)
}