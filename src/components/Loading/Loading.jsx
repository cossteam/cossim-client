import React from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import './loading.less'

Loading.propTypes = {
	className: PropTypes.string
}

export default function Loading({ className }) {
	return (
		<div
			className={clsx(
				'w-full h-screen bg-black bg-opacity-10 fixed left-0 top-0 z-[999] flex justify-center items-center',
				className
			)}
		>
			<div className="flex items-center justify-between w-[100px] bg-opacity-30 h-[80px] px-3 rounded loading">
				<span className="w-[0.5em] h-[1.5em] bg-primary"></span>
				<span className="w-[0.5em] h-[1.5em] bg-primary"></span>
				<span className="w-[0.5em] h-[1.5em] bg-primary"></span>
				<span className="w-[0.5em] h-[1.5em] bg-primary"></span>
			</div>
		</div>
	)
}
