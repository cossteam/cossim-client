import clsx from 'clsx'
import { forwardRef } from 'react'

interface HeaderProps {
	className?: string
}

const Header = forwardRef<HTMLDivElement, HeaderProps>((props, ref) => {
	return <div className={clsx('sticky top-0 z-50 bg-bgPrimary min-h-16', props.className)} ref={ref}></div>
})

Header.displayName = 'Header'

export default Header
