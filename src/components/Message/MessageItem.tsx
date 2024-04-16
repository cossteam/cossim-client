import React from 'react'
import { RowProps } from './MessageVariableSizeList'
// import { useMessageStore } from '@/stores/message'
// import { useTooltipsStore } from '@/stores/tooltips'
// import { MESSAGE_READ, MessageBurnAfterRead } from '@/shared'
// import { List, ListItem } from 'framework7-react'
// import MessageBox from './MessageBox'
// import clsx from 'clsx'
import MessageRow from './MessageRow'

interface MessageItemProps {
	// selectChange: (...args: any[]) => void
	// onSelect: (...args: any[]) => void
	// el: RefObject<HTMLDivElement | null>
}

const MessageItem: React.FC<RowProps & MessageItemProps> = ({ item }) => {
	return <MessageRow item={item} />
}

export default MessageItem
