import React, { useEffect, useRef, useState } from 'react'
import { VoiceIcon, AddIcon } from '@/components/Icon/Icon'
import { clsx } from 'clsx'
import { Button } from 'framework7-react'
import PropType from 'prop-types'
import Emojis from '@/components/Emojis/Emojis.jsx'
// import Editor from '@/utils/editor'
import Editor from '@/components/Editor/Editor'
import { sendType, tooltipsType, msgType } from '@/utils/constants'
import { Multiply } from 'framework7-icons/react'
import More from './More'
import { ArrowUpRight } from 'framework7-icons/react'


function MsgBar(props) {
	// 整个底部
	const msgbarRef = useRef(null)
	// 发送按钮显示隐藏
	const [showSendBtn, setShowSendBtn] = useState(false)
	// 更多操作
	const [showMore, setShowMore] = useState(false)
	// 操作类型
	const [type, setType] = useState('')
	// 首次进入
	const [isFrist, setIsFrist] = useState(true)
	// 编辑器引擎实例
	const [engine, setEngine] = useState(null)
	// 消息类型
	const [msgtype, setMsgtype] = useState(msgType.TEXT)

	const onEmojiSelect = ({ type, emoji }) => {
		console.log(type, emoji)
		console.log(type === 'emoji')
		console.log(window.getSelection())
		// type === 'emoji' && editor.insertEmoji(emoji)
		// editor.focus()
	}

	const send = () => {
		let value = engine.model.toValue()
		props.send(value, msgtype, props.defaultMsg)
		engine?.setValue('')
		engine?.focus()
	}

	const handlerShowMore = (moreType) => {
		if (type === moreType) setShowMore(!showMore)
		setType(moreType)
	}

	// const get

	useEffect(() => {
		if (engine) {
			engine.on('change', () => {
				setShowSendBtn(!engine.isEmpty())
			})

			// 如果聚焦了输入框
			engine.on('focus', () => {
				setShowMore(false)
			})
		}
	}, [engine])

	useEffect(() => {
		if (engine) {
			engine.on('mention:default', () => {
				console.log('props', props.list)
				const arr = props.list.map((v) => ({
					key: v.user_id,
					name: v.nickname
				}))
				console.log('arr', arr)
				return arr
			})
		}
	}, [props.list])

	useEffect(() => {
		if (!isFrist && !showMore) {
			requestAnimationFrame(() => setTimeout(() => engine.focus(), 200))
		}
		isFrist && setIsFrist(false)
	}, [showMore])

	const tooltips = [
		{
			name: tooltipsType.FORWARD,
			title: '转发',
			icon: <ArrowUpRight className="w-5 h-5" />
		},
		{
			name: tooltipsType.DELETE,
			title: '删除',
			icon: <ArrowUpRight className="w-5 h-5" />
		}
	]

	return (
		<>
			{props?.isSelect && (
				<div className="fixed transition-all bottom-0 h-14 left-0 right-0 z-[1000] bg-white flex items-center">
					{tooltips.map((item, index) => (
						<div
							className="flex flex-col items-center justify-center h-full w-1/2"
							key={index}
							onClick={() => props?.select(item.name)}
						>
							<div className="mb-[3px]">{item.icon}</div>
							<span className="text-[0.7rem]">{item.title}</span>
						</div>
					))}
				</div>
			)}

			<div
				className={clsx(
					'fixed transition-all bottom-0 duration-[350ms] ease-in-out  left-0 right-0 h-auto min-h-14 border-t z-[999] bg-white msg-chat',
					showMore ? 'translate-y-0' : 'translate-y-[300px]'
				)}
				ref={msgbarRef}
			>
				<div className="rounded-2xl w-full h-auto flex items-end gap-2 p-2">
					<VoiceIcon className="w-9 h-9" />
					<div className="w-full">
						<Editor
							setEditor={setEngine}
							className="min-h-[42px] max-h-[150px] rounded-xl border p-2 overflow-y-auto"
							defaultValue={(props.type === sendType.EDIT && props.defaultMsg?.msg_content) || ''}
							is_group={props?.is_group}
							list={props?.list}
						/>
						{[sendType.REPLY, sendType.EDIT].includes(props.type) && (
							<div className="bg-[#f5f5f5] mt-2 px-2 py-1 rounded relative felx justify-between items-center">
								<Editor
									className="w-[calc(100%-40px)] overflow-hidden h-[24px] line-clamp-1"
									readonly={true}
									defaultValue={props.defaultMsg?.msg_content || ''}
								/>
								<Multiply
									className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
									onClick={() => props?.setType(sendType.SEND)}
								/>
							</div>
						)}
					</div>

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
					{type === 'emoji' ? (
						<Emojis onEmojiSelect={onEmojiSelect} />
					) : (
						<More onMoreSelect={props?.onMoreSelect} />
					)}
				</div>
			</div>
		</>
	)
}

MsgBar.propTypes = {
	send: PropType.func,
	defaultMsg: PropType.object,
	type: PropType.number,
	setType: PropType.func,
	onMoreSelect: PropType.func,
	isSelect: PropType.bool,
	select: PropType.func,
	is_group: PropType.bool,
	list: PropType.array
}

export default MsgBar
