/**
 * @description 小驼峰转换为横线连接
 * @param str
 */
export function toLine(str: string) {
	return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}

/**
 * @description 是否是手机端
 * 
 * @returns 
 */
export const isMobile = () => {
	const userAgentInfo = navigator.userAgent
	const mobileAgents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']

	let mobile_flag = false

	//根据userAgent判断是否是手机
	for (let v = 0; v < mobileAgents.length; v++) {
		if (userAgentInfo.indexOf(mobileAgents[v]) > 0) {
			mobile_flag = true
			break
		}
	}

	const screen_width = window.screen.width
	const screen_height = window.screen.height

	//根据屏幕分辨率判断是否是手机
	if (screen_width > 325 && screen_height < 750) {
		mobile_flag = true
	}

	return mobile_flag
}
