import clsx from 'clsx'
import { forwardRef } from 'react'

interface FooterProps {
	className?: string
}

const Footer = forwardRef<HTMLDivElement, FooterProps>((props, ref) => {
	return <div className={clsx('sticky top-0 z-50 bg-bgPrimary min-h-16', props.className)} ref={ref}></div>
})

Footer.displayName = 'Footer'

export default Footer
