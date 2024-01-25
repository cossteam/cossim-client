import React, { useRef } from 'react'
import PropType from 'prop-types'
import useLongPress from '@/shared/useLongPress'

LongPressWrap.propTypes = {
	className: PropType.string,
	onLongPress: PropType.func.isRequired,
	children: PropType.any
}

export default function LongPressWrap(props) {
	const { onLongPress, children } = props
	const longPressRef = useRef(null)
	const longPress = useLongPress((e) => onLongPress(e))

	return onLongPress ? (
		<div className={props.className} ref={longPressRef} {...longPress}>
			{children}
		</div>
	) : (
		<>{children}</>
	)
}
