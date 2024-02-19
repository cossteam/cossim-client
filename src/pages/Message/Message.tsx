import { Ellipsis } from 'framework7-icons/react'
import { Block, Button, Link, List, ListItem, NavRight, Navbar, Page, Segmented, Subnavbar, f7 } from 'framework7-react'
import { useEffect, useRef, useState } from 'react'
import { useAsyncEffect } from '@reactuses/core'
import {
	FaceSmiling,
	PlusCircle,
	EllipsesBubbleFill,
	ArrowRightCircleFill,
	MicCircleFill,
	Xmark,
	XmarkCircle
} from 'framework7-icons/react'
import { Keyboard } from '@capacitor/keyboard'
import { useClipboard } from '@reactuses/core'

import './message.scss'
import { useMessageStore } from '@/stores/message'
import { $t, PLATFORM, TOOLTIP_TYPE, MESSAGE_TYPE, moveCursorToEnd, isMe } from '@/shared'
import Chat from '@/components/Message/Chat'
import ToolEditor, { ToolEditorMethods } from '@/components/Editor/ToolEditor'
import { platform } from '@/utils'
import clsx from 'clsx'
import { useToast } from '@/hooks/useToast'
import Contact from '@/components/Contact/Contact'

/**
 * 滚动元素到底部
 *
 * @param el			滚动元素
 * @param isSmooth		是否平滑滚动
 */
const scroll = (el: HTMLElement, isSmooth: boolean = false) => {
	el.scrollTo({ top: el.scrollHeight, behavior: isSmooth ? 'smooth' : 'instant' })
}

type MoreType = 'emojis' | 'more' | ''

const Message: React.FC<RouterProps> = ({ f7route }) => {
	const pageRef = useRef<{ el: HTMLElement | null }>({ el: null })
	const contentRef = useRef<HTMLElement | null>(null)
	const editorRef = useRef<ToolEditorMethods>(null)

	// 主要用于计算内容区域高度
	const navbarRef = useRef<{ el: HTMLDivElement | null }>({ el: null })
	const subnavbarRef = useRef<{ el: HTMLDivElement | null }>({ el: null })
	const BlockRef = useRef<{ el: HTMLDivElement | null }>({ el: null })
	const toolbarRef = useRef<HTMLDivElement | null>(null)

	// 是否是群聊
	const is_group = f7route.query.is_group === 'true'
	const receiver_id = f7route.params.id as string
	const dialog_id = Number(f7route.params.dialog_id as string)

	const { messages, ...msgStore } = useMessageStore()

	// 在进入页面前设置内容高度
	const onPageInit = async () => {
		const navbarHeight = navbarRef.current.el!.offsetHeight || 56
		const subnavbarHeight = subnavbarRef.current.el!.offsetHeight || 45
		const toolbarHeight = toolbarRef.current!.offsetHeight || 56

		const totalHeight = navbarHeight + subnavbarHeight + toolbarHeight
		BlockRef.current!.el!.style.minHeight = `calc(100vh - ${totalHeight}px)`

		// const data = await MsgService.getUserMessageListApi({ user_id: receiver_id, page_num: 1, page_size: 10 })
		// console.log('data', data)
	}

	// 当前提示选择的消息类型
	const [selectType, setSelectType] = useState<TOOLTIP_TYPE>(TOOLTIP_TYPE.NONE)
	const onSelect = async (type: TOOLTIP_TYPE, msg_id: number) => {
		const msg = messages.find((v) => v.msg_id === msg_id)
		type !== TOOLTIP_TYPE.SELECT && setSelectMsgs([msg])
		setSelectType(type)

		switch (type) {
			case TOOLTIP_TYPE.COPY:
				await selectEvent.copy(msg?.content || '')
				break
			case TOOLTIP_TYPE.FORWARD:
				setShowSelect(true)
				break
			case TOOLTIP_TYPE.EDIT:
				editorRef.current?.engine.setValue(msg?.content || '')
				editorRef.current?.focus()
				moveCursorToEnd(editorRef.current!.el)
				break
			case TOOLTIP_TYPE.DELETE:
				f7.dialog.confirm($t('确认删除消息？'), () => {
					msgStore.deleteMessage(msg_id)
				})
				break
			case TOOLTIP_TYPE.MARK:
				selectEvent.mark()
				break
		}
	}

	// 吐司
	const { toast } = useToast()
	// 复制
	const [, copy] = useClipboard()
	// 是否是多选
	const [showSelect, setShowSelect] = useState<boolean>(false)
	// 多选的选择列表
	const [select, setSelect] = useState<any[]>([])
	// 选中的消息列表
	const [selectMsgs, setSelectMsgs] = useState<any[]>([])

	// 集中处理提示选择事件
	const selectEvent = {
		copy: async (text: string) => {
			try {
				await copy(text)
				toast($t('复制成功'))
			} catch (error) {
				toast($t('复制失败'))
			}
		},
		forward: async (list: any[], msgs: any[]) => {
			try {
				list.forEach((v) => {
					const is_group = v?.group_id ? true : false
					msgs.forEach((item) => {
						msgStore.sendMessage(msgType, item?.content, {
							is_group,
							receiver_id: v?.user_id,
							dialog_id: v?.dialog_id,
							is_forward: v?.dialog_id !== dialog_id
						})
					})
				})
				toast('转发成功')
			} catch {
				toast('转发失败')
			}
		},
		delete: async () => {
			try {
				f7.dialog.confirm($t('确认删除消息？'), () => {
					selectMsgs.forEach(async (v) => await msgStore.deleteMessage(v?.msg_id))
					toast('删除成功')
					selectEvent.clear()
				})
			} catch {
				toast('删除失败')
			}
		},
		// select: async () => {},
		// reply: async () => {},
		mark: async () => {
			const isMark = await msgStore.markMessage(selectMsgs[0])
			if (isMark) {
				toast(selectMsgs[0]?.is_mark ? $t('取消标记成功') : $t('标记成功'))
			} else {
				toast(selectMsgs[0]?.is_mark ? $t('取消标记失败') : $t('标记失败'))
			}
		},
		clear: () => {
			setSelectType(TOOLTIP_TYPE.NONE)
			setSelect([])
			setSelectMsgs([])
		}
	}

	const onSelectChange = (e: any, msg: any) => {
		const checked = e.target.checked || false
		checked
			? setSelectMsgs([...selectMsgs, msg])
			: setSelectMsgs(selectMsgs.filter((v) => v?.msg_id !== msg?.msg_id))
	}

	// 转发逻辑
	useAsyncEffect(
		async () => {
			if (!select.length) return
			selectEvent.forward(select, selectMsgs)
			selectEvent.clear()
		},
		() => {},
		[select]
	)

	// 表情/更多切换
	const [moreType, setMoreType] = useState<MoreType>('')
	const showMore = (type: MoreType) => {
		if (type === moreType) return setMoreType('')
		setMoreType(type)
	}

	// 键盘和元素滚动
	const [showBtn, setShowBtn] = useState<boolean>(false)
	const [msgType, setMsgType] = useState<number>(MESSAGE_TYPE.TEXT)
	useAsyncEffect(
		async () => {
			if (!pageRef.current.el) return
			const el = pageRef.current.el.querySelector('.page-content') as HTMLElement
			contentRef.current = el

			await msgStore.initMessage(is_group, dialog_id, receiver_id)

			// 滚动到最底部
			setTimeout(() => {
				scroll(el!)
			}, 0)

			// 手机端监听键盘
			const platformName = await platform()
			if (platformName !== PLATFORM.WEB) {
				Keyboard.addListener('keyboardWillShow', (info) => {
					console.log('keyboard will show with height:', info.keyboardHeight)
					// alert('keyboard will show with height:' + info.keyboardHeight)
				})

				Keyboard.addListener('keyboardDidShow', (info) => {
					console.log('keyboard did show with height:', info.keyboardHeight)
					// alert('keyboard did show with height:' + info.keyboardHeight)
				})

				Keyboard.addListener('keyboardWillHide', () => {
					console.log('keyboard will hide')
					// alert('keyboard will hide')
				})

				Keyboard.addListener('keyboardDidHide', () => {
					console.log('keyboard did hide')
					// alert('keyboard did hide')
				})
			}

			const engine = editorRef.current!.engine
			engine.on('change', () => setShowBtn(!engine.isEmpty()))
		},
		() => {},
		[]
	)

	const sendMessage = async () => {
		const isEnd = isScrollEnd()
		const engine = editorRef.current!.engine
		const content = engine.model.toValue()
		engine.setValue('')
		selectType === TOOLTIP_TYPE.EDIT
			? msgStore.editMessage(selectMsgs[0], content)
			: msgStore.sendMessage(msgType, content, { replay_id: isReply() ? selectMsgs[0]?.msg_id : 0 })
		editorRef.current!.focus()
		setSelectType(TOOLTIP_TYPE.NONE)
		setTimeout(() => scroll(contentRef.current!, isEnd ? true : false), 100)
	}

	// 滚动情况
	useEffect(() => {
		if (!messages.length) return
		if (isScrollEnd() && !isMe(messages.at(-1)?.sender_id || '')) scroll(contentRef.current!)
	}, [messages])

	// 辅助函数
	const isSelect = () => selectType === TOOLTIP_TYPE.SELECT
	const isReply = () => selectType === TOOLTIP_TYPE.REPLY
	const isEdit = () => selectType === TOOLTIP_TYPE.EDIT
	const replyMessage = (msg_id: number) => msgStore.all_meesages.find((v) => v?.msg_id === msg_id)

	// 判断是否滚动到底部
	const isScrollEnd = () =>
		contentRef.current!.scrollTop + contentRef.current!.offsetHeight >= contentRef.current!.scrollHeight - 100

	// const [activeStrongButton, setActiveStrongButton] = useState<number>(0)
	return (
		<Page noToolbar className="coss_message" onPageInit={onPageInit} ref={pageRef}>
			<Navbar
				title="好友"
				subtitle="[在线]"
				backLink
				outline={false}
				className="coss_message_navbar"
				ref={navbarRef}
			>
				<NavRight>
					{isSelect() ? (
						<Link onClick={selectEvent.clear}>{$t('取消')}</Link>
					) : (
						<Link href={is_group ? `/group_info/${receiver_id}/` : `/profile/${receiver_id}/`}>
							<Ellipsis className="w-6 h-6 mr-2" />
						</Link>
					)}
				</NavRight>
				<Subnavbar className="coss_message_subnavbar" ref={subnavbarRef}>
					<Segmented>
						<Button active>
							<EllipsesBubbleFill slot="iconF7" className="mr-2" />
							{$t('消息')}
						</Button>
						<Button>
							<EllipsesBubbleFill slot="iconF7" className="mr-2" />
							{$t('图片')}
						</Button>
						<Button>
							<EllipsesBubbleFill slot="iconF7" className="mr-2" />
							{$t('文件')}
						</Button>
						<Button>
							<EllipsesBubbleFill slot="iconF7" className="mr-2" />
							{$t('链接')}
						</Button>
						<Button>
							<EllipsesBubbleFill slot="iconF7" className="mr-2" />
							{$t('标注')}
						</Button>
					</Segmented>
				</Subnavbar>
			</Navbar>

			<Block className="my-0 px-0 pt-5" ref={BlockRef}>
				<List noChevron mediaList className="my-0">
					{messages.map((item, index) => (
						<ListItem
							key={index}
							className="coss_list_item"
							data-index={index}
							style={{ zIndex: 1 }}
							checkbox={isSelect()}
							onChange={(e) => onSelectChange(e, item)}
						>
							<Chat
								msg={item}
								index={index}
								onSelect={onSelect}
								className={!isSelect() ? 'animate__fadeInUp' : ''}
								isSelected={isSelect()}
								reply={item.replay_id ? replyMessage(item.replay_id) : null}
							/>
						</ListItem>
					))}
				</List>
			</Block>

			<div
				className={clsx(
					'sticky bg-bgPrimary bottom-0 w-full h-auto z-[99] flex flex-col justify-center items-center overflow-hidden transition-all duration-300'
				)}
				ref={toolbarRef}
			>
				<div className="w-full rounded-2xl flex items-end relative h-full py-2 transition-all duration-300 ease-in">
					<div className={clsx('w-full', isSelect() ? 'flex' : 'hidden')}>
						<div className="w-full flex bg-bgPrimary">
							<Link
								className="flex flex-col flex-1 items-center justify-center"
								onClick={() => setShowSelect(true)}
							>
								<ArrowRightCircleFill className="text-xl mb-1" />
								<span className="text-[0.75rem]">{$t('转发')}</span>
							</Link>
							<Link
								className="flex flex-col flex-1 items-center justify-center"
								onClick={selectEvent.delete}
							>
								<ArrowRightCircleFill className="text-xl mb-1" />
								<span className="text-[0.75rem]">{$t('删除')}</span>
							</Link>
						</div>
					</div>

					<div className={clsx('w-full', !isSelect() ? 'flex' : 'hidden')}>
						<div className={clsx('flex-1 px-2 flex', msgType === MESSAGE_TYPE.AUDIO ? 'flex' : 'hidden')}>
							<Link onClick={() => setMsgType(MESSAGE_TYPE.TEXT)}>
								<Xmark className="text-3xl text-gray-500 animate__animated animate__zoomIn" />
							</Link>
							<Button fill className="w-full h-9 mx-2 animate__animated animate__zoomIn" round>
								{$t('长按说话')}
							</Button>
							<Link onClick={() => showMore('more')}>
								<PlusCircle className="text-4xl text-gray-500 mr-2" />
							</Link>
						</div>

						<div
							className={clsx(
								'w-full flex items-end',
								msgType !== MESSAGE_TYPE.AUDIO ? 'flex' : 'hidden'
							)}
						>
							<div className={clsx('flex-1 rounded pl-2 overflow-hidden')}>
								<div className="w-full py-2 bg-bgSecondary rounded">
									<ToolEditor className="px-4" ref={editorRef} />
								</div>
								{(isReply() || isEdit()) && (
									<div className="mt-1 bg-bgTertiary relative flex justify-between">
										<ToolEditor
											className="px-2 py-1 coss_message_editor"
											defaultValue={selectMsgs[0]?.content}
										/>
										<Link
											className="pr-2"
											onClick={() => {
												setSelectType(TOOLTIP_TYPE.NONE)
												editorRef.current?.engine.setValue('')
											}}
										>
											<XmarkCircle className="text-textTertiary" />
										</Link>
									</div>
								)}
							</div>
							<div className="flex items-center px-2 ">
								<Link onClick={() => showMore('emojis')}>
									<FaceSmiling className="text-4xl text-gray-500 mr-2" />
								</Link>
								<Link onClick={() => showMore('more')}>
									<PlusCircle className="text-4xl text-gray-500 mr-2" />
								</Link>

								{showBtn ? (
									<Link onClick={sendMessage}>
										<ArrowRightCircleFill className="text-4xl text-primary animate__animated animate__zoomIn" />
									</Link>
								) : (
									<Link onClick={() => setMsgType(MESSAGE_TYPE.AUDIO)}>
										<MicCircleFill className="text-4xl text-primary animate__animated animate__zoomIn" />
									</Link>
								)}
							</div>
						</div>
					</div>
				</div>
				{moreType && <div className={clsx('w-full h-[300px] animate__animated animate__fadeInUp')}></div>}
			</div>

			<Contact completed={setSelect} opened={showSelect} setOpened={setShowSelect} group />
		</Page>
	)
}

export default Message
