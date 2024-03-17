/**
 * 设置页面字体大小
 *
 * @param designSize   页面设计尺寸
 */
export default function postCssToRem(designSize: number = 1920) {
	let tid: NodeJS.Timeout | number

	const refreshRem = () => {
		const html = document.documentElement
		const wW = html.clientWidth > 1920 ? 1920 : html.clientWidth
		const rem = (wW * 100) / designSize
		document.documentElement.style.fontSize = rem + 'px'
	}

	const handlerWindowResize = () => {
		clearTimeout(tid)
		tid = setTimeout(refreshRem, 1000)
	}

	const handlerPageShow = (e: PageTransitionEvent) => {
		if (e.persisted) {
			clearTimeout(tid)
			tid = setTimeout(refreshRem, 1000)
		}
	}

	window.addEventListener('resize', handlerWindowResize, false)
	window.addEventListener('pageshow', handlerPageShow, false)
	refreshRem()
}
