// import { useState } from 'react'
import React, { useEffect, useRef, useState } from 'react'
import { VoiceIcon, EmojiIcon, AddIcon } from '@/components/Icon/Icon'
import { clsx } from 'clsx'
import { Button } from 'framework7-react'
import PropType from 'prop-types'
import Emojis from '@/components/Emojis/Emojis.jsx'

function MsgBar(props) {
    const msgbarRef = useRef(null)
	const textareaRef = useRef(null)
	// 发送按钮显示隐藏
	const [showSendBtn, setShowSendBtn] = useState(false)
	// 文本内容
	const [content, setContent] = useState('')
	// 更多操作
	const [showMore, setShowMore] = useState(false)
	// 操作类型
	const [type, setType] = useState('emoji')

	const handlerTextareHeight = (e) => {
		setContent(e.target.textContent)
		if (textareaRef.current) {
			textareaRef.current.style.height = '42px'
			textareaRef.current.style.height = e.target.scrollHeight + 'px'
			textareaRef.current.style.overflow = e.target.scrollHeight >= 150 ? 'auto' : 'hidden'
		}
	}

	const send = () => {
		if (!content) return
		props.send(content)
	}

	const handlerShowMore = (moreType) => {
		if (type === moreType) setShowMore(!showMore)
		setType(moreType)
	}

	useEffect(() => {
		setShowSendBtn(!!content)
        !showMore && setTimeout(() => textareaRef.current.focus(), 150)
	}, [content,showMore])

	return (
		<div
			className={clsx(
				'fixed transition-all bottom-0 duration-300 left-0 right-0 h-auto min-h-14 border-t z-[999] bg-white msg-chat',
                showMore ? 'translate-y-0' : 'translate-y-[300px]'
			)}
            ref={msgbarRef}
		>
			<div className="rounded-2xl w-full h-auto flex items-end gap-2 p-2">
				<VoiceIcon className="w-9 h-9" />
				{/* <textarea
					name=""
					id=""
					placeholder="输入消息..."
					className="w-full resize-none border-none outline-none h-[40px] max-h-[150px] p-2 rounded-xl"
					ref={textareaRef}
					onChange={(e) => handlerTextareHeight(e)}
					onFocus={() => setShowMore(false)}
					value={content}
				/> */}
				<div
					contentEditable
					data-placeholder="输入消息"
					className="textarea w-full resize-none outline-none h-[40px] max-h-[150px] rounded-xl border p-2 empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 focus:before:content-none"
					ref={textareaRef}
					onInput={(e) => handlerTextareHeight(e)}
					onFocus={() => setShowMore(false)}
				/>

				<EmojiIcon className="w-9 h-9" onClick={() => handlerShowMore('emoji')} />
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
			<div className={clsx('w-full h-[300px] overflow-y-auto bg-[#f5f5f5]')} >
				{type === 'emoji' ? <Emojis /> : null}
			</div>
		</div>
	)
}

MsgBar.propTypes = {
	send: PropType.func
}

export default MsgBar
