import { useClickOutside } from '@reactuses/core'
import { useMessageStore } from '@/stores/message'
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

	const { trgger, updateTrgger } = useMessageStore()

	useClickOutside(LongPressButtonRef, () => {
		LongPressButtonRef.current?.addEventListener('touchstart', handleTouchStart)
	})

	const handleTouchStart = (e: any) => {
		e.preventDefault()

		scrollingRef.current = false
		timerRef.current = setTimeout(() => {
			if (!scrollingRef.current) {
				props.callback()
				LongPressButtonRef.current?.removeEventListener('touchstart', handleTouchStart)
			}
		}, props.duration ?? 500)
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
		if (trgger) {
			LongPressButtonRef.current?.addEventListener('touchstart', handleTouchStart)
			updateTrgger(false)
		}
	}, [trgger])


	useEffect(() => {
		if (!LongPressButtonRef.current) return
		LongPressButtonRef.current.addEventListener('touchstart', handleTouchStart)
		LongPressButtonRef.current.addEventListener('touchend', handleTouchEnd)
		LongPressButtonRef.current.addEventListener('touchmove', handleScroll)
		LongPressButtonRef.current.addEventListener('mousedown', handleTouchStart)
		LongPressButtonRef.current.addEventListener('mouseup', handleTouchEnd)

		// LongPressButtonRef.current.addEventListener('click', handlerClick)

		// 在组件卸载或者长按事件触发时清除定时器
		return () => {
			LongPressButtonRef.current?.removeEventListener('touchstart', handleTouchStart)
			LongPressButtonRef.current?.removeEventListener('touchend', handleTouchEnd)
			LongPressButtonRef.current?.removeEventListener('touchmove', handleScroll)
			LongPressButtonRef.current?.removeEventListener('mousedown', handleTouchStart)
			LongPressButtonRef.current?.removeEventListener('mouseup', handleTouchEnd)

			if (timerRef.current) {
				clearTimeout(timerRef.current)
			}
		}
	}, [])

	return (
		<div
			// onTouchStart={handleTouchStart}
			// onTouchEnd={handleTouchEnd}
			// onTouchMove={handleScroll}
			// onMouseDown={(e) => {
			// 	e.preventDefault()
			// 	handleTouchStart(e)
			// }}
			// onMouseUp={() => handleTouchEnd()}
			className={clsx('long-press-button touch-none', props.className)}
			ref={LongPressButtonRef}
		>
			{props.children}
		</div>
	)
}

export default LongPressButton
