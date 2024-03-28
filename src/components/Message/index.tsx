import { Page } from 'framework7-react'
import './styles/Message.scss'
import { useWindowSize } from '@reactuses/core'
import MessageHeader from './MessageHeader'
import MessageContent from './MessageContent'
import MessageToolbar from './MessageToolbar'
import useKeyboard from '@/hooks/useKeyboard'
import './styles/MessageTip.scss'
import MessageForward from './MessageContent/MessageForward'
import useMessageStore from '@/stores/new_message'
import { useEffect, useMemo } from 'react'
import { tooltipType } from '@/shared'
import { forwardMessage } from './script/message'

const Message: React.FC<RouterProps> = () => {
	const { height } = useWindowSize()
	const messageStore = useMessageStore()

	// TODO：需优化处理键盘
	useKeyboard()

	// const isSelect = useMemo(() => messageStore.manualTipType === tooltipType.SELECT, [messageStore.manualTipType])

	// 转发组件
	const messageForward = useMemo(() => {
		return (
			<MessageForward
				opened={messageStore.manualTipType === tooltipType.FORWARD}
				openedClose={() => messageStore.update({ manualTipType: tooltipType.NONE })}
				selectComplate={(selectList) =>
					messageStore.update({
						selectedForwardUsers: selectList,
						selectedMessages: !messageStore.selectedMessages.length
							? [messageStore.selectedMessage]
							: messageStore.selectedMessages
					})
				}
			/>
		)
	}, [messageStore.manualTipType])

	// 转发消息
	useEffect(() => {
		if (!messageStore.selectedForwardUsers.length) return
		forwardMessage()
	}, [messageStore.selectedForwardUsers])

	return (
		<Page noToolbar className="coss_message transition-all relative">
			<div className="h-screen overflow-hidden flex flex-col" style={{ height }}>
				<MessageHeader />
				<MessageContent />
				<MessageToolbar />
			</div>

			{/* 转发弹出 */}
			{messageForward}
		</Page>
	)
}

export default Message
