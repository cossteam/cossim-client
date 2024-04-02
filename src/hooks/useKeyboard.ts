import useCacheStore from '@/stores/cache'
import { Keyboard } from 'capacitor-keyboard'
import { Device } from '@capacitor/device'
import { useRef } from 'react'
import { useAsyncEffect } from '@reactuses/core'
import useMessageStore from '@/stores/new_message'
import { emojiOrMore } from '@/shared'

/**
 * 键盘变化
 *
 * @returns
 */
const useKeyboard = () => {
	const cacheStore = useCacheStore.getState()
	const messageStore = useMessageStore()
	const pageHeight = useRef<number>(0)
	const isWeb = useRef<boolean>(true)

	useAsyncEffect(
		async () => {
			pageHeight.current = window.innerHeight

			const platform = await Device.getInfo()

			isWeb.current = platform.platform !== 'web'

			if (isWeb.current) {
				Keyboard?.addListener('keyboardWillShow', (info) => {
					cacheStore.updateKeyboardHeight(info.keyboardHeight)
					messageStore.update({ toolbarType: emojiOrMore.KEYBOARD })
				})

				Keyboard?.addListener('keyboardWillHide', () => {
					const store = useMessageStore.getState()
					if ([emojiOrMore.KEYBOARD, emojiOrMore.NONE].includes(store.toolbarType)) {
						store.update({ toolbarType: emojiOrMore.NONE })
					}
				})
			}
		},
		() => {},
		[]
	)
}

export default useKeyboard
