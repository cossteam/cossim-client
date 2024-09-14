import { MESSAGE_TYPE } from '@/utils/enum'
import { isSelf } from '@/utils/message'
import { Avatar, Flex } from 'antd'
import clsx from 'clsx'
import { forwardRef, memo, useCallback, useMemo } from 'react'
import MessageText from './message-content-render/message-text'

interface MessageItemProps {
    message: Message
}

const MessageItem: React.ForwardRefRenderFunction<HTMLDivElement, MessageItemProps> = ({ message }, ref) => {
    const isMe = useMemo(() => isSelf(message?.sender_id), [message?.sender_id])

    const renderContent = useCallback(() => {
        switch (message?.type) {
            case MESSAGE_TYPE.AUDIO:
                return '语音'
            case MESSAGE_TYPE.EMOJI:
                return '表情'
            case MESSAGE_TYPE.IMAGE:
                return '图片'
            case MESSAGE_TYPE.VIDEO:
                return '视频'
            case MESSAGE_TYPE.FILE:
                return '文件'
            case MESSAGE_TYPE.LABEL:
                return '标注消息'
            case MESSAGE_TYPE.CANCEL_LABEL:
                return '取消标注消息'
            case MESSAGE_TYPE.CALL:
                return '通话'
            case MESSAGE_TYPE.RECALL:
                return '撤回消息'
            case MESSAGE_TYPE.VOICE:
                return '语音消息'
            case MESSAGE_TYPE.NOTICE:
                return '通知'
            default:
                return <MessageText message={message} isMe={isMe} />
        }
    }, [message, isMe])

    return (
        <Flex className="px-5 py-2" ref={ref} justify={isMe ? 'end' : 'start'}>
            <Flex className={clsx('max-w-[80%]')} justify={isMe ? 'end' : 'start'}>
                <Flex className="" gap={8}>
                    <Flex className={isMe ? 'order-last' : 'order-first'}>
                        <Avatar
                            className={clsx('w-[30px] h-[30px]', isMe ? 'order-last' : 'order-first')}
                            src={
                                <img
                                    src={isMe ? message?.sender_info?.avatar : message?.receiver_info?.avatar}
                                    alt="avatar"
                                    loading="lazy"
                                />
                            }
                        />
                    </Flex>
                    <Flex vertical>{renderContent()}</Flex>
                </Flex>
            </Flex>
        </Flex>
    )
}

MessageItem.displayName = 'MessageItem'

export default memo(forwardRef(MessageItem))
