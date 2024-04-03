import { Page } from 'framework7-react'
import './styles/Message.scss'
import { useWindowSize } from '@reactuses/core'
import MessageHeader from './MessageHeader'
import MessageContent from './MessageContent'
import MessageToolbar from './MessageToolbar'
import useKeyboard from '@/hooks/useKeyboard'
import './styles/MessageTip.scss'
import MessageForward from './MessageContent/MessageForward'
import useMessageStore from '@/stores/message'
import { useEffect, useMemo } from 'react'
import { tooltipType } from '@/shared'
import { forwardMessage } from './script/message'

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

	// // 已读消息
	// const read = async () => {
	// 	await MsgService.readMessagesApi({
	// 		dialog_id: messageStore.dialogId,
	// 		msg_ids: messageStore.unreadList
	// 	})
	// 	// 更新本地消息状态
	// 	const dialogMsgs = await cacheStore.get(`${messageStore.dialogId}`)
	// 	const newMsgs = dialogMsgs.map((msg: any) => {
	// 		if (!messageStore.unreadList.includes(msg.msg_id)) {
	// 			return msg
	// 		}
	// 		return {
	// 			...msg,
	// 			is_read: 1,
	// 			read_at: Date.now()
	// 		}
	// 	})
	// 	await cacheStore.set(`${messageStore.dialogId}`, newMsgs)
	// 	// 清空未读消息
	// 	await messageStore.update({ unreadList: [] })
	// }
	// useEffect(() => {
	// 	console.log('未读列表', messageStore.unreadList)
	// 	if (!messageStore.unreadList.length) return
	//     read()
	// }, [messageStore.unreadList])

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
