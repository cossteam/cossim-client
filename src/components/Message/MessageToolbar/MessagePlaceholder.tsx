import { emojiOrMore } from '@/shared'
import useMessageStore from '@/stores/new_message'
import { useEffect } from 'react'
import useCacheStore from '@/stores/cache'

/**
 * 当键盘弹起时，占位
 * 当表情或者更多弹起时，占位
 *
 * @returns
 */
const MessagePlaceholder = () => {
	const messageStore = useMessageStore()
	const cacheStore = useCacheStore()

	useEffect(() => {
		if (messageStore.toolbarType !== emojiOrMore.NONE) {
			messageStore.update({ placeholderHeight: cacheStore.keyboardHeight })
		} else {
			messageStore.update({ placeholderHeight: 0 })
		}
	}, [messageStore.toolbarType])

	return (
		<>
			<div className="min-h-14" />
			<div className="w-full" style={{ height: messageStore.placeholderHeight }} />
		</>
	)
}

export default MessagePlaceholder
