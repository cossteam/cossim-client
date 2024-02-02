import React from 'react'
import { Icon } from 'framework7-react'
import PropType from 'prop-types'

More.propTypes = {
	onMoreSelect: PropType.func
}

export default function More(props) {
	return (
		<div className="w-full h-full p-2">
			<div
				className="w-12 h-12 m-2 flex flex-col justify-center items-center text-gray-500 rounded-lg bg-white hover:bg-gray-200"
				onClick={() => props?.onMoreSelect('call', null)}
			>
				<Icon f7="phone_fill" size={28} />
			</div>
		</div>
	)
}
