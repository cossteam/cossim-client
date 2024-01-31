import React, { useEffect, useRef, useState } from 'react'
import { VoiceIcon, AddIcon } from '@/components/Icon/Icon'
import { clsx } from 'clsx'
import { Button } from 'framework7-react'
import PropType from 'prop-types'
import Emojis from '@/components/Emojis/Emojis.jsx'
import Editor from '@/utils/editor'

function MsgBar(props) {
	// 整个底部
	const msgbarRef = useRef(null)
	// 文本输入框
	const textareaRef = useRef(null)
	// 发送按钮显示隐藏
	const [showSendBtn, setShowSendBtn] = useState(false)
	// 文本内容
	const [content, setContent] = useState('')
	// 更多操作
	const [showMore, setShowMore] = useState(false)
	// 操作类型
	const [type, setType] = useState('emoji')
	// 首次进入
	const [isFrist, setIsFrist] = useState(true)
	// 编辑器
	const [editor, setEditor] = useState(null)

	const onEmojiSelect = ({ type, emoji }) => {
		console.log(type, emoji)
		console.log(type === 'emoji')
		console.log(window.getSelection())
		// type === 'emoji' && editor.insertEmoji(emoji)
		// editor.focus()
	}

	const send = () => {
		if (!content) return
		props.send(content)
		setContent('')
		editor.clear().focus()
	}

	const handlerShowMore = (moreType) => {
		if (type === moreType) setShowMore(!showMore)
		setType(moreType)
	}

	useEffect(() => {
		if (textareaRef.current) {
			const editor = new Editor(textareaRef.current, {
				placeholder: '请输入内容',
				defaultHeight: '42px'
			})
			// 输入事件
			editor.on('input', (e) => setContent(e.target.textContent))
			setEditor(editor)
		}
	}, [])

	useEffect(() => {
		setShowSendBtn(!!content)

		if (!isFrist && !showMore) {
			requestAnimationFrame(() => setTimeout(() => textareaRef.current.focus(), 200))
		}
		isFrist && setIsFrist(false)
	}, [content, showMore])

	return (
		<div
			className={clsx(
				'fixed transition-all bottom-0 duration-[350ms] ease-in-out  left-0 right-0 h-auto min-h-14 border-t z-[999] bg-white msg-chat',
				showMore ? 'translate-y-0' : 'translate-y-[300px]'
			)}
			ref={msgbarRef}
		>
			<div className="rounded-2xl w-full h-auto flex items-end gap-2 p-2">
				<VoiceIcon className="w-9 h-9" />
				{/* <div
					contentEditable
					data-placeholder="输入消息"
					className="textarea w-full resize-none outline-none h-[40px] max-h-[150px] rounded-xl border p-2 empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 focus:before:content-none"
					ref={textareaRef}
					onInput={(e) => handlerTextareHeight(e)}
					onFocus={handlerFocus}
					onBlur={handlerBlur}
				/> */}
				<div
					className="textarea w-full resize-none outline-none h-[40px] max-h-[150px] rounded-xl border p-2 empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 focus:before:content-none"
					ref={textareaRef}
					id="chat-editor"
				/>

				<AddIcon
					className={clsx('w-9 h-9', showSendBtn ? 'hidden' : 'flex')}
					onClick={() => handlerShowMore('emoji')}
				/>
				<AddIcon
					className={clsx('w-9 h-9', showSendBtn ? 'hidden' : 'flex')}
					onClick={() => handlerShowMore('more')}
				/>
				<Button
					raised
					fill
					className={clsx(
						'animate__animated animate__faster whitespace-nowrap w-[80px] mb-1',
						showSendBtn ? 'block animate__fadeInRight' : 'animate__fadeInLeft hidden'
					)}
					onClick={send}
				>
					发送
				</Button>
			</div>
			<div className={clsx('w-full h-[300px] overflow-y-auto bg-[#f5f5f5]')}>
				{type === 'emoji' ? <Emojis onEmojiSelect={onEmojiSelect} /> : null}
			</div>
		</div>
	)
}

MsgBar.propTypes = {
	send: PropType.func
}

export default MsgBar
