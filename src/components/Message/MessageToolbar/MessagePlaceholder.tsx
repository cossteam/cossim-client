import useCacheStore from '@/stores/cache'

/**
 * 当键盘弹起时，占位
 * 当表情或者更多弹起时，占位
 *
 * @returns
 */
const MessagePlaceholder = () => {
	const cacheStore = useCacheStore()
	return <div style={{ height: cacheStore.keyboardHeight }} />
}

export default MessagePlaceholder
