import { useEffect, useRef } from 'react'

const useLongPress = (callback, duration = 500) => {
	const timerRef = useRef(null)
	const targetElement = useRef(null)

	useEffect(() => {
		const handleTouchStart = (e) => {
			e.preventDefault()
			e.stopPropagation()
			timerRef.current = setTimeout(() => {
				callback(e)
			}, duration)
		}

		const handleTouchMove = () => {
			clearTimeout(timerRef.current)
		}

		const handleTouchEnd = () => {
			clearTimeout(timerRef.current)
		}

		const handleTouchCancel = () => {
			clearTimeout(timerRef.current)
		}

		// 绑定事件到目标元素
		if (targetElement.current) {
			targetElement.current.addEventListener('contextmenu', (e) => {
				e.preventDefault()
				e.stopPropagation()
				console.log(e)
			})
			targetElement.current.addEventListener('touchstart', handleTouchStart)
			targetElement.current.addEventListener('touchmove', handleTouchMove)
			targetElement.current.addEventListener('touchend', handleTouchEnd)
			targetElement.current.addEventListener('touchcancel', handleTouchCancel)
		}

		// 在组件卸载时解绑事件
		return () => {
			if (targetElement.current) {
				targetElement.current.removeEventListener('touchstart', handleTouchStart)
				targetElement.current.removeEventListener('touchmove', handleTouchMove)
				targetElement.current.removeEventListener('touchend', handleTouchEnd)
				targetElement.current.removeEventListener('touchcancel', handleTouchCancel)
			}
		}
	}, [callback, duration])

	return { ref: targetElement }
}

export default useLongPress
