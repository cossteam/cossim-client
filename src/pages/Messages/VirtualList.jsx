import { Messages } from 'framework7-react'
import React from 'react'
import PropType from 'prop-types'

VirtualList.propTypes = {
	children: PropType.element
}

export default function VirtualList({ children }) {
	return (
		<Messages>
			<div className="virtual-list messages" style={{ paddingTop: '100%' }}>
				{children}
			</div>
		</Messages>
	)
}
