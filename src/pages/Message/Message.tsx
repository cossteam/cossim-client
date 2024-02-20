import { ArrowUpRight, Ellipsis, Trash } from 'framework7-icons/react'
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
import Emojis from '@/components/Emojis/Emojis'
import GroupService from '@/api/group'



/**
 * 滚动元素到底部
 *
 * @param element		滚动元素
 * @param isSmooth		是否平滑滚动
 */
const scroll = (element: HTMLElement, isSmooth: boolean = false) => {
	element.scrollTo({ top: element.scrollHeight, behavior: isSmooth ? 'smooth' : 'instant' })
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
	const dialog_name = f7route.query.dialog_name

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
	const onSelect = (type: TOOLTIP_TYPE, msg_id: number) => {
		const msg = messages.find((v) => v.msg_id === msg_id)
		type !== TOOLTIP_TYPE.SELECT && setSelectMsgs([msg])
		setSelectType(type)

		console.log('msg', msg, messages, msgStore.all_meesages, msg_id)

		switch (type) {
			case TOOLTIP_TYPE.COPY:
				selectEvent.copy(msg?.content || '')
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
	const [moreType, setMoreType] = useState<MoreType>('')
	const showMore = (type: MoreType) => {
		if (type === moreType) return setMoreType('')
		setMoreType(type)
		// 滚动到最底部
		setTimeout(() => scroll(contentRef.current!, true), 0)
	}

	// 键盘和元素滚动
	const [showBtn, setShowBtn] = useState<boolean>(false)
	const [msgType, setMsgType] = useState<number>(MESSAGE_TYPE.TEXT)
	// 键盘弹起
	const [keyboardHeight, setKeyboardHeight] = useState<number>(300)
	useAsyncEffect(
		async () => {
			if (!pageRef.current.el) return
			const el = pageRef.current.el.querySelector('.page-content') as HTMLElement
			contentRef.current = el

			await msgStore.initMessage(is_group, dialog_id, receiver_id)

			// 滚动到最底部
			setTimeout(() => scroll(el!), 50)

			// 手机端监听键盘
			const platformName = await platform()
			if (platformName !== PLATFORM.WEB) {
				Keyboard.addListener('keyboardWillShow', (info) => {

					console.log('keyboard did show with keyboardWillShow:', info.keyboardHeight)
					// setMoreType('')
					// isScrollEnd(info.keyboardHeight) &&  setTimeout(()=>scroll(contentRef.current!, true),100)
					// setKeyboardHeight(info.keyboardHeight)

					// // 添加输入框
					// toolbarRef.current?.classList.add('keyboard-show')
					// toolbarRef.current!.dataset.height = info.keyboardHeight + 'px'
					// 设置页面高度
					// document.body.style.height = `calc(100vh - ${info.keyboardHeight}px)`
				})

				Keyboard.addListener('keyboardDidShow', (info) => {
					console.log('keyboard did show with height:', info.keyboardHeight)
					setMoreType('')
					isScrollEnd(info.keyboardHeight) &&  setTimeout(()=>scroll(contentRef.current!, true),100)
					setKeyboardHeight(info.keyboardHeight)

					// 添加输入框
					// toolbarRef.current?.classList.add('keyboard-show')
					// toolbarRef.current!.dataset.height = info.keyboardHeight + 'px'
					// toolbarRef.current!.style.transform = `translateY(${info.keyboardHeight}px)`
					// document.body.style.height = `calc(100vh - ${info.keyboardHeight}px)`
					toolbarRef.current!.style.transform = `translateY(${info.keyboardHeight}px)`
					// pageRef.current!.el!.style.height = document.body.style.height
				})

				Keyboard.addListener('keyboardWillHide', () => {
					console.log('keyboard will hide')
					// toolbarRef.current?.classList.remove('keyboard-show')
					// 设置页面高度
					// document.body.style.height = `100vh`
				})

				Keyboard.addListener('keyboardDidHide', () => {
					console.log('keyboard did hide')
					// toolbarRef.current?.classList.remove('keyboard-show')
					// document.body.style.height = `100vh`
					toolbarRef.current!.style.transform = `translateY(0px)`
					// document.body.style.height = `100vh`
					// toolbarRef.current!.style.transform = `translateY(0px)`
					// pageRef.current!.el!.style.height = document.body.style.height
				})
			}

			let members: any = []
			try {
				const { data } = await GroupService.groupMemberApi({ group_id: Number(receiver_id) })
				members = data
			} catch (error) {
				members = []
			}

			const engine = editorRef.current!.engine

			engine.on('change', () => setShowBtn(!engine.isEmpty()))
			// @ 功能
			engine.on('mention:default', () => {
				const newMembers = members.map((v: any) => {
					return {
						key: v.user_id,
						name: v.nickname
					}
				})

				console.log('newMembers', newMembers)

				const arr = [{ key: 'all', name: '全体成员' }, ...newMembers]

				return arr
			})
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
		if (isScrollEnd() && !isMe(messages.at(-1)?.sender_id || '')) {
			setTimeout(() => scroll(contentRef.current!, true), 100)
		}
	}, [messages])

	// 辅助函数
	const isSelect = () => selectType === TOOLTIP_TYPE.SELECT
	const isReply = () => selectType === TOOLTIP_TYPE.REPLY
	const isEdit = () => selectType === TOOLTIP_TYPE.EDIT
	const replyMessage = (msg_id: number) => msgStore.all_meesages.find((v) => v?.msg_id === msg_id)

	// 判断是否滚动到底部
	const isScrollEnd = (setp:number = 100) =>
		contentRef.current!.scrollTop + contentRef.current!.offsetHeight >= contentRef.current!.scrollHeight - setp

	// const [activeStrongButton, setActiveStrongButton] = useState<number>(0)
	return (
		<Page noToolbar className="coss_message transition-all" onPageInit={onPageInit} ref={pageRef}>
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
						<Link href={is_group ? `/group_info/${receiver_id}/` : `/profile/${receiver_id}/`}>
							<Ellipsis className="w-6 h-6 mr-2" />
						</Link>
					)}
				</NavRight>
				<Subnavbar className="coss_message_subnavbar animate__animated  animate__faster" ref={subnavbarRef}>
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
							className="coss_list_item animate__animated  animate__fadeInUp"
							data-index={index}
							style={{ zIndex: 1 }}
							checkbox={isSelect() && !item?.tips_msg_id}
							onChange={(e) => onSelectChange(e, item)}
						>
							<Chat
								msg={item}
								index={index}
								onSelect={onSelect}
								// className={!isSelect() ? 'animate__fadeInUp' : ''}
								isSelected={isSelect()}
								reply={item?.reply_id !== 0 ? replyMessage(item.reply_id) : null}
							/>
						</ListItem>
					))}
				</List>
			</Block>

			<div
				className={clsx(
					'sticky bg-bgPrimary bottom-0 w-full h-auto z-[99] flex flex-col justify-center items-center transition-all duration-300'
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
							<div className={clsx('flex-1 rounded pl-2 max-w-[calc(100%-150px)]')}>
								<div className="py-2 bg-bgSecondary rounded w-full">
									<ToolEditor className="px-4" ref={editorRef} is_group={is_group} />
								</div>
								{(isReply() || isEdit()) && (
									<div className="mt-1 bg-bgTertiary relative flex justify-between">
										<ToolEditor
											className="px-2 py-1 coss_message_editor"
											defaultValue={selectMsgs[0]?.content}
											is_group={is_group}
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
							<div className="flex items-center px-2 w-[150px]">
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
				{moreType && (
					<div
						className={clsx('w-full animate__animated overflow-y-auto')}
						style={{ height: keyboardHeight + 'px' }}
					>
						{moreType === 'emojis' ? <Emojis /> : <div></div>}
					</div>
				)}
			</div>

			<Contact completed={setSelect} opened={showSelect} setOpened={setShowSelect} group />
		</Page>
	)
}

export default Message
