import useCacheStore from '@/stores/cache'
import { Keyboard } from '@capacitor/keyboard'
// import { Keyboard } from 'keyboard-coss'
import { Device } from '@capacitor/device'
import { useRef } from 'react'
import { useAsyncEffect } from '@reactuses/core'
import useMessageStore from '@/stores/new_message'
// import { emojiOrMore } from '@/shared'

/**
 * 键盘变化
 *
 * @returns
 */
const useKeyboard = () => {
	const cacheStore = useCacheStore.getState()
	const messageStore = useMessageStore()
	// const { height } = useWindowSize()
	// const [pageHeight, setPageHeight] = useState(height)
	const pageHeight = useRef<number>(0)
	const isWeb = useRef<boolean>(true)

	// const handlerWindowResize = () => {
	// 	// 获取页面高度
	// 	const innerHeight = window.innerHeight
	// 	const keyboardHeight = pageHeight.current - innerHeight
	// 	if (keyboardHeight > 0) {
	// 		// console.log('键盘弹起', keyboardHeight)
	// 		cacheStore.updateKeyboardHeight(keyboardHeight)
	// 		window.removeEventListener('resize', handlerWindowResize)
	// 	}
	// 	// console.log('键盘弹起', pageHeight.current, innerHeight)
	// }

	useAsyncEffect(
		async () => {
			pageHeight.current = window.innerHeight

			const platform = await Device.getInfo()

			isWeb.current = platform.platform !== 'web'

			// console.log('当前欢快', isWeb.curre

			if (isWeb.current) {
				// Keyboard.setKeyboardMode({ mode: KeyboardResize.None })
				// Keyboard.setResizeMode({ mode: KeyboardResize.None })
				// Keyboard.setKeyboardMode('NONE')
				Keyboard?.addListener('keyboardWillShow', (info) => {
					cacheStore.updateKeyboardHeight(info.keyboardHeight)
					if (messageStore.placeholderHeight === 0) {
						messageStore.update({ placeholderHeight: info.keyboardHeight })
					}
				})

				Keyboard?.addListener('keyboardDidShow', (info) => {
					console.log('keyboard did show with height:', info.keyboardHeight)
					cacheStore.updateKeyboardHeight(info.keyboardHeight)
					cacheStore.update({ keyboardShow: true })
					if (messageStore.placeholderHeight === 0) {
						messageStore.update({ placeholderHeight: info.keyboardHeight })
					}
				})

				Keyboard?.addListener('keyboardWillHide', () => {
					cacheStore.updateKeyboardHeight(0)
					console.log('键盘开始隐藏', messageStore.toolbarType)
					cacheStore.update({ keyboardShow: false })
					// if (messageStore.toolbarType === emojiOrMore.KEYBOARD) {
					// 	messageStore.update({ toolbarType: emojiOrMore.NONE })
					// 	messageStore.container?.click()
					// }
				})

				Keyboard?.addListener('keyboardDidHide', () => {
					console.log('keyboard did hide')
					cacheStore.updateKeyboardHeight(0)
					cacheStore.update({ keyboardShow: false })
					// if (messageStore.toolbarType === emojiOrMore.KEYBOARD) {
					// messageStore.update({ toolbarType: emojiOrMore.NONE })
					// }
				})
			} else {
				// window.addEventListener('resize', handlerWindowResize)
			}
		},
		() => {
			// isWeb.current && Keyboard?.removeAllListeners()
			// window.removeEventListener('resize', handlerWindowResize)
		},
		[]
	)
}

export default useKeyboard
