import { useRef, useState } from 'react'

const useTouch = () => {
	const el = useRef<HTMLElement | null>(null)
	const [x, setX] = useState(0)
	const [y, setY] = useState(0)

	const started = (event: any) => {
		event.preventDefault() // 防止默认行为，例如滚动屏幕
		const touch = event.touches[0] // 获取第一个触摸点的信息
		// console.log('Touch started at: ' + touch.pageX + ', ' + touch.pageY)
		setX(touch.pageX)
		setY(touch.pageY)
	}
	const moved = (event: any) => {
		event.preventDefault() // 防止默认行为，例如滚动屏幕
		const touch = event.touches[0] // 获取第一个触摸点的信息
		// console.log('Touch moved to: ' + touch.pageX + ', ' + touch.pageY)
		setX(touch.pageX)
		setY(touch.pageY)
	}
	const ended = () => {
		if (el.current === null) return
		console.log('Touch ended')
		el.current.removeEventListener('touchstart', started)
		el.current.removeEventListener('touchmove', moved)
		el.current.removeEventListener('touchend', ended)
	}

	const start = (element: HTMLElement) => {
		el.current = element
		// 添加 touchstart 事件监听器
		element.addEventListener('touchstart', started)
		// 添加 touchmove 事件监听器
		element.addEventListener('touchmove', moved)
		// 添加 touchend 事件监听器
		element.addEventListener('touchend', ended)
	}

	return {
		x,
		y,
		start
	}
}

export default useTouch
