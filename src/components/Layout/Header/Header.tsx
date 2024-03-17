import clsx from 'clsx'
import { forwardRef } from 'react'
// import { Link } from 'react-router-dom'

interface HeaderProps {
	className?: string
	title?: string
	subtitle?: string
	link?: boolean
	center?: React.ReactNode
	left?: React.ReactNode
	right?: React.ReactNode
}

const Header = forwardRef<HTMLDivElement, HeaderProps>((props, ref) => {
	return (
		<div
			className={clsx('sticky w-full top-0 z-50 bg-bgPrimary min-h-14 flex items-center', props.className)}
			ref={ref}
		>
			<div className="w-2/5 flex pl-2"></div>
			<div className="w-1/5 flex justify-center flex-col items-center">
				<span className="font-semibold text-lg">{props.title}</span>
				<span className="text-[0.75rem]">{props.subtitle}</span>
			</div>
			<div className="w-2/5 flex pr-2 justify-end"></div>
		</div>
	)
})

Header.displayName = 'Header'

export default Header
