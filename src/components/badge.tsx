import { Flex } from 'antd'
import clsx from 'clsx'
import { useMemo } from 'react'

interface BadgeProps {
    count: number
    className?: string
}

const Badge: React.FC<BadgeProps> = ({ count = 0, className }) => {
    const text = useMemo(() => (count >= 99 ? '99+' : count), [count])
    if (!count) return null
    // <span className={clsx('bg-red-500 p-1 text-xs text-white rounded-full', className)}>{text}</span>
    return (
        <Flex className={clsx('bg-red-500 p-1 text-xs text-white rounded-full', className)}>
            {text}
        </Flex>
    )
}

export default Badge
