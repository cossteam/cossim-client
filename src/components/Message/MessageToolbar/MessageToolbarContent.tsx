import useMessageStore from '@/stores/new_message'
import MessageEmojis from './MessageEmojis'
import MessageMore from './MessageMore'
import { emojiOrMore } from '@/shared'
import clsx from 'clsx'
import { useMemo } from 'react'
import useCacheStore from '@/stores/cache'

const MessageToolbarContent = () => {
	const messageStore = useMessageStore()
	const cacheStore = useCacheStore()

	const isNone = useMemo(
		() => [emojiOrMore.NONE, emojiOrMore.KEYBOARD].includes(messageStore.toolbarType),
		[messageStore.toolbarType]
	)
	const isEmoji = useMemo(() => messageStore.toolbarType === emojiOrMore.EMOJI, [messageStore.toolbarType])
	const isMore = useMemo(() => messageStore.toolbarType === emojiOrMore.MORE, [messageStore.toolbarType])

	return (
		<div
			className={clsx('w-full h-[300px] flex overflow-hidden', isNone && 'hidden')}
			style={{ height: cacheStore.keyboardHeight }}
		>
			<MessageEmojis
				onSelectEmojis={(emoji) => messageStore.update({ selectedEmojis: emoji.native })}
				className={clsx('w-full', !isEmoji && 'hidden')}
			/>
			<MessageMore members={[]} className={clsx('w-full', !isMore && 'hidden')} />
		</div>
	)
}

export default MessageToolbarContent
