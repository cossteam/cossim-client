import useCacheStore from '@/stores/cache'
import { Keyboard } from '@capacitor/keyboard'
import { Device } from '@capacitor/device'
import { useRef } from 'react'
import { useAsyncEffect } from '@reactuses/core'

/**
 * 键盘变化
 *
 * @returns
 */
const useKeyboard = () => {
	const cacheStore = useCacheStore.getState()
	// const { height } = useWindowSize()
	// const [pageHeight, setPageHeight] = useState(height)
	const pageHeight = useRef<number>(0)
	const isWeb = useRef<boolean>(true)

	const handlerWindowResize = () => {
		// 获取页面高度
		const innerHeight = window.innerHeight
		const keyboardHeight = pageHeight.current - innerHeight
		if (keyboardHeight > 0) {
			console.log('键盘弹起', keyboardHeight)
			cacheStore.updateKeyboardHeight(keyboardHeight)
			// TODO: 可以做滚动处理
			window.removeEventListener('resize', handlerWindowResize)
		}

		console.log('键盘弹起', pageHeight.current, innerHeight)
	}

	useAsyncEffect(
		async () => {
			pageHeight.current = window.innerHeight

			const platform = await Device.getInfo()

			isWeb.current = platform.platform !== 'web'

			if (isWeb.current) {
				Keyboard?.addListener('keyboardWillShow', (info) => {
					console.log('keyboard will show with height:', info.keyboardHeight)
				})

				Keyboard?.addListener('keyboardDidShow', (info) => {
					console.log('keyboard did show with height:', info.keyboardHeight)
				})

				Keyboard?.addListener('keyboardWillHide', () => {
					console.log('keyboard will hide')
				})

				Keyboard?.addListener('keyboardDidHide', () => {
					console.log('keyboard did hide')
				})
			} else {
				window.addEventListener('resize', handlerWindowResize)
			}
		},
		() => {
			isWeb.current && Keyboard?.removeAllListeners()
			window.removeEventListener('resize', handlerWindowResize)
		},
		[]
	)
}

export default useKeyboard
