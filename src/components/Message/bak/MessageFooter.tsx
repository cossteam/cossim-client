/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-nocheck
import ToolEditor, { ReadEditor, ToolEditorMethods } from '@/Editor'
import { $t, MessageMore, TOOLTIP_TYPE } from '@/shared'
import { useTooltipsStore } from '@/stores/tooltips'
import clsx from 'clsx'
import {
	ArrowRightCircleFill,
	ArrowUpRight,
	FaceSmiling,
	MicCircleFill,
	PlusCircle,
	Trash,
	XmarkCircle
} from 'framework7-icons/react'
import { Link } from 'framework7-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { KeyboardIcon } from '../../Icon/Icon'
import Quill from 'quill'
import { useClickOutside } from '@reactuses/core'

const MessageFooter = () => {
	const tooltipStore = useTooltipsStore()
	const editorRef = useRef<ToolEditorMethods>(null)
	const inputRef = useRef<HTMLDivElement | null>(null)

	// 选择表情或者文字或者更多
	const [messageMore] = useState<MessageMore>(MessageMore.TEXT)
	// 发送按钮或者语音按钮
	// const [setVisible] = useState<boolean>(false)
	// 编辑器只读
	const [readonly, setReadonly] = useState<boolean>(false)

	useClickOutside(inputRef, () => {
		setReadonly(false)
	})

	useEffect(() => {
		requestAnimationFrame(() => {
			const timer = setTimeout(() => {
				if (!editorRef.current || !editorRef.current.quill) return

				const quill = editorRef.current.quill
				quill.on(Quill.events.EDITOR_CHANGE, (type: string) => {
					if (type !== Quill.events.SELECTION_CHANGE) {
						// setVisible(quill.getLength() > 1)
					}
				})

				clearTimeout(timer)
			}, 0)
		})

		return () => {
			editorRef.current?.quill?.off(Quill.events.EDITOR_CHANGE)
		}
	}, [])

	const isSelect = useMemo(() => false, [])

	const focusInput = () => {
		if (!editorRef.current) return
		setReadonly(true)
	}

	return (
		<div className={clsx('message-toolbar bg-bgPrimary bottom-0 w-full h-auto z-[99] relative')}>
			<div className="flex flex-col justify-center items-center">
				<div className="w-full rounded-2xl flex items-end relative h-full py-3">
					<div className={clsx('w-full', isSelect ? 'flex' : 'hidden')}>
						<div className="w-full flex bg-bgPrimary">
							<Link
								className="flex flex-col flex-1 items-center justify-center"
								// onClick={() => tooltipStore.updateShowSelect(true)}
							>
								<ArrowUpRight className="text-xl mb-1" />
								<span className="text-[0.75rem]">{$t('转发')}</span>
							</Link>
							<Link
								className="flex flex-col flex-1 items-center justify-center"
								// onClick={() => tooltipStore.updateSelectDelete(true)}
							>
								<Trash className="text-xl mb-1" />
								<span className="text-[0.75rem]">{$t('删除')}</span>
							</Link>
						</div>
					</div>

					<div className={clsx('w-full', !isSelect ? 'flex' : 'hidden')}>
						<div
							className={clsx(
								'w-full flex items-end',
								messageMore === MessageMore.TEXT ? 'flex' : 'hidden'
							)}
						>
							<div className={clsx('flex-1 rounded pl-2')}>
								<div
									className="py-2 bg-bgSecondary rounded w-full flex items-center"
									onClick={focusInput}
									ref={inputRef}
								>
									<ToolEditor
										ref={editorRef}
										readonly={readonly}
										placeholder={$t('请输入内容')}
										// id={receiver_id}
										// is_group={is_group}
									/>
								</div>
								{[TOOLTIP_TYPE.EDIT, TOOLTIP_TYPE.REPLY].includes(tooltipStore.type) && (
									<div className="mt-1 bg-bgTertiary relative flex justify-between">
										<ReadEditor
											content={tooltipStore.selectItem?.content ?? ''}
											className="reply-read-editor"
										/>
										<Link className="pr-2">
											<XmarkCircle className="text-textTertiary" />
										</Link>
									</div>
								)}
							</div>
							<div className="flex items-center px-2">
								{messageMore === MessageMore.EMOJI ? (
									<Link>
										<KeyboardIcon className="text-4xl text-gray-500 mr-2" />
									</Link>
								) : (
									<Link>
										<FaceSmiling className="text-4xl text-gray-500 mr-2" />
									</Link>
								)}

								{messageMore === MessageMore.OTHER ? (
									<Link>
										<KeyboardIcon className="text-4xl text-gray-500 mr-2" />
									</Link>
								) : (
									<Link>
										<PlusCircle className="text-4xl text-gray-500 mr-2" />
									</Link>
								)}

								{messageMore === MessageMore.AUDIO ? (
									<Link>
										<ArrowRightCircleFill className="text-4xl text-primary animate__animated animate__zoomIn" />
									</Link>
								) : (
									<Link>
										<MicCircleFill className="text-4xl text-primary animate__animated animate__zoomIn" />
									</Link>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default MessageFooter
