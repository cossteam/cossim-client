/**
 * 判断是否是 web 平台 且是移动端
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

	// 横屏情况
	if (screen_width < screen_height) {
		mobile_flag = false
	}

	return mobile_flag
}
