import React, { useRef } from 'react'
import PropType from 'prop-types'
import useLongPress from '@/shared/useLongPress'

LongPressWrap.propTypes = {
	onLongPress: PropType.func.isRequired,
	children: PropType.any
}

export default function LongPressWrap({ onLongPress, children }) {
	const longPressRef = useRef(null)
	const longPress = useLongPress((e) => onLongPress(e))

	return onLongPress ? (
		<div ref={longPressRef} {...longPress}>
			{children}
		</div>
	) : (
		<div>{children}</div>
	)
}
