import { memo } from 'react'
import CustomIcon from '.'
import clsx from 'clsx'

interface IconButtonProps {
	component: React.ForwardRefExoticComponent<any> | React.FC<React.SVGProps<SVGSVGElement>>
	className?: string
	buttonClassName?: string
}

const IconButton: React.FC<IconButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>> = memo(
	({ component, className, buttonClassName, ...props }) => {
		return (
			<button
				className={clsx(
					'p-2 bg-transparent border-none outline-none rounded-md hover:bg-gray-100 focus:outline-none active:bg-gray-100 duration-300',
					buttonClassName
				)}
				{...props}
			>
				<CustomIcon component={component} className={className} />
			</button>
		)
	}
)

export default IconButton
