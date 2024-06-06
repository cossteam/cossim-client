import { isSelf } from '@/utils/message'
import { Avatar, Flex } from 'antd'
import clsx from 'clsx'
import { forwardRef, memo, useMemo } from 'react'

interface MessageItemProps {
    message: Message
}

const MessageItem: React.ForwardRefRenderFunction<HTMLDivElement, MessageItemProps> = ({ message }, ref) => {
    const isMe = useMemo(() => isSelf(message.sender_id), [message.sender_id])

    return (
        <Flex className="px-5 py-2" ref={ref} justify={isMe ? 'end' : 'start'}>
            <Flex className={clsx('max-w-[80%]')} justify={isMe ? 'end' : 'start'}>
                <Flex className="" gap={8}>
                    <Flex className={isMe ? 'order-last' : 'order-first'}>
                        <Avatar
                            className={clsx('w-[30px] h-[30px]', isMe ? 'order-last' : 'order-first')}
                            src={
                                <img
                                    src={isMe ? message.sender_info.avatar : message.receiver_info.avatar}
                                    alt="avatar"
                                    loading="lazy"
                                />
                            }
                        />
                    </Flex>
                    <Flex vertical>
                        <Flex
                            className={clsx(
                                'py-2 px-3 break-all rounded text-base',
                                isMe ? 'bg-primary text-white' : 'bg-background'
                            )}
                            gap={5}
                        >
                            {message.content}
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    )
}

MessageItem.displayName = 'MessageItem'

export default memo(forwardRef(MessageItem))
