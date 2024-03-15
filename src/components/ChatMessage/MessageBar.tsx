/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck
import clsx from 'clsx'
import React, { RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { $t, MESSAGE_SEND, MESSAGE_TYPE, MessageMore, TOOLTIP_TYPE, hasImageHtml, scroll } from '@/shared'
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
import { useAsyncEffect, useClickOutside, useLongPress, useResizeObserver } from '@reactuses/core'
import { useTooltipsStore } from '@/stores/tooltips'
import MessageMoreComponent from './MessageMore'
import { Router } from 'framework7/types'
import useSpeechRecognition from '@/hooks/useSpeechRecognition'
// import { motion, useTime, useTransform } from 'framer-motion'
import StorageService from '@/api/storage'
import './css/MessageBar.scss'
import { EmitterSource } from 'quill/core/emitter'

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
	// const [width, setWidth] = useState<number>(0)

	// 检查语言权限
	const { startRecording, stopRecording, isRecording, audioData, error } = useSpeechRecognition()

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

		let content = '14 "'

		if (quill) content = quill.getSemanticHTML()
		if (hasImageHtml(content)) type = MESSAGE_TYPE.IMAGE

		// 发送或编辑消息
		tooltipStore.type === TOOLTIP_TYPE.EDIT
			? msgStore.editMessage(tooltipStore.selectItem, content)
			: msgStore.sendMessage(type, content, {
					replay_id: tooltipStore.type === TOOLTIP_TYPE.REPLY ? tooltipStore.selectItem?.msg_id : 0
				})

		tooltipStore.updateType(TOOLTIP_TYPE.NONE)

		// 发送成功的操作
		if (quill) quill.deleteText(0, quill.getLength() - 1)
		if (quill && !moreType) quill.focus()

		setMsgType(MESSAGE_TYPE.TEXT)
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

	// const [test, setTest] = useState<boolean>(true)
	const [audioBtn, setAudioBtn] = useState<boolean>(false)
	const recordRef = useRef<HTMLDivElement | null>(null)
	const onLongPress = () => {
		setAudioBtn(true)
		startRecording()
	}
	const longPressEvent = useLongPress(onLongPress, { delay: 300 })
	const audioRef = useRef<HTMLDivElement | null>(null)

	const handlerTouchEnd = async () => {
		stopRecording()
		setAudioBtn(false)
	}

	useEffect(() => {
		requestAnimationFrame(() => {
			const timer = setTimeout(() => {
				if (!editorRef.current || !editorRef.current.quill) return

				const quill = editorRef.current.quill

				let eventSources: EmitterSource = Quill.sources.API

				quill.on(Quill.events.EDITOR_CHANGE, (type, _newDelta, _oldDelta, source) => {
					if (type !== Quill.events.SELECTION_CHANGE) {
						setShowBtn(quill.getLength() > 1)
					}
					eventSources = source
				})

				quill.root.addEventListener('focus', () => {
					if (eventSources === Quill.sources.API) return
					setKeyboardHeight(0)
					setMoreType(MessageMore.TEXT)
					quill.blur()
					setTimeout(() => quill.focus(), 300)
				})

				clearTimeout(timer)
			}, 0)
		})

		// setWidth(document.body.clientWidth)

		const handlerContextmenu = (e: { preventDefault: () => any }) => e.preventDefault()

		const handlerTouchMove = (e: any) => {
			console.log('move', e)
		}

		audioRef.current?.addEventListener('contextmenu', handlerContextmenu)
		audioRef.current?.addEventListener('touchend', handlerTouchEnd)
		audioRef.current?.addEventListener('touchmove', handlerTouchMove)

		return () => {
			editorRef.current?.quill?.off(Quill.events.EDITOR_CHANGE)
			audioRef.current?.removeEventListener('contextmenu', handlerContextmenu)
			audioRef.current?.removeEventListener('touchend', handlerTouchEnd)
			audioRef.current?.removeEventListener('touchmove', handlerTouchMove)
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

	// 文件上传
	const upload = (file: File) => {
		return new Promise<{
			url: string
			file_id: string
		}>((resolve, reject) => {
			StorageService.uploadFile({
				file: file,
				type: 2
			})
				.then(({ code, data }: any) => {
					if (code !== 200) {
						reject(null)
						return
					}
					resolve(data)
				})
				.catch((err) => {
					console.log(err)
					reject(err)
				})
		})
	}

	// base64
	const fileBase64 = (file: File): Promise<string> => {
		return new Promise<string>((resolve, reject) => {
			const reader = new FileReader()
			reader.readAsDataURL(file)
			reader.onload = (e: any) => {
				resolve(e.target.result)
			}
			reader.onerror = (e) => {
				reject(e)
			}
		})
	}

	const fileTypeText = (type: string) => {
		switch (type) {
			case 'image/*':
				return '图片'
			case 'video/*':
				return '视频'
			default:
				return '文件'
		}
	}

	const fileMessageType = (type: string) => {
		switch (
			type
				.split('/')
				.map((part, index) => (index === 0 ? part : '*'))
				.join('/')
		) {
			case 'image/*':
				return MESSAGE_TYPE.IMAGE
			case 'video/*':
				return MESSAGE_TYPE.VIDEO
			default:
				return MESSAGE_TYPE.FILE
		}
	}

	// 文件选择
	const onSelectFiles = async (files: File[]) => {
		for (const file of files) {
			let fileMsg
			const type = file.type
			const typeText = fileTypeText(type)
			if (file.size > 1024 * 1024 * 500) {
				// 超过500M
				fileMsg = await msgStore.craeteMessage(MESSAGE_TYPE.FILE, `-`)
				fileMsg.content = `[${typeText}]`
				fileMsg.msg_send_state = MESSAGE_SEND.SEND_FAILED
				msgStore.updateDB(fileMsg, '文件过大[仅支持不超过500M的文件]', false)
				return
			}
			try {
				fileMsg = await msgStore.craeteMessage(fileMessageType(type), ``)
				fileMsg.msg_send_state = MESSAGE_SEND.SENDING
				fileMsg.content = JSON.stringify({
					url: await fileBase64(file),
					name: file.name,
					size: file.size
				})
				const { url, file_id } = await upload(file)
				fileMsg.content = JSON.stringify({
					url,
					name: file.name,
					size: file.size
				})
				fileMsg.file_id = file_id
				msgStore.send(fileMsg)
			} catch (error: any) {
				if (!fileMsg) return
				fileMsg.msg_send_state = MESSAGE_SEND.SEND_FAILED
				msgStore.updateDB(fileMsg, error.message ?? error, false)
			}
		}
	}

	useAsyncEffect(
		async () => {
			if (!audioData?.file) return
			let msg: any
			try {
				const duration = Math.ceil(audioData.duration / 1000)

				msg = await msgStore.craeteMessage(MESSAGE_TYPE.AUDIO, `${duration} "`)

				// 音频上传
				const { code, data, msg: message } = await StorageService.uploadFile({ file: audioData!.file, type: 0 })

				if (code !== 200) {
					throw new Error(message)
				}

				if (data) {
					msg.content = JSON.stringify({
						url: data.url,
						duration
					})
					msg.msg_send_state = MESSAGE_SEND.SEND_SUCCESS
					msg.msg_url = data.url
					msg.file_id = data.file_id
					msg.duration = duration
					msgStore.send(msg)
				}
			} catch (error: any) {
				if (msg) {
					msg.msg_send_state = MESSAGE_SEND.SEND_FAILED
					msgStore.updateDB(msg, error, false)
				}
			}
		},
		() => {},
		[audioData?.file]
	)

	useEffect(() => {
		if (error) console.log('报错')
	}, [error])

	return (
		<>
			<div
				className={clsx('message-toolbar bg-bgPrimary bottom-0 w-full h-auto z-[99] relative')}
				ref={toolbarRef}
			>
				<div className="flex flex-col justify-center items-center w-full">
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
								{/* <Button className="w-full flex h-9 mx-2 rounded animate__animated animate__zoomIn bg-bgTertiary justify-center items-center text-gray-500 select-none"> */}
								<div
									className="w-full flex h-9 mx-2 rounded animate__animated animate__zoomIn bg-bgTertiary justify-center items-center text-gray-500 select-none active:bg-primary active:bg-opacity-50 active:text-white"
									{...longPressEvent}
									ref={audioRef}
								>
									{$t('按住说话')}
								</div>
								{/* </Button> */}
								<Link onClick={() => moreTypeChange(MessageMore.TEXT)}>
									<PlusCircle className="text-4xl text-gray-500 mr-2" />
								</Link>
							</div>

							<div
								className={clsx(
									'w-full flex items-end px-2',
									msgType !== MESSAGE_TYPE.AUDIO ? 'flex' : 'hidden'
								)}
							>
								{isRecording || audioBtn ? (
									<div className="flex-1" />
								) : (
									<>
										<div className={clsx('flex-1 rounded')}>
											<div
												className="py-2 bg-bgTertiary rounded w-full flex items-center"
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
										<div className="flex h-[38px] items-center w-[40px] justify-center">
											{moreType === MessageMore.EMOJI ? (
												<Link onClick={() => moreTypeChange(MessageMore.TEXT)}>
													<KeyboardIcon className="text-4xl text-gray-500" />
												</Link>
											) : (
												<Link onClick={() => moreTypeChange(MessageMore.EMOJI)}>
													<FaceSmiling className="text-4xl text-gray-500" />
												</Link>
											)}
										</div>

										<div className="flex h-[38px] items-center w-[40px] justify-center">
											{moreType === MessageMore.OTHER ? (
												<Link onClick={() => moreTypeChange(MessageMore.TEXT)}>
													<KeyboardIcon className="text-4xl text-gray-500" />
												</Link>
											) : (
												<Link onClick={() => moreTypeChange(MessageMore.OTHER)}>
													<PlusCircle className="text-4xl text-gray-500" />
												</Link>
											)}
										</div>
									</>
								)}

								<div className="flex h-[38px] items-center w-[40px] justify-center relative">
									{showBtn ? (
										<Link onClick={sendMessage}>
											<ArrowRightCircleFill className="text-4xl text-primary animate__animated animate__zoomIn" />
										</Link>
									) : (
										<div
											onClick={() => {
												setMsgType(MESSAGE_TYPE.AUDIO)
											}}
											// {...longPressEvent}
										>
											<MicCircleFill
												className={clsx(
													'text-4xl text-primary animate__animated animate__zoomIn'
												)}
											/>
											<span className={clsx(audioBtn && 'living')}></span>
										</div>
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
									onSelectFiles={onSelectFiles}
								/>
							)}
						</div>
					</div>
				</div>
			</div>

			{isRecording && (
				<div
					className="fixed w-full h-screen bg-black bg-opacity-20 bottom-0 -z-1 flex justify-center items-center"
					ref={recordRef}
				>
					<div className="w-3/5 h-16 rounded recwave text-white text-center"></div>
				</div>
			)}

			{/* !isRecording ||  */}
			{/* <div
				className={clsx(
					'fixed bg-black bg-opacity-50 w-full h-screen top-0 left-0 z-[9999] flex items-end flex-col justify-end select-none',
					!isRecording ? '-z-10 opacity-0 hidden' : 'z-[9999] opacity-100'
				)}
				onContextMenu={(e) => e.preventDefault()}
				onTouchEnd={handlerTouchEnd}
			>
				<div className="flex flex-col justify-center items-center w-full relative z-1">
					<div className="w-[200px] mx-auto path mb-20 rounded-lg recwave" />

					<div className="flex w-full justify-between px-4">
						<div className="flex-1">
							<div className="w-16 h-16 bg-gray-200 rounded-full flex justify-center items-center">1</div>
						</div>
						<div className="flex-1 flex justify-end">
							<div className="w-16 h-16 bg-gray-200 rounded-full flex justify-center items-center">2</div>
						</div>
					</div>
					<div style={{ height: width / 2.5 + 'px' }} />
					<div
						className="absolute bg-gray-200 rounded-[100%] z-10 flex justify-center pt-10"
						style={{
							width: width * 1.5 + 'px',
							height: width + 'px',
							bottom: -width / 1.5 + 'px',
							left: -width / 4 + 'px'
						}}
					>
						111
					</div>
				</div>
			</div> */}
		</>
	)
}

export default MessageBar
