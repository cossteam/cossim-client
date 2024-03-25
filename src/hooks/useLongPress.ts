import { useCallback, useEffect, useRef } from 'react'

interface LongPressOptions {
	callback?: (data: any) => void
	delay?: number
	data?: any
}

const useLongPress = (el: HTMLElement | null, options?: LongPressOptions) => {
	const timerRef = useRef<NodeJS.Timeout | null>(null)
	const scrollingRef = useRef<boolean>(false)

	const handleTouchStart = () => {
		scrollingRef.current = false
		timerRef.current = setTimeout(() => {
			if (!scrollingRef.current) {
				options?.callback && options?.callback(options?.data)
				clearTimer()
			}
		}, options?.delay ?? 300)
	}

	// 移动时需要把长按事件取消
	const handleScroll = () => {
		scrollingRef.current = true
		clearTimer()
	}

	const handleContextmenu = (e: Event) => e.preventDefault()

	const clearTimer = useCallback(() => {
		if (timerRef.current) {
			clearTimeout(timerRef.current)
		}
	}, [timerRef])

	useEffect(() => {
		if (!el) return
		console.log('e', el)
		el?.addEventListener('touchstart', handleTouchStart, { passive: false })
		el?.addEventListener('touchend', clearTimer)
		el?.addEventListener('touchmove', handleScroll)
		el?.addEventListener('contextmenu', handleContextmenu)

		// 在组件卸载或者长按事件触发时清除定时器
		return () => {
			el?.removeEventListener('touchstart', handleTouchStart)
			el?.removeEventListener('touchend', clearTimer)
			el?.removeEventListener('touchmove', handleScroll)
			el?.removeEventListener('contextmenu', handleContextmenu)
			if (timerRef.current) clearTimeout(timerRef.current)
		}
	}, [el])

	const stop = () => {
		if (timerRef.current) clearTimeout(timerRef.current)
	}

	return {
		stop
	}
}

export default useLongPress
