import clsx from 'clsx'
import { forwardRef } from 'react'
import './Footer.scss'

interface FooterProps {
	className?: string
}

const Footer = forwardRef<HTMLDivElement, FooterProps>((props, ref) => {
	return <div className={clsx('footer', props.className)} ref={ref}>fotter</div>
})

Footer.displayName = 'Footer'

export default Footer
