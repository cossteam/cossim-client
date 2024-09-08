import { Flex } from 'antd'
import clsx from 'clsx'

interface MessageProviderProps {
    children: React.ReactNode
    isMe: boolean
}

const MessageProvider: React.FC<MessageProviderProps> = ({ children, isMe }) => {
    return (
        <Flex
            className={clsx('py-2 px-3 break-all rounded text-base', isMe ? 'bg-primary text-white' : 'bg-background')}
            gap={5}
        >
            {children}
        </Flex>
    )
}

export default MessageProvider
