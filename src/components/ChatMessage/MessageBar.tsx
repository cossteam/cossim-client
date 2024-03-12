/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck
import clsx from 'clsx'
import React, { RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { $t, MESSAGE_TYPE, MessageMore, TOOLTIP_TYPE, hasImageHtml, scroll } from '@/shared'
import { useMessageStore } from '@/stores/message'
import { Link } from 'framework7-react'
import {
	ArrowRightCircleFill,
	ArrowUpRight,
	FaceSmiling,
	MicCircleFill,
	PlusCircle,
	Trash,
	// Xmark,
	XmarkCircle
} from 'framework7-icons/react'
import { KeyboardIcon } from '@/components/Icon/Icon'
import ToolEditor, { ReadEditor, type ToolEditorMethods } from '@/Editor'
import Emojis from '@/components/Emojis/Emojis'
import Quill from 'quill'
import { useClickOutside, useResizeObserver } from '@reactuses/core'
import { useTooltipsStore } from '@/stores/tooltips'
import MessageMoreComponent from './MessageMore'
import { Router } from 'framework7/types'
import useSpeechRecognition from '@/hooks/useSpeechRecognition'
import { motion, useTime, useTransform } from 'framer-motion'

interface MessageBarProps {
	contentEl: RefObject<HTMLDivElement>
	isScrollEnd: (setp?: number) => boolean
	receiver_id: string
	is_group: boolean
	is_system?: boolean
	f7router?: Router.Router
	members: any[]
}

const MessageBar: React.FC<MessageBarProps> = ({ contentEl, receiver_id, is_group, is_system, f7router, members }) => {
	const msgStore = useMessageStore()
	const toolbarRef = useRef<HTMLDivElement | null>(null)
	const editorRef = useRef<ToolEditorMethods>(null)
	const moreRef = useRef<HTMLDivElement | null>(null)
	const tooltipStore = useTooltipsStore()
	const [width, setWidth] = useState<number>(0)

	// 检查语言权限
	const { startRecording, stopRecording, isRecording, audioData } = useSpeechRecognition()

	// 键盘高度
	const [keyboardHeight, setKeyboardHeight] = useState<number>(0)

	useResizeObserver(contentEl, () => scroll(contentEl.current!, false))
	useClickOutside(toolbarRef, () => {
		editorRef.current?.quill?.blur()
		setKeyboardHeight(0)
		setMoreType(MessageMore.TEXT)
	})

	const [msgType, setMsgType] = useState(MESSAGE_TYPE.TEXT)
	const [moreType, setMoreType] = useState(MessageMore.TEXT)

	const moreTypeChange = useCallback((type: MessageMore) => {
		if (type !== MessageMore.TEXT) {
			setKeyboardHeight(300)
		} else {
			setKeyboardHeight(0)
			requestAnimationFrame(() => {
				setTimeout(() => editorRef.current?.quill?.focus(), 100)
			})
		}
		setMoreType(type)
	}, [])

	// 是否处于多选状态
	const isSelect = useMemo(() => tooltipStore.type === TOOLTIP_TYPE.SELECT, [tooltipStore.type])
	// 切换按钮
	const [showBtn, setShowBtn] = useState<boolean>(false)

	// 发送消息
	const sendMessage = () => {
		const quill = editorRef.current!.quill
		let type = msgType

		const content = quill.getSemanticHTML()
		if (hasImageHtml(content)) type = MESSAGE_TYPE.IMAGE

		// 发送或编辑消息
		tooltipStore.type === TOOLTIP_TYPE.EDIT
			? msgStore.editMessage(tooltipStore.selectItem, content)
			: msgStore.sendMessage(type, content, {
					replay_id: tooltipStore.type === TOOLTIP_TYPE.REPLY ? tooltipStore.selectItem?.msg_id : 0
				})

		tooltipStore.updateType(TOOLTIP_TYPE.NONE)

		// 发送成功的操作
		quill.deleteText(0, quill.getLength() - 1)
		if (!moreType) quill.focus()
	}

	// 发送表情
	const onSelectEmojis = (emojis: any) => {
		// 先确保编辑器已经聚焦
		editorRef.current?.quill?.focus()
		editorRef.current?.quill?.insertText(
			editorRef.current?.quill.getSelection()?.index || 0,
			emojis.native,
			Quill.sources.API
		)
		editorRef.current?.quill?.blur()
	}

	useEffect(() => {
		requestAnimationFrame(() => {
			const timer = setTimeout(() => {
				if (!editorRef.current || !editorRef.current.quill) return

				const quill = editorRef.current.quill

				// let eventSources: EmitterSource = Quill.sources.API

				quill.on(Quill.events.EDITOR_CHANGE, (type: string) => {
					if (type !== Quill.events.SELECTION_CHANGE) {
						setShowBtn(quill.getLength() > 1)
					}
					// eventSources = source
				})

				// quill.root.addEventListener('focus', () => {
				// if (eventSources === Quill.sources.API) return
				// setKeyboardHeight(0)
				// setMoreType(MessageMore.TEXT)
				// quill.blur()
				// setTimeout(() => quill.focus(), 300)
				// })

				clearTimeout(timer)
			}, 0)
		})

		setWidth(document.body.clientWidth)

		return () => {
			editorRef.current?.quill?.off(Quill.events.EDITOR_CHANGE)
		}
	}, [])

	// 删除编辑状态或回复状态
	const clear = () => {
		tooltipStore.updateType(TOOLTIP_TYPE.NONE)
		editorRef.current?.quill.deleteText(0, editorRef.current?.quill.getLength())
	}

	const handlerInputClick = () => {
		setKeyboardHeight(0)
		setMoreType(MessageMore.TEXT)
		// setTimeout(() => editorRef.current?.quill?.focus(), 300)
	}

	const onSelectImages = (images: string[]) => {
		console.log('files', images)
	}

	const time = useTime()
	const rotate = useTransform(
		time,
		[0, 4000], // For every 4 seconds...
		[0, 360], // ...rotate 360deg
		{ clamp: false }
	)

	const playAudio = async () => {
		if (audioData) {
			const audio = new Audio(URL.createObjectURL(audioData))
			audio.play()
		}
	}

	return (
		<>
			<button onClick={playAudio} className="h-16 bg-slate-200">
				play
			</button>
			<button onClick={startRecording} className="h-16 bg-slate-200">
				Start Recording
			</button>
			<button onClick={stopRecording} className="h-16 bg-slate-500">
				Stop Recording
			</button>
			<div
				className={clsx('message-toolbar bg-bgPrimary bottom-0 w-full h-auto z-[99] relative')}
				ref={toolbarRef}
			>
				<div className="flex flex-col justify-center items-center">
					<div className="w-full rounded-2xl flex items-end relative h-full py-2">
						<div className={clsx('w-full', isSelect ? 'flex' : 'hidden')}>
							<div className="w-full flex bg-bgPrimary">
								<Link
									className="flex flex-col flex-1 items-center justify-center"
									onClick={() => tooltipStore.updateShowSelect(true)}
								>
									<ArrowUpRight className="text-xl mb-1" />
									<span className="text-[0.75rem]">{$t('转发')}</span>
								</Link>
								<Link
									className="flex flex-col flex-1 items-center justify-center"
									onClick={() => tooltipStore.updateSelectDelete(true)}
								>
									<Trash className="text-xl mb-1" />
									<span className="text-[0.75rem]">{$t('删除')}</span>
								</Link>
							</div>
						</div>

						<div className={clsx('w-full', !isSelect ? 'flex' : 'hidden')}>
							<div
								className={clsx('flex-1 px-2 flex', msgType === MESSAGE_TYPE.AUDIO ? 'flex' : 'hidden')}
							>
								<Link
									onClick={() => {
										setMsgType(MESSAGE_TYPE.TEXT)
										setTimeout(() => editorRef.current?.quill.focus(), 0)
									}}
								>
									<KeyboardIcon className="text-4xl text-gray-500 mr-2 animate__animated animate__zoomIn" />
								</Link>
								<div
									className="w-full h-9 mx-2 rounded animate__animated animate__zoomIn bg-bgTertiary flex justify-center items-center text-gray-500"
									// onKeyDown={startRecording}
									// onKeyUp={stopRecording}
									onClick={() => {
										startRecording()
										setTimeout(() => stopRecording(), 3000)
									}}
									// onTouchEnd={stopRecording}
								>
									{isRecording ? $t('取消') : $t('按住说话')}
								</div>
								<Link onClick={() => moreTypeChange(MessageMore.TEXT)}>
									<PlusCircle className="text-4xl text-gray-500 mr-2" />
								</Link>
							</div>

							<div
								className={clsx(
									'w-full flex items-end',
									msgType !== MESSAGE_TYPE.AUDIO ? 'flex' : 'hidden'
								)}
							>
								<div className={clsx('flex-1 rounded pl-2')}>
									<div
										className="py-2 bg-bgSecondary rounded w-full flex items-center"
										onClick={handlerInputClick}
									>
										<ToolEditor
											ref={editorRef}
											readonly={false}
											placeholder={$t('请输入内容')}
											id={receiver_id}
											is_group={is_group}
										/>
									</div>
									{[TOOLTIP_TYPE.EDIT, TOOLTIP_TYPE.REPLY].includes(tooltipStore.type) && (
										<div className="mt-1 bg-bgTertiary relative flex justify-between">
											<ReadEditor
												content={tooltipStore.selectItem?.content ?? ''}
												className="reply-read-editor"
											/>
											<Link className="pr-2" onClick={clear}>
												<XmarkCircle className="text-textTertiary" />
											</Link>
										</div>
									)}
								</div>
								<div className="flex items-center px-2">
									{moreType === MessageMore.EMOJI ? (
										<Link onClick={() => moreTypeChange(MessageMore.TEXT)}>
											<KeyboardIcon className="text-4xl text-gray-500 mr-2" />
										</Link>
									) : (
										<Link onClick={() => moreTypeChange(MessageMore.EMOJI)}>
											<FaceSmiling className="text-4xl text-gray-500 mr-2" />
										</Link>
									)}

									{moreType === MessageMore.OTHER ? (
										<Link onClick={() => moreTypeChange(MessageMore.TEXT)}>
											<KeyboardIcon className="text-4xl text-gray-500 mr-2" />
										</Link>
									) : (
										<Link onClick={() => moreTypeChange(MessageMore.OTHER)}>
											<PlusCircle className="text-4xl text-gray-500 mr-2" />
										</Link>
									)}

									{showBtn ? (
										<Link onClick={sendMessage}>
											<ArrowRightCircleFill className="text-4xl text-primary animate__animated animate__zoomIn" />
										</Link>
									) : (
										<Link
											onClick={() => {
												setMsgType(MESSAGE_TYPE.AUDIO)
											}}
										>
											<MicCircleFill className="text-4xl text-primary animate__animated animate__zoomIn" />
										</Link>
									)}
								</div>
							</div>
						</div>
					</div>
					<div
						className={clsx('w-full overflow-hidden')}
						style={{
							height: keyboardHeight + 'px'
						}}
						ref={moreRef}
					>
						<Emojis
							onSelectEmojis={onSelectEmojis}
							className={moreType === MessageMore.EMOJI ? '' : 'hidden'}
						/>
						<div
							className={clsx(
								'w-full h-full overflow-y-auto',
								moreType === MessageMore.OTHER ? '' : 'hidden'
							)}
						>
							{!is_system && (
								<MessageMoreComponent
									is_group={is_group}
									id={receiver_id}
									f7router={f7router!}
									members={members}
									onSelectImages={onSelectImages}
								/>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* <div className="fixed bg-black bg-opacity-50 w-full h-full top-0 left-0 z-[9999] flex items-end flex-col justify-end">
				<div className="flex flex-col justify-center items-center w-full relative z-1">
					<motion.div style={{ rotate }} className="w-12 h-12 bg-white" />
					<div className="" style={{ height: width / 2 + 'px' }}></div>
					<div
						className="absolute bg-gray-200 rounded-[100%] z-10"
						style={{
							width: width * 1.5 + 'px',
							height: width + 'px',
							bottom: -width / 1.5 + 'px',
							left: -width / 4 + 'px'
						}}
					></div>
				</div>
			</div> */}
		</>
	)
}

export default MessageBar
