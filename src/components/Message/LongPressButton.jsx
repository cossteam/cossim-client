import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

LongPressButton.propTypes = {
	callback: PropTypes.func,
	className: PropTypes.string,
	children: PropTypes.node
}

function LongPressButton(props) {
	const timerRef = useRef(null)
	const scrollingRef = useRef(false)

	const handleTouchStart = (e) => {
		e.preventDefault()
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
				event.preventDefault() // 阻止浏览器默认行为
				handleTouchStart(event)
			}}
			onMouseUp={() => handleTouchEnd()}
			onMouseMove={handleScroll}
			className={props.className}
		>
			{props.children}
		</div>
	)
}

export default LongPressButton
