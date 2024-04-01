import ToolEditor, { ToolEditorMethods } from '@/Editor'
import { $t, emojiOrMore, msgSendType } from '@/shared'
import { useEffect, useRef } from 'react'
import useMessageStore from '@/stores/new_message'
import useCacheStore from '@/stores/cache'
import Quill from 'quill'
import MessageBlockquote from './MessageBlockquote'
// import { Keyboard, KeyboardResize } from '@capacitor/keyboard'
// import { isWeb } from '@/utils'

const MessageInput = () => {
	const toolEditorRef = useRef<ToolEditorMethods | null>(null)
	const messageStore = useMessageStore()
	const cacheStore = useCacheStore()

	const inputRef = useRef<HTMLDivElement | null>(null)

	const isEmojiFocus = useRef<boolean>(false)

	const handlerChange = (content: string) => {
		if (!toolEditorRef.current) return
		const isEmpty = toolEditorRef.current.quill.getLength() <= 1
		const sendType = isEmpty ? msgSendType.AUDIO : msgSendType.TEXT
		messageStore.update({ content, sendType })
	}

	useEffect(() => {
		if (!toolEditorRef.current || !toolEditorRef.current.quill) return

		const quill = toolEditorRef.current.quill

		const handlerFocus = () => {
			// const rect = quill.root.getBoundingClientRect()
			// const viewportHeight = window.innerHeight || document.documentElement.clientHeight

			// console.log('rect.bottom', rect.bottom)

			// // 判断输入框底部是否在视口上方
			// if (rect.bottom > viewportHeight) {
			// 	console.log('Input field is covered by the keyboard.')
			// 	// 此时输入框被软键盘覆盖
			// 	// 可以执行相应的操作，如页面滚动或其他处理
			// } else {
			// 	console.log('Input field is visible.')
			// 	// 输入框可见
			// }

			// setTimeout(() => Keyboard.setResizeMode({ mode: KeyboardResize.None }

			// 如果是插入表情触发的聚焦，不做处理
			if (isEmojiFocus.current) return

			messageStore.update({ toolbarType: emojiOrMore.KEYBOARD })

			// 如果是web端就不需要弹起
			// const web = await isWeb()
			// if (!web) {
			// 	messageStore.update({ toolbarType: emojiOrMore.KEYBOARD })
			// }
			// messageStore.update({ toolbarType: emojiOrMore.NONE })
		}

		const handlerBlur = () => {
			// messageStore.update({ toolbarType: emojiOrMore.NONE })
			// Keyboard.setResizeMode({ mode: KeyboardResize.Native })
			console.log(' 离开')
		}

		quill.root.addEventListener('focus', handlerFocus)
		quill.root.addEventListener('blur', handlerBlur)

		return () => {
			quill.root.removeEventListener('focus', handlerFocus)
			quill.root.removeEventListener('blur', handlerBlur)
		}
	}, [toolEditorRef.current])

	// 插入表情
	useEffect(() => {
		if (!messageStore.selectedEmojis) return
		const quill = toolEditorRef.current?.quill
		if (!quill) return
		isEmojiFocus.current = true
		quill?.focus()
		quill?.insertText(quill.getSelection()?.index || 0, messageStore.selectedEmojis, Quill.sources.API)
		quill?.blur()
		isEmojiFocus.current = false
		messageStore.update({ selectedEmojis: '' })
	}, [messageStore.selectedEmojis])

	// 清空文本
	useEffect(() => {
		if (!messageStore.isClearContent) return
		const quill = toolEditorRef.current?.quill
		if (!quill) return
		quill.deleteText(0, quill.getLength() - 1)
		if (toolEditorRef.current && !isEmojiFocus.current) quill.focus()
		messageStore.update({ isClearContent: false })
	}, [messageStore.isClearContent])

	// 点击键盘时聚焦输入框
	useEffect(() => {
		if (messageStore.toolbarType !== emojiOrMore.KEYBOARD) return
		const quill = toolEditorRef.current?.quill
		if (!quill) return
		quill.focus()
	}, [messageStore.toolbarType])

	// 监听收起
	useEffect(() => {
		const quill = toolEditorRef.current?.quill
		if (!quill) return

		if (!cacheStore.keyboardShow && quill.hasFocus()) {
			quill.blur()
		}

		if (!cacheStore.keyboardShow && messageStore.toolbarType === emojiOrMore.KEYBOARD) {
			messageStore.update({ toolbarType: emojiOrMore.NONE })
		}
	}, [cacheStore.keyboardShow])

	useEffect(() => {
		// 获取输入框元素
		// const inputField = document.getElementById('your-input-field-id')
		// 监听输入框获得焦点事件
		// inputField.addEventListener('focus', () => {
		// 	const rect = inputField.getBoundingClientRect()
		// 	const viewportHeight = window.innerHeight || document.documentElement.clientHeight
		// 	// 判断输入框底部是否在视口上方
		// 	if (rect.bottom > viewportHeight) {
		// 		console.log('Input field is covered by the keyboard.')
		// 		// 此时输入框被软键盘覆盖
		// 		// 可以执行相应的操作，如页面滚动或其他处理
		// 	} else {
		// 		console.log('Input field is visible.')
		// 		// 输入框可见
		// 	}
		// })
	}, [])

	return (
		<div className="flex-1 max-w-[calc(100%-108px)]">
			<div
				className="flex py-2 flex-col justify-center bg-bgTertiary min-h-10 rounded max-h-[150px] overflow-y-auto overflow-x-hidden"
				ref={inputRef}
			>
				<MessageBlockquote />
				<ToolEditor
					readonly={false}
					placeholder={$t('请输入消息')}
					ref={toolEditorRef}
					defaultValue={messageStore.draft}
					onChange={handlerChange}
				/>
			</div>
		</div>
	)
}

export default MessageInput
