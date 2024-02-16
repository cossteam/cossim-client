import { Device } from '@capacitor/device'

/**
 * 判断当前平台
 * 
 * @returns  
 */
export const platform = async () => (await Device.getInfo()).platform
