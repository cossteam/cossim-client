import useMessageStore from '@/stores/new_message'
import MessageInput from './MessageToolbar/MessageInput'
import MessageSendButton from './MessageToolbar/MessageSendButton'
import MessageSendAudio from './MessageToolbar/MessageSendAudio'
import MessageToolbarContent from './MessageToolbar/MessageToolbarContent'
import './styles/MessageToolbar.scss'
import { emojiOrMore, msgSendType, tooltipType } from '@/shared'
import { KeyboardIcon } from '@/components/Icon/Icon'
import { FaceSmiling, PlusCircle } from 'framework7-icons/react'
import { useMemo, useRef } from 'react'
import { useClickOutside } from '@reactuses/core'
import clsx from 'clsx'
import MessageSelect from './MessageToolbar/MessageSelect'
// import MessagePlaceholder from './MessageToolbar/MessagePlaceholder'
// import useCacheStore from '@/stores/cache'

const MessageToolbar = () => {
	const toolbarRef = useRef<HTMLDivElement | null>(null)
	const messageStore = useMessageStore()
	// const cacheStore = useCacheStore()

	const handlerSelect = (toolbarType: emojiOrMore) => {
		messageStore.update({ toolbarType })
	}

	useClickOutside(toolbarRef, () => messageStore.update({ toolbarType: emojiOrMore.NONE }))

	// const height = useMemo(() => {
	// 	if (messageStore.placeholderHeight === 0) return cacheStore.keyboardHeight
	// 	return 0
	// }, [messageStore.placeholderHeight])

	const isSelect = useMemo(() => messageStore.manualTipType === tooltipType.SELECT, [messageStore.manualTipType])

	return (
		<>
			<div
				className="min-h-14 bg-bgPrimary relative z-50 w-full bottom-0 flex flex-col justify-center transition-all duration-100"
				ref={toolbarRef}
				// style={{ transform: `translateY(${height}px)` }}
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

				{/* <MessagePlaceholder /> */}
			</div>
		</>
	)
}

export default MessageToolbar
