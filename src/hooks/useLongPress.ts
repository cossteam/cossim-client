import { useCallback, useEffect, useRef } from 'react'

interface LongPressOptions {
	callback?: (data: any) => void
	delay?: number
	data?: any
}

const useLongPress = (el: React.MutableRefObject<HTMLElement | null>, options?: LongPressOptions) => {
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
		if (!el || !el.current) return
		el.current.addEventListener('touchstart', handleTouchStart, { passive: false })
		el.current.addEventListener('touchend', clearTimer)
		el.current.addEventListener('touchmove', handleScroll)
		el.current.addEventListener('contextmenu', handleContextmenu)

		// 在组件卸载或者长按事件触发时清除定时器
		return () => {
			el.current?.removeEventListener('touchstart', handleTouchStart)
			el.current?.removeEventListener('touchend', clearTimer)
			el.current?.removeEventListener('touchmove', handleScroll)
			el.current?.removeEventListener('contextmenu', handleContextmenu)
			if (timerRef.current) clearTimeout(timerRef.current)
		}
	}, [])

	const stop = () => {
		if (timerRef.current) clearTimeout(timerRef.current)
	}

	return {
		stop
	}
}

export default useLongPress
