import { Ellipsis } from 'framework7-icons/react'
import { Block, Button, Link, List, ListItem, NavRight, Navbar, Page, Segmented, Subnavbar } from 'framework7-react'
import { useRef, useState } from 'react'
import { useAsyncEffect } from '@reactuses/core'
// import { $ } from 'dom7'
// import { createRoot } from 'react-dom/client'
import {
	FaceSmiling,
	PlusCircle,
	EllipsesBubbleFill,
	ArrowRightCircleFill,
	MicCircleFill,
	Xmark
} from 'framework7-icons/react'
import { Keyboard } from '@capacitor/keyboard'

import './message.scss'
// import MsgService from '@/api/msg'
// import UserStore from '@/db/user'
import { useMessageStore } from '@/stores/message'
import { $t, PLATFORM, TOOLTIP_TYPE, MESSAGE_TYPE } from '@/shared'
import Chat from '@/components/Message/Chat'
// import ToolTip from '@/components/Message/ToolTip'
import ToolEditor, { ToolEditorMethods } from '@/components/Editor/ToolEditor'
import { platform } from '@/utils'
import clsx from 'clsx'
// import { getCookie } from '@/utils/cookie'

// const user_id = getCookie(USER_ID) || ''

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

	const onPageAfterIn = () => {
		// const onSelect = (type: TOOLTIP_TYPE, msg_id: number) => {
		// 	console.log('type', type, msg_id)
		// }
		// console.log("$(`.taphold`)",$(`.taphold`));
		// $(`.taphold`).on('taphold', (e) => {
		// 	console.log("taphold", e);
		// 	const div = document.createElement('div')
		// 	createRoot(div).render(<ToolTip onSelect={onSelect} el={e.target as HTMLElement} />)
		// 	;(e.target as HTMLElement)!.appendChild(div)
		// })
	}

	const onSelect = (type: TOOLTIP_TYPE, msg_id: number) => {
		console.log('type', type, msg_id)
	}

	// 表情/更多切换
	const [moreType, setMoreType] = useState<MoreType>('')
	const showMore = (type: MoreType) => {
		if (type === moreType) return setMoreType('')
		setMoreType(type)
	}

	const [showBtn, setShowBtn] = useState<boolean>(false)
	const [msgType, setMsgType] = useState<number>(MESSAGE_TYPE.TEXT)
	useAsyncEffect(
		async () => {
			if (!pageRef.current.el) return
			const el = pageRef.current.el.querySelector('.page-content') as HTMLElement
			contentRef.current = el

			await msgStore.initMessage(is_group, dialog_id, receiver_id)
			// 滚动到最底部
			scroll(el!)

			// 手机端监听键盘
			const platformName = await platform()
			if (platformName !== PLATFORM.WEB) {
				Keyboard.addListener('keyboardWillShow', (info) => {
					console.log('keyboard will show with height:', info.keyboardHeight)
				})

				Keyboard.addListener('keyboardDidShow', (info) => {
					console.log('keyboard did show with height:', info.keyboardHeight)
				})

				Keyboard.addListener('keyboardWillHide', () => {
					console.log('keyboard will hide')
				})

				Keyboard.addListener('keyboardDidHide', () => {
					console.log('keyboard did hide')
				})
			}

			const engine = editorRef.current!.engine
			engine.on('change', () => setShowBtn(!engine.isEmpty()))
		},
		() => {},
		[]
	)

	const sendMessage = async () => {
		const engine = editorRef.current!.engine
		const content = engine.model.toValue()
		engine.setValue('')
		await msgStore.sendMessage(msgType, content)
	}

	// const [activeStrongButton, setActiveStrongButton] = useState<number>(0)
	return (
		<Page noToolbar className="coss_message" onPageAfterIn={onPageAfterIn} onPageInit={onPageInit} ref={pageRef}>
			<Navbar
				title="好友"
				subtitle="[在线]"
				backLink
				outline={false}
				className="coss_message_navbar"
				ref={navbarRef}
			>
				<NavRight>
					<Link>
						<Ellipsis className="w-6 h-6 mr-2" />
					</Link>
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
						<ListItem key={index} className="coss_list_item" data-index={index} style={{ zIndex: 1 }}>
							<Chat msg={item} index={index} onSelect={onSelect} />
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

					<div className={clsx('w-full flex items-end', msgType !== MESSAGE_TYPE.AUDIO ? 'flex' : 'hidden')}>
						<div className={clsx('flex-1 bg-bgSecondary py-2 rounded pl-2')}>
							<ToolEditor className="px-4" ref={editorRef} />
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
				{moreType && <div className={clsx('w-full h-[300px] animate__animated animate__fadeInUp')}></div>}
			</div>
		</Page>
	)
}

export default Message
