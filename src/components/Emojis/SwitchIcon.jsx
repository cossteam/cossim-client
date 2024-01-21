import React from 'react'
import { Icon } from 'framework7-react'
import PropType from 'prop-types'

SwitchIcon.propTypes = {
	fill: PropType.bool,
	onClick: PropType.func
}

export default function SwitchIcon({ fill, onClick }) {
	return (
		<div className="m-1 p-1" onClick={onClick}>
			<Icon f7={fill ? 'smiley_fill' : 'smiley'} color="primary" />
		</div>
	)
}
