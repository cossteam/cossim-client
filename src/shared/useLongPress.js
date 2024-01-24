import { useEffect, useRef } from 'react'

const useLongPress = (callback, duration = 500) => {
	const timerRef = useRef(null)
	const targetElement = useRef(null)

	useEffect(() => {
		const handleTouchStart = (e) => {
			e.preventDefault()
			timerRef.current = setTimeout(() => {
				callback()
			}, duration)
		}

		const handleTouchMove = () => {
			clearTimeout(timerRef.current)
		}

		const handleTouchEnd = () => {
			clearTimeout(timerRef.current)
		}

		// 绑定事件到目标元素
		if (targetElement.current) {
			targetElement.current.addEventListener('touchstart', handleTouchStart)
			targetElement.current.addEventListener('touchmove', handleTouchMove)
			targetElement.current.addEventListener('touchend', handleTouchEnd)
		}

		// 在组件卸载时解绑事件
		return () => {
			if (targetElement.current) {
				targetElement.current.removeEventListener('touchstart', handleTouchStart)
				targetElement.current.removeEventListener('touchmove', handleTouchMove)
				targetElement.current.removeEventListener('touchend', handleTouchEnd)
			}
		}
	}, [callback, duration])

	return { ref: targetElement }
}

export default useLongPress
