import clsx from 'clsx'
import React, { useEffect, useRef } from 'react'

interface LongPressButtonProps {
	callback: () => void
	className?: string
	children: React.ReactNode
	duration?: number
}

const LongPressButton: React.FC<LongPressButtonProps> = (props) => {
	const timerRef = useRef<NodeJS.Timeout | null>(null)
	const scrollingRef = useRef<boolean>(false)
	const LongPressButtonRef = useRef<HTMLDivElement>(null)

	const handleTouchStart = () => {
		scrollingRef.current = false
		timerRef.current = setTimeout(() => {
			if (!scrollingRef.current) {
				props.callback()
				timerRef.current && clearTimeout(timerRef.current)
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

	const handleContextmenu = (e: Event) => e.preventDefault()

	useEffect(() => {
		if (!LongPressButtonRef.current) return
		LongPressButtonRef.current.addEventListener('touchstart', handleTouchStart, { passive: false })
		LongPressButtonRef.current.addEventListener('touchend', handleTouchEnd)
		LongPressButtonRef.current.addEventListener('touchmove', handleScroll)
		LongPressButtonRef.current.addEventListener('contextmenu', handleContextmenu)

		// 在组件卸载或者长按事件触发时清除定时器
		return () => {
			LongPressButtonRef.current?.removeEventListener('touchstart', handleTouchStart)
			LongPressButtonRef.current?.removeEventListener('touchend', handleTouchEnd)
			LongPressButtonRef.current?.removeEventListener('touchmove', handleScroll)
			LongPressButtonRef.current?.removeEventListener('contextmenu', handleContextmenu)
			if (timerRef.current) clearTimeout(timerRef.current)
		}
	}, [])

	return (
		<div className={clsx('long-press-button touch-none', props.className)} ref={LongPressButtonRef}>
			{props.children}
		</div>
	)
}

export default LongPressButton
