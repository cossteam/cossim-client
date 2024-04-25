import { Device } from '@capacitor/device'

/**
 * 判断是否是 web 平台
 *
 * @returns
 */
export const isWeb = async () => {
	const platform = await Device.getInfo()
	return platform.platform === 'web'
}
