import CustomIcon from '.'
import clsx from 'clsx'

interface IconButtonProps {
    component: React.ForwardRefExoticComponent<any> | React.FC<React.SVGProps<SVGSVGElement>>
    className?: string
    buttonClassName?: string
    hover?: boolean
    active?: boolean
    size?: 'small' | 'medium' | 'large'
}

const IconButton: React.FC<IconButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
    component,
    className,
    buttonClassName,
    hover,
    active,
    size = 'medium',
    ...props
}) => {
    return (
        <button
            className={clsx(
                'bg-transparent border-none outline-none rounded-md focus:outline-none duration-300',
                hover && 'hover:bg-gray-100',
                active && 'active:bg-gray-100',
                buttonClassName,
                size === 'small' && 'p-1',
                size === 'medium' && 'p-2',
                size === 'large' && 'p-3'
            )}
            {...props}
        >
            <CustomIcon component={component} className={clsx(className, size === 'small' && 'text-base', size === 'medium' && 'text-lg', size === 'large' && 'text-xl')} />
        </button>
    )
}

export default IconButton
