import useMessageStore from '@/stores/new_message'
import MessageInput from './MessageToolbar/MessageInput'
import MessageSendButton from './MessageToolbar/MessageSendButton'
import MessageSendAudio from './MessageToolbar/MessageSendAudio'
import MessageToolbarContent from './MessageToolbar/MessageToolbarContent'
import './styles/MessageToolbar.scss'
import { emojiOrMore, msgSendType } from '@/shared'
import { KeyboardIcon } from '@/components/Icon/Icon'
import { FaceSmiling, PlusCircle } from 'framework7-icons/react'
import { useMemo, useRef } from 'react'
import { useClickOutside } from '@reactuses/core'
import MessagePlaceholder from './MessageToolbar/MessagePlaceholder'
import useCacheStore from '@/stores/cache'

const MessageToolbar = () => {
	const toolbarRef = useRef<HTMLDivElement | null>(null)
	const messageStore = useMessageStore()
	const cacheStore = useCacheStore()

	const handlerSelect = (toolbarType: emojiOrMore) => {
		messageStore.update({ toolbarType })
	}

	useClickOutside(toolbarRef, () => messageStore.update({ toolbarType: emojiOrMore.NONE }))

	const height = useMemo(() => {
		if (messageStore.placeholderHeight === 0) return cacheStore.keyboardHeight
		return 0
	}, [messageStore.placeholderHeight])

	return (
		<>
			<div
				className="min-h-14 bg-bgPrimary fixed z-50 w-full bottom-0 flex flex-col justify-center transition-all duration-100"
				ref={toolbarRef}
				// style={{ bottom: -height }}
				style={{ transform: `translateY(${height}px)` }}
			>
				<div className="w-full flex items-end gap-1 px-[6px] py-2">
					{/* 文本输入框 */}
					<MessageInput />

					{/* 表情*/}
					{messageStore.toolbarType === emojiOrMore.EMOJI ? (
						<KeyboardIcon onClick={() => handlerSelect(emojiOrMore.KEYBOARD)} className="toolbar-icon" />
					) : (
						<FaceSmiling onClick={() => handlerSelect(emojiOrMore.EMOJI)} className="toolbar-icon" />
					)}

					{/* 更多 */}
					{messageStore.toolbarType === emojiOrMore.MORE ? (
						<KeyboardIcon onClick={() => handlerSelect(emojiOrMore.KEYBOARD)} className="toolbar-icon" />
					) : (
						<PlusCircle onClick={() => handlerSelect(emojiOrMore.MORE)} className="toolbar-icon" />
					)}

					{/* 发送文本和语音按钮切换 */}
					{messageStore.sendType === msgSendType.AUDIO ? <MessageSendAudio /> : <MessageSendButton />}
				</div>

				{/* 表情或者更多内容切换 */}
				<MessageToolbarContent />
			</div>

			{/* 占位 */}
			<MessagePlaceholder />
		</>
	)
}

export default MessageToolbar
