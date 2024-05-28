import { Flex } from 'antd'
import { forwardRef, memo } from 'react'

interface MessageItemProps {
	message: Message
}

const MessageItem: React.ForwardRefRenderFunction<HTMLDivElement, MessageItemProps> = ({ message }, ref) => {
	return <Flex ref={ref}> {message.content}</Flex>
}

MessageItem.displayName = 'MessageItem'

export default memo(forwardRef(MessageItem))
