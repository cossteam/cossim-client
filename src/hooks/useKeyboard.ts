import useCacheStore from '@/stores/cache'
import { Keyboard } from 'capacitor-keyboard'
import { Device } from '@capacitor/device'
import { useRef } from 'react'
// import { useAsyncEffect } from '@reactuses/core'
import useMessageStore from '@/stores/message'
import { emojiOrMore } from '@/shared'

/**
 * 键盘变化
 *
 * @returns
 */
const useKeyboard = () => {
	const cacheStore = useCacheStore.getState()
	const pageHeight = useRef<number>(0)
	const isWeb = useRef<boolean>(true)

	const handlerKeyboardEvent = async () => {
		pageHeight.current = window.innerHeight

		const platform = await Device.getInfo()

		isWeb.current = platform.platform !== 'web'

		if (isWeb.current) {
			// 以编程方式启用或禁用WebView滚动。在 ios 端
			// platform.platform === 'ios' && Keyboard?.setScroll({ isDisabled: true })
			// Keyboard?.show()

			Keyboard?.addListener('keyboardWillShow', (info) => {
				const messageStore = useMessageStore.getState()
				cacheStore.updateKeyboardHeight(info.keyboardHeight)
				if (!messageStore.isEmojiFocus) messageStore.update({ toolbarType: emojiOrMore.KEYBOARD })
			})

			Keyboard?.addListener('keyboardWillHide', () => {
				const messageStore = useMessageStore.getState()
				if ([emojiOrMore.KEYBOARD, emojiOrMore.NONE].includes(messageStore.toolbarType)) {
					messageStore.update({ toolbarType: emojiOrMore.NONE })
				}
			})
		}
	}

	const handlerClear = () => {
		console.log('clear')
		isWeb.current && Keyboard?.removeAllListeners()
		// Keyboard?.hide()
	}

	return {
		handlerKeyboardEvent,
		handlerClear
	}

	// useAsyncEffect(
	// 	async () => {
	// 		pageHeight.current = window.innerHeight

	// 		const platform = await Device.getInfo()

	// 		isWeb.current = platform.platform !== 'web'

	// 		if (isWeb.current) {
	// 			// 以编程方式启用或禁用WebView滚动。在 ios 端
	// 			// platform.platform === 'ios' && Keyboard?.setScroll({ isDisabled: true })

	// 			Keyboard?.addListener('keyboardWillShow', (info) => {
	// 				const messageStore = useMessageStore.getState()
	// 				cacheStore.updateKeyboardHeight(info.keyboardHeight)
	// 				if (!messageStore.isEmojiFocus) messageStore.update({ toolbarType: emojiOrMore.KEYBOARD })
	// 			})

	// 			Keyboard?.addListener('keyboardWillHide', () => {
	// 				const messageStore = useMessageStore.getState()
	// 				if ([emojiOrMore.KEYBOARD, emojiOrMore.NONE].includes(messageStore.toolbarType)) {
	// 					messageStore.update({ toolbarType: emojiOrMore.NONE })
	// 				}
	// 			})
	// 		}
	// 	},
	// 	() => {},
	// 	[]
	// )
}

export default useKeyboard
