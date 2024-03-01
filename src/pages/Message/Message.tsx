import { ArrowUpRight, BellFill, ChevronRight, Ellipsis, Trash } from 'framework7-icons/react'
import { Block, Button, Link, List, ListItem, NavRight, Navbar, Page, Subnavbar, f7 } from 'framework7-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useAsyncEffect, useClickOutside } from '@reactuses/core'
import {
	FaceSmiling,
	PlusCircle,
	ArrowRightCircleFill,
	MicCircleFill,
	Xmark,
	XmarkCircle
} from 'framework7-icons/react'
import { Keyboard } from '@capacitor/keyboard'
import { useClipboard } from '@reactuses/core'

import './message.scss'
import { useMessageStore } from '@/stores/message'
import {
	$t,
	TOOLTIP_TYPE,
	MESSAGE_TYPE,
	isMe,
	hasImageHtml,
	scroll,
	MessageMore,
	getLatestGroupAnnouncement,
	USER_ID
} from '@/shared'
import Chat from '@/components/Message/Chat'
import { isWebDevice } from '@/utils'
import clsx from 'clsx'
import { useToast } from '@/hooks/useToast'
import Contact from '@/components/Contact/Contact'
import Emojis from '@/components/Emojis/Emojis'
import GroupService from '@/api/group'

import ToolEditor, { ToolEditorMethods, ReadEditor } from '@/Editor'
import { useStateStore } from '@/stores/state'
import Quill from 'quill'
import ToolBarMore from '@/components/Message/ToolBarMore'
import { KeyboardIcon } from '@/components/Icon/Icon'
import { Delta } from 'quill/core'
import { EmitterSource } from 'quill/core/emitter'
import { getCookie } from '@/utils/cookie'
// import MsgService from '@/api/msg'
// import RelationService from '@/api/relation'

const user_id = getCookie(USER_ID) ?? ''

const Message: React.FC<RouterProps> = ({ f7route, f7router }) => {
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
	const dialog_name = f7route.query.dialog_name

	// 是否是系统通知
	const is_system = useMemo(() => {
		return receiver_id === '10001'
	}, [receiver_id])

	const { updateChat } = useStateStore()
	const { messages, ...msgStore } = useMessageStore()

	// 在进入页面前设置内容高度
	const [totalHeight, setTotalHeight] = useState<number>(0)
	const onPageInit = async () => {
		const navbarHeight = navbarRef.current.el!.offsetHeight || 56
		const subnavbarHeight = subnavbarRef.current.el?.offsetHeight || 45
		const toolbarHeight = toolbarRef.current!.offsetHeight || 56
		const totalHeight = navbarHeight + subnavbarHeight + toolbarHeight
		setTotalHeight(totalHeight)
		setContentHeight(totalHeight)
	}

	// 当前提示选择的消息类型
	const [selectType, setSelectType] = useState<TOOLTIP_TYPE>(TOOLTIP_TYPE.NONE)
	const onSelect = (type: TOOLTIP_TYPE, msg_id: number) => {
		const msg = messages.find((v) => v.msg_id === msg_id)
		type !== TOOLTIP_TYPE.SELECT && setSelectMsgs([msg])
		setSelectType(type)

		switch (type) {
			case TOOLTIP_TYPE.COPY:
				selectEvent.copy(msg?.content || '')
				break
			case TOOLTIP_TYPE.FORWARD:
				setShowSelect(true)
				break
			case TOOLTIP_TYPE.EDIT:
				editorRef.current!.quill.root.innerHTML = msg?.content || ''
				break
			case TOOLTIP_TYPE.DELETE:
				f7.dialog.confirm($t('确认删除消息？'), () => {
					msgStore.deleteMessage(msg_id)
				})
				break
			case TOOLTIP_TYPE.MARK:
				msg && selectEvent.mark(msg)
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
				const doc = new DOMParser().parseFromString(text, 'text/html')
				const txt = doc.body.textContent
				await copy(txt ?? '')
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
		mark: async (msg: any) => {
			await msgStore.markMessage(msg)
			selectEvent.clear()
			if (isScrollEnd()) {
				setTimeout(() => scroll(contentRef.current!, true), 100)
			}
		},
		clear: () => {
			setSelectType(TOOLTIP_TYPE.NONE)
			setSelect([])
			setSelectMsgs([])
		}
	}
	// 多选时选择的消息
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
	const [moreType, setMoreType] = useState<MessageMore>(MessageMore.TEXT)
	const moreRef = useRef<HTMLDivElement | null>(null)
	const showMore = (type: MessageMore) => {
		const isEnd = isScrollEnd()

		// if (type === moreType) {
		// 	closeToolBar()
		// 	BlockRef.current.el!.style.transitionDuration = '0.3s'
		// 	BlockRef.current.el!.style.paddingBottom = 56 + 'px'
		// 	return
		// }

		if (type === MessageMore.TEXT) {
			closeToolBar()
			BlockRef.current.el!.style.transitionDuration = '0.3s'
			BlockRef.current.el!.style.paddingBottom = 56 + 'px'
			setTimeout(() => {
				editorRef.current!.quill.focus()
			}, 300)
			return
		} else {
			setMoreType(type)
			setToolbarBottom(0)
		}

		BlockRef.current.el!.style.transitionDuration = '0s'
		BlockRef.current.el!.style.paddingBottom = keyboardHeight + 56 + 'px'
		requestAnimationFrame(() => {
			isEnd && scroll(contentRef.current!, true)
		})
	}

	// 键盘和元素滚动
	const [showBtn, setShowBtn] = useState<boolean>(false)
	const [msgType, setMsgType] = useState<number>(MESSAGE_TYPE.TEXT)
	// 键盘弹起
	const [keyboardHeight, setKeyboardHeight] = useState<number>(300)
	// 控制工具栏的显示
	useClickOutside(toolbarRef, () => {
		closeToolBar()
	})
	// 设备信息
	// const [platformName, setPlatformName] = useState<string>('web')

	const [isWeb, setIsWeb] = useState<boolean>(true)

	// 群公告
	const [groupAnnouncement, setGroupAnnouncement] = useState<any>(null)
	// 群成员
	const [members, setMembers] = useState<any[]>([])

	// 获取群公告
	const getGroupAnnouncement = () => {
		const params = { group_id: Number(receiver_id) }
		GroupService.groupAnnouncementApi(params).then((res) => {
			setGroupAnnouncement(getLatestGroupAnnouncement(res.data ?? []))
		})
	}

	useAsyncEffect(
		async () => {
			if (!pageRef.current.el) return
			const el = pageRef.current.el.querySelector('.page-content') as HTMLElement
			contentRef.current = el

			// 初始化消息
			await msgStore.initMessage(is_group, dialog_id, receiver_id)

			requestAnimationFrame(() => {
				// 滚动到最底部
				setTimeout(() => scroll(el), 0)
			})

			// 如果是群聊
			if (is_group) {
				const params = { group_id: Number(receiver_id) }

				// GroupService.groupAnnouncementApi(params).then((res) => {
				// 	setGroupAnnouncement(getLatestGroupAnnouncement(res.data ?? []))
				// })
				// getGroupAnnouncement()

				GroupService.groupMemberApi(params).then((res) => {
					// console.log('群成员', res.data)
					setMembers(res.data)
				})
			}

			// 判断设备
			setIsWeb(await isWebDevice())
			// 手机端监听键盘
			// const platformName = await platform()
			// setPlatformName(platformName)
			if (!isWeb) {
				Keyboard.addListener('keyboardWillShow', (info) => {
					setKeyboardHeight(info.keyboardHeight - 15)
					// setMoreType(MessageMore.TEXT)
					// setToolbarBottom(keyboardHeight)
				})
				// Keyboard.addListener('keyboardDidShow', () => {
				// 	setToolbarBottom(keyboardHeight)
				// })
				// Keyboard.addListener('keyboardDidHide', () => {
				// if (!moreType) {
				// 	requestAnimationFrame(() => {
				// 		setTimeout(() => {
				// 			setToolbarBottom(0)
				// 		}, 0)
				// 	})
				// } else {
				// 	setToolbarBottom(0)
				// }
				// BlockRef.current.el!.style.paddingBottom = 56 + 'px'
				// })
			}

			const quill = editorRef.current!.quill

			let eventSources: EmitterSource = Quill.sources.API

			/**
			 * @description 编辑器变化
			 */
			quill.on(
				Quill.events.EDITOR_CHANGE,
				(type: string, _delta: Delta, _oldDelta: Delta, source: EmitterSource) => {
					if (type !== Quill.events.SELECTION_CHANGE) {
						setShowBtn(quill.getLength() > 1)
					}
					eventSources = source
				}
			)

			/**
			 * @description 聚焦时需要延时，并把底部内容收起
			 */
			quill.root.addEventListener('focus', () => {
				// if (timer) clearTimeout(timer)
				// timer = setTimeout(() => {
				// 	BlockRef.current.el!.style.transitionDuration = '0.3s'
				// 	BlockRef.current.el!.style.paddingBottom = keyboardHeight +  56 + 'px'
				// 	scroll(contentRef.current!, true)
				// }, 0)
				// console.log("键盘弹起");
				setContentHeight(keyboardHeight)

				setTimeout(() => {
					if (eventSources === Quill.sources.API) return

					BlockRef.current.el!.style.transitionDuration = '0.3s'
					BlockRef.current.el!.style.paddingBottom = 56 + 'px'
					closeToolBar()
				}, 0)
			})

			window.addEventListener('resize', hanlderPageSize)
		},
		() => {
			window.removeEventListener('resize', hanlderPageSize)
		},
		[]
	)

	const hanlderPageSize = () => {
		if (!contentRef.current) return
		scroll(contentRef.current!, false)
	}

	const sendMessage = async () => {
		const quill = editorRef.current!.quill
		let type = msgType

		const content = quill.getSemanticHTML()
		if (hasImageHtml(content)) type = MESSAGE_TYPE.IMAGE

		// 发送或编辑消息
		selectType === TOOLTIP_TYPE.EDIT
			? msgStore.editMessage(selectMsgs[0], content)
			: msgStore.sendMessage(type, content, { replay_id: isReply() ? selectMsgs[0]?.msg_id : 0 })

		setSelectType(TOOLTIP_TYPE.NONE)

		// 发送成功的操作
		quill.deleteText(0, quill.getLength() - 1)
		if (!moreType) quill.focus()
	}

	// const dialog = useLiveQuery(() => UserStore.findOneById(UserStore.tables.dialogs, 'dialog_id', dialog_id))
	// 未读消息数
	// const [unReadCount, setUnReadCount] = useState<number>(0)

	// 滚动情况
	useEffect(() => {
		if (!messages.length) return

		// 滚动到底部
		setTimeout(() => scroll(contentRef.current!, isScrollEnd(200) ? true : false), 100)

		// 如果不是自己的消息，就设置已读
		if (!isMe(messages.at(-1)?.sender_id || '')) {
			msgStore.readMessage(messages)
		}
	}, [messages])

	// 选择表情
	const onSelectEmojis = (emojis: any) => {
		// 先确保编辑器已经聚焦
		editorRef.current!.quill.focus()
		editorRef.current!.quill.insertText(
			editorRef.current!.quill.getSelection()?.index || 0,
			emojis.native,
			Quill.sources.API
		)
		editorRef.current!.quill.blur()
	}

	// const focusInput = () => {
	// 	console.log('键盘显示')
	// 	if (moreType !== MessageMore.TEXT) return
	// 	editorRef.current?.quill.enable(true)
	// 	editorRef.current?.quill.focus()
	// }

	// const blurInput = () => {
	// 	console.log('键盘隐藏')
	// 	editorRef.current?.quill.enable(false)
	// 	editorRef.current?.quill.blur()
	// }

	// 阅读所有
	// const readAll = () => {
	// 	scroll(contentRef.current!, true)
	// }

	// 辅助函数
	const isSelect = () => selectType === TOOLTIP_TYPE.SELECT
	const isReply = () => selectType === TOOLTIP_TYPE.REPLY
	const isEdit = () => selectType === TOOLTIP_TYPE.EDIT
	const replyMessage = (msg_id: number) => msgStore.all_meesages.find((v) => v?.msg_id === msg_id)
	const setToolbarBottom = (bottom: number) => (toolbarRef.current!.style.transform = `translateY(${bottom}px)`)
	const setContentHeight = (height: number = 0) =>
		(BlockRef.current!.el!.style.minHeight = `calc(100vh - ${height + totalHeight}px)`)
	const isReadGroupAnnouncement = (users: any[]) => users?.some((v) => v?.user_id === user_id)

	// 关闭更多功能
	const closeToolBar = () => {
		setMoreType(MessageMore.TEXT)
		setToolbarBottom(keyboardHeight)
	}

	// 判断是否滚动到底部
	const isScrollEnd = (setp: number = 100) => {
		if (!contentRef.current) return false
		return (
			contentRef.current!.scrollTop + contentRef.current!.offsetHeight >= contentRef.current!.scrollHeight - setp
		)
	}

	return (
		<Page
			noToolbar
			className="coss_message transition-all"
			onPageInit={onPageInit}
			ref={pageRef}
			onPageBeforeOut={() => {
				// msgStore.clearMessages()
				updateChat(true)
			}}
			onPageBeforeIn={async () => is_group && getGroupAnnouncement()}
		>
			<Navbar
				title={dialog_name}
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
						!is_system && (
							<Link
								href={
									is_group
										? `/group_info/${receiver_id}/`
										: `/profile/${receiver_id}/?from_page=message`
								}
							>
								<Ellipsis className="w-6 h-6 mr-2" />
							</Link>
						)
					)}
				</NavRight>
				{is_group && groupAnnouncement && !isReadGroupAnnouncement(groupAnnouncement?.read_user_list) && (
					<Subnavbar className="coss_message_subnavbar animate__animated  animate__faster" ref={subnavbarRef}>
						<Link
							className="w-full h-full flex justify-center items-center rounded bg-bgPrimary"
							href={`/create_group_notice/${receiver_id}/?id=${groupAnnouncement.id}&admin=${members.find((v) => v?.identity === user_id)?.identity === 2}}`}
						>
							<div className="w-full py-3 px-4 relative flex items-center">
								<BellFill className="mr-3 text-orange-400 text-sm" />
								<p className="text-ellipsis overflow-hidden whitespace-nowrap max-w-[86%] text-textSecondary">
									<span className="font-bold">{groupAnnouncement.title}：</span>
									{groupAnnouncement.content}
								</p>
								<div className="absolute right-3">
									<ChevronRight className="text-textTertiary text-sm" />
								</div>
							</div>
						</Link>
					</Subnavbar>
				)}
			</Navbar>

			{/* pt-5 pb-16 */}
			<Block
				className={clsx(
					'my-0 px-0 pb-16 transition-all duration-300 ease-linear'
					// is_group && groupAnnouncement && '110px'
				)}
				ref={BlockRef}
				style={{
					paddingTop:
						is_group && groupAnnouncement && !isReadGroupAnnouncement(groupAnnouncement?.read_user_list)
							? '110px'
							: '64px'
				}}
			>
				<List noChevron mediaList className="my-0">
					{messages.map((item, index) => (
						<ListItem
							key={index}
							className="coss_list_item animate__animated"
							data-index={index}
							style={{ zIndex: 1 }}
							checkbox={isSelect() && !item?.tips_msg_id}
							onChange={(e) => onSelectChange(e, item)}
						>
							<Chat
								msg={item}
								index={index}
								onSelect={onSelect}
								isSelected={isSelect()}
								reply={item?.reply_id !== 0 ? replyMessage(item.reply_id) : null}
							/>
						</ListItem>
					))}
				</List>
			</Block>

			<div
				className={clsx(
					'message-toolbar fixed bg-bgPrimary bottom-0 w-full h-auto z-[99]  transition-all duration-300 ease-in'
				)}
				ref={toolbarRef}
				style={{ transform: `translateY(${keyboardHeight}px)` }}
			>
				<div className="flex flex-col justify-center items-center">
					<div className="w-full rounded-2xl flex items-end relative h-full py-2 transition-all duration-300 ease-in">
						<div className={clsx('w-full', isSelect() ? 'flex' : 'hidden')}>
							<div className="w-full flex bg-bgPrimary">
								<Link
									className="flex flex-col flex-1 items-center justify-center"
									onClick={() => setShowSelect(true)}
								>
									<ArrowUpRight className="text-xl mb-1" />
									<span className="text-[0.75rem]">{$t('转发')}</span>
								</Link>
								<Link
									className="flex flex-col flex-1 items-center justify-center"
									onClick={selectEvent.delete}
								>
									<Trash className="text-xl mb-1" />
									<span className="text-[0.75rem]">{$t('删除')}</span>
								</Link>
							</div>
						</div>

						<div className={clsx('w-full', !isSelect() ? 'flex' : 'hidden')}>
							<div
								className={clsx('flex-1 px-2 flex', msgType === MESSAGE_TYPE.AUDIO ? 'flex' : 'hidden')}
							>
								<Link onClick={() => setMsgType(MESSAGE_TYPE.TEXT)}>
									<Xmark className="text-3xl text-gray-500 animate__animated animate__zoomIn" />
								</Link>
								<Button fill className="w-full h-9 mx-2 animate__animated animate__zoomIn" round>
									{$t('长按说话')}
								</Button>
								<Link onClick={() => showMore(MessageMore.TEXT)}>
									<PlusCircle className="text-4xl text-gray-500 mr-2" />
								</Link>
							</div>

							<div
								className={clsx(
									'w-full flex items-end',
									msgType !== MESSAGE_TYPE.AUDIO ? 'flex' : 'hidden'
								)}
							>
								<div className={clsx('flex-1 rounded pl-2 max-w-[calc(100%-150px)]')}>
									<div className="py-2 bg-bgSecondary rounded w-full flex items-center">
										<ToolEditor
											ref={editorRef}
											readonly={false}
											placeholder={$t('请输入内容')}
											id={receiver_id}
											is_group={is_group}
										/>
									</div>
									{(isReply() || isEdit()) && (
										<div className="mt-1 bg-bgTertiary relative flex justify-between">
											<ReadEditor
												content={selectMsgs[0]?.content}
												className="reply-read-editor"
											/>
											<Link
												className="pr-2"
												onClick={() => {
													setSelectType(TOOLTIP_TYPE.NONE)
													editorRef.current?.quill.deleteText(
														0,
														editorRef.current?.quill.getLength()
													)
												}}
											>
												<XmarkCircle className="text-textTertiary" />
											</Link>
										</div>
									)}
								</div>
								<div className="flex items-center px-2 w-[150px]">
									{moreType === MessageMore.EMOJI ? (
										<Link onClick={() => showMore(MessageMore.TEXT)}>
											<KeyboardIcon className="text-4xl text-gray-500 mr-2" />
										</Link>
									) : (
										<Link onClick={() => showMore(MessageMore.EMOJI)}>
											<FaceSmiling className="text-4xl text-gray-500 mr-2" />
										</Link>
									)}

									{moreType === MessageMore.OTHER ? (
										<Link onClick={() => showMore(MessageMore.TEXT)}>
											<KeyboardIcon className="text-4xl text-gray-500 mr-2" />
										</Link>
									) : (
										<Link onClick={() => showMore(MessageMore.OTHER)}>
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
												closeToolBar()
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
						className={clsx('w-full overflow-hidden transition-all duration-200 ease-linear')}
						style={{ height: keyboardHeight + 'px' }}
						ref={moreRef}
					>
						<Emojis
							onSelectEmojis={onSelectEmojis}
							className={moreType === MessageMore.EMOJI ? '' : 'hidden'}
						/>
						<div className={clsx('w-full', moreType === MessageMore.OTHER ? '' : 'hidden')}>
							{receiver_id}
							{!is_system && <ToolBarMore is_group={is_group} id={receiver_id} f7router={f7router} />}
						</div>
					</div>
				</div>

				{/* {!!dialog?.dialog_unread_count && dialog?.dialog_unread_count > 0 && (
					<Badge className="w-6 h-6 absolute bottom-[calc(100%+10px)] right-5 overflow-hidden">
						<Button fill round onClick={readAll}>
							{dialog?.dialog_unread_count}
						</Button>
					</Badge>
				)} */}
			</div>

			<Contact completed={setSelect} opened={showSelect} setOpened={setShowSelect} group />
		</Page>
	)
}

export default Message
