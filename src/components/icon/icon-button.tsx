import CustomIcon from '.'
import clsx from 'clsx'

interface IconButtonProps {
    component: React.ForwardRefExoticComponent<any> | React.FC<React.SVGProps<SVGSVGElement>>
    className?: string
    buttonClassName?: string
    hover?: boolean
    active?: boolean
}

const IconButton: React.FC<IconButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
    component,
    className,
    buttonClassName,
    hover,
    active,
    ...props
}) => {
    return (
        <button
            className={clsx(
                'p-2 bg-transparent border-none outline-none rounded-md focus:outline-none duration-300',
                hover && 'hover:bg-gray-100',
                active && 'active:bg-gray-100',
                buttonClassName
            )}
            {...props}
        >
            <CustomIcon component={component} className={className} />
        </button>
    )
}

export default IconButton
