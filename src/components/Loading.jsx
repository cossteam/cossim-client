import React from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'

Loading.propTypes = {
	className: PropTypes.string
}

export default function Loading({ className }) {
	return (
		<div
			className={clsx(
				'w-full h-screen bg-black bg-opacity-20 fixed left-0 top-0 z-[999] flex justify-center items-center',
				className
			)}
		>
			<div className="flex items-center justify-between w-[100px]">
				<span className="w-[0.3em] h-[1em] bg-primary"></span>
				<span className="w-[0.3em] h-[1em] bg-primary"></span>
				<span className="w-[0.3em] h-[1em] bg-primary"></span>
				<span className="w-[0.3em] h-[1em] bg-primary"></span>
			</div>
		</div>
	)
}
