import React, { useEffect, useRef } from 'react'

interface LongPressButtonProps {
	callback: () => void
	className?: string
	children: React.ReactNode
}

const LongPressButton: React.FC<LongPressButtonProps> = (props) => {
	const timerRef = useRef<NodeJS.Timeout | null>(null)
	const scrollingRef = useRef<boolean>(false)

	const handleTouchStart = () => {
		scrollingRef.current = false
		timerRef.current = setTimeout(() => {
			if (!scrollingRef.current) {
				props.callback()
			}
		}, 500)
	}

	const handleTouchEnd = () => {
		if (timerRef.current) {
			clearTimeout(timerRef.current)
		}
	}

	const handleScroll = () => {
		scrollingRef.current = true
		if (timerRef.current) {
			clearTimeout(timerRef.current)
		}
	}

	useEffect(() => {
		// 在组件卸载或者长按事件触发时清除定时器
		return () => {
			if (timerRef.current) {
				clearTimeout(timerRef.current)
			}
		}
	}, [])

	return (
		<div
			onTouchStart={handleTouchStart}
			onTouchEnd={handleTouchEnd}
			onTouchMove={handleScroll}
			onMouseDown={(event) => {
				event.preventDefault()
				handleTouchStart()
			}}
			onMouseUp={() => handleTouchEnd()}
			className={props.className}
		>
			{props.children}
		</div>
	)
}

export default LongPressButton
