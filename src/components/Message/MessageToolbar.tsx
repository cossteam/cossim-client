import useMessageStore from '@/stores/new_message'
import MessageInput from './MessageToolbar/MessageInput'
import MessageSendButton from './MessageToolbar/MessageSendButton'
import MessageSendAudio from './MessageToolbar/MessageSendAudio'
import MessageToolbarContent from './MessageToolbar/MessageToolbarContent'
import './styles/MessageToolbar.scss'
import { emojiOrMore, msgSendType } from '@/shared'
import { KeyboardIcon } from '@/components/Icon/Icon'
import { FaceSmiling, PlusCircle } from 'framework7-icons/react'
import { useRef } from 'react'
import { useClickOutside } from '@reactuses/core'

const MessageToolbar = () => {
	const toolbarRef = useRef<HTMLDivElement | null>(null)
	const messageStore = useMessageStore()

	const handlerSelect = (toolbarType: emojiOrMore) => {
		messageStore.update({ toolbarType })
	}

	useClickOutside(toolbarRef, () => messageStore.update({ toolbarType: emojiOrMore.NONE }))

	return (
		<div
			className="min-h-14 bg-bgPrimary relative bottom-0 z-50 w-full flex flex-col justify-center"
			ref={toolbarRef}
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
	)
}

export default MessageToolbar
