import useMessageStore from '@/stores/message'
import MessageInput from './MessageToolbar/MessageInput'
import MessageSendButton from './MessageToolbar/MessageSendButton'
import MessageSendAudio from './MessageToolbar/MessageSendAudio'
import MessageToolbarContent from './MessageToolbar/MessageToolbarContent'
import './styles/MessageToolbar.scss'
import { MESSAGE_READ, emojiOrMore, msgSendType, tooltipType } from '@/shared'
import { KeyboardIcon } from '@/components/Icon/Icon'
import { ChevronDown, FaceSmiling, PlusCircle } from 'framework7-icons/react'
import { useMemo, useRef } from 'react'
import { useClickOutside } from '@reactuses/core'
import clsx from 'clsx'
import MessageSelect from './MessageToolbar/MessageSelect'
import useCacheStore from '@/stores/cache'

const MessageToolbar = () => {
	const toolbarRef = useRef<HTMLDivElement | null>(null)
	const messageStore = useMessageStore()
	const cacheStore = useCacheStore()

	const handlerSelect = (toolbarType: emojiOrMore) => {
		messageStore.update({ toolbarType })
		console.log('handlerSelect: 触发了handlerSelect')
	}

	useClickOutside(toolbarRef, () => messageStore.update({ toolbarType: emojiOrMore.NONE }))

	const isSelect = useMemo(() => messageStore.manualTipType === tooltipType.SELECT, [messageStore.manualTipType])

	const unreadCount = useMemo(
		() =>
			cacheStore.cacheDialogs?.find((v: { dialog_id: number }) => v?.dialog_id === messageStore.dialogId)
				?.dialog_unread_count ?? 0,
		[cacheStore.cacheDialogs]
	)

	const handlerToBottom = () => {
		if (unreadCount === 0) return messageStore.update({ isScrollBottom: true })
		// 找到未读消息的第一条，然后滚动到这条消息
		const index = messageStore.messages.findIndex((v: { is_read: boolean }) => v?.is_read === MESSAGE_READ.NOT_READ)
		if (index === -1) return messageStore.update({ isScrollBottom: true })

		const el = document.getElementById(`row-${messageStore.messages[index]?.msg_id}`)

		// console.log('el', el)

		if (el) el?.scrollIntoView({ block: 'start' })
		else messageStore.update({ isScrollBottom: true })
	}

	return (
		<>
			<div
				style={{
					paddingBottom: messageStore.toolbarType === emojiOrMore.NONE ? 'env( safe-area-inset-bottom)' : 0
				}}
				className="min-h-14 bg-bgPrimary relative z-50 w-full bottom-0 flex flex-col justify-center transition-all duration-100 select-none"
				ref={toolbarRef}
			>
				<div className={clsx('w-full flex items-end gap-1 pl-[6px] py-2', isSelect && 'hidden')}>
					{/* 文本输入框 */}
					<MessageInput />

					<div className="min-w-[108px] flex items-center pr-3" onContextMenu={(e) => e.preventDefault()}>
						{/* 表情*/}
						{messageStore.toolbarType === emojiOrMore.EMOJI ? (
							<KeyboardIcon
								onClick={() => handlerSelect(emojiOrMore.KEYBOARD)}
								className="toolbar-icon"
							/>
						) : (
							<FaceSmiling onClick={() => handlerSelect(emojiOrMore.EMOJI)} className="toolbar-icon" />
						)}

						{/* 更多 */}
						{messageStore.toolbarType === emojiOrMore.MORE ? (
							<KeyboardIcon
								onClick={() => handlerSelect(emojiOrMore.KEYBOARD)}
								className="toolbar-icon"
							/>
						) : (
							<PlusCircle onClick={() => handlerSelect(emojiOrMore.MORE)} className="toolbar-icon" />
						)}

						{/* 发送文本和语音按钮切换 */}
						{messageStore.sendType === msgSendType.AUDIO ? <MessageSendAudio /> : <MessageSendButton />}
					</div>
				</div>

				{/* 多选时显示 */}
				{isSelect && <MessageSelect />}

				{/* 表情或者更多内容切换 */}
				<MessageToolbarContent />

				{/* 滚动到底部按钮 */}
				<div
					className={clsx(
						'absolute bottom-[calc(100%+10px)] z-[9999] right-2 bg-bgPrimary  justify-center items-center rounded-full w-8 h-8 shadow select-none cursor-pointer',
						messageStore.isAtBottom ? 'hidden' : 'flex'
					)}
					onClick={handlerToBottom}
				>
					{unreadCount === 0 ? <ChevronDown /> : <span className="text-xs text-gray-500">{unreadCount}</span>}
				</div>
			</div>
		</>
	)
}

export default MessageToolbar
