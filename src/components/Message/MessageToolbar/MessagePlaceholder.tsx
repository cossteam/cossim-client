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
			messageStore.update({ placeholderHeight: 0 })
		} else {
			messageStore.update({ placeholderHeight: cacheStore.keyboardHeight })
		}
	}, [messageStore.toolbarType])

	return <div style={{ height: messageStore.placeholderHeight }} />
}

export default MessagePlaceholder
