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
import { debounce } from 'lodash-es'

const Message: React.FC<RouterProps> = () => {
	const { height } = useWindowSize()
	const messageStore = useMessageStore()

	// TODO：需优化处理键盘
	useKeyboard()

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

	// 已读消息
	const read = debounce(() => {
		console.log('已读')
	}, 1000)
	useEffect(() => {
		if (!messageStore.unreadList.length) return
		console.log('messageStore.unreadList', messageStore.unreadList)
		read()
		// 在组件卸载或下一次 effect 运行之前取消 debounce 函数
		// return () => read.cancel()
	}, [messageStore.unreadList])

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
