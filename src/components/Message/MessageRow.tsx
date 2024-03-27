import { $t, isMe, msgType, tooltipType } from '@/shared'
import clsx from 'clsx'
import { useCallback, useMemo, useRef, useState } from 'react'
import useMessageStore from '@/stores/new_message'
import { ReadEditor } from '@/Editor'
import MessageImage from './MessageRow/MessageImage'
import MessageAudio from './MessageRow/MessageAudio'
import MessageVideo from './MessageRow/MessageVideo'
import MessageFile from './MessageRow/MessageFile'
import MessageTime from './MessageRow/MessageTime'
import MessageTooltip from './MessageRow/MessageTooltip'
import Tippy from '@tippyjs/react'
// import { useClickOutside } from '@reactuses/core'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/light.css'
import 'tippy.js/animations/shift-away-subtle.css'
import MessageNotice from './MessageRow/MessageNotice'
import MessageError from './MessageRow/MessageError'
import MessageLabel from './MessageRow/MessageLabel'
import useUserStore from '@/stores/user'
import MessageRecall from './MessageRow/MessageRecall'
import { f7, ListItem } from 'framework7-react'
import { useLongPress } from '@reactuses/core'
import Avatar from '@/components/Avatar/Avatar.tsx'
import UserStore from '@/db/user.ts'
import useRouterStore from '@/stores/router.ts'

interface MessageRowProps {
	item: { [key: string]: any }
}

const className = (is_self: boolean) => {
	return clsx(
		'py-2 px-3 rounded-lg break-all overflow-hidden',
		is_self ? 'bg-primary text-white rounded-tr-none' : 'bg-bgPrimary rounded-tl-none'
	)
}

const MessageRow: React.FC<RouterProps & MessageRowProps> = ({ item }) => {
	const longPressRef = useRef<HTMLDivElement>(null)

	const {router} = useRouterStore()

	const type = useMemo(() => item?.msg_type, [item?.msg_type])
	const is_self = useMemo(
		() => isMe(item?.sender_info?.user_id ?? item?.sender_id),
		[item?.sender_info?.user_id, item?.sender_id]
	)

	const messageStore = useMessageStore()
	const userStore = useUserStore()

	const [showTippy, setShowTippy] = useState<boolean>(false)

	const longPressEvent = useLongPress(
		() => {
			// 当前状态为多选
			if (messageStore.manualTipType === tooltipType.SELECT) return

			setShowTippy(true)
			// 全选内容文字内容
			const selection = window?.getSelection()
			selection?.selectAllChildren(longPressRef.current!)
		},
		{ isPreventDefault: false, delay: 300 }
	)

	// 点击其他地方移除提示框
	// useClickOutside(longPressRef, () =>
	// 	setTimeout(() => {
	// 		setShowTippy(false)
	// 	}, 100)
	// )

	// const [isMove, setIsMove] = useState(false)

	// 选中消息时的处理
	const handlerSelectChange = (checked: boolean, item: any) => {
		const selectedMessages = checked
			? [...messageStore.selectedMessages, item]
			: messageStore.selectedMessages.filter((msg: any) => msg.msg_id !== item.msg_id)
		messageStore.update({ selectedMessages })
	}

	// 是否可以多选
	const isSelect = useMemo(
		() =>
			messageStore.manualTipType === tooltipType.SELECT &&
			![msgType.CALL, msgType.AUDIO, msgType.VOICE].includes(item.msg_type),

		[messageStore.manualTipType]
	)

	const render = useCallback(() => {
		switch (type) {
			case msgType.IMAGE:
				return <MessageImage className={clsx(className(is_self), '')} item={item} />
			case msgType.AUDIO:
				return <MessageAudio className={className(is_self)} item={item} />
			case msgType.VIDEO:
				return <MessageVideo className={clsx(className(is_self), '!px-0 py-0')} item={item} />
			case msgType.FILE:
				return <MessageFile className={clsx(className(is_self), '!px-2 py-1')} item={item} />
			default:
				return <ReadEditor className={className(is_self)} content={item?.content} />
		}
	}, [])

	const search = async (keyWord: string) => {
		try {
			f7.dialog.preloader($t('搜索中...'))

			// 先查找本地好友列表，查看是否是自己好友
			const user = await UserStore.findOneById(UserStore.tables.friends, 'user_id', keyWord)
			const userId = localStorage.getItem('__USER_ID__')

			if (userId == keyWord) {
				// 本人
				return
			}else if (user) {
				// 好友资料
				router?.navigate(`/profile/${user.user_id}/`)
			} else {
				// 加好友
				router?.navigate(`/personal_detail/${keyWord}/`)
			}
		} catch (error) {
			console.error('搜索用户失败', error)
			f7.dialog.alert($t('搜索用户失败'))
		} finally {
			f7.dialog.close()
		}
	}

	// 无内容
	if (type === msgType.NONE) return null
	// 通知
	if (type === msgType.NOTICE) return <MessageNotice item={item} />
	// 错误消息
	if (type === msgType.ERROR) return <MessageError item={item} />
	// 标注消息
	if ([msgType.LABEL, msgType.CANCEL_LABEL].includes(type)) return <MessageLabel item={item} />
	// 撤回消息
	if (type === msgType.RECALL) return <MessageRecall item={item} />

	return (
		<ListItem
			className="list-none"
			checkbox={isSelect}
			onChange={(e) => handlerSelectChange(e.target.checked, item)}
		>
			<div className={clsx('w-full flex items-start', is_self ? 'justify-end' : 'justify-start')}>
				<div className={clsx('max-w-[80%] flex-1 flex', is_self ? 'justify-end' : 'justify-start')}>
					<div className={clsx('flex items-start', is_self ? 'justify-end pr-2' : 'justify-start pl-2')}>
						<div onClick={() => search(item.sender_info.user_id)} className={clsx(
							'w-10 h-10 rounded-full object-cover',
							is_self ? 'order-last ml-2' : 'order-first mr-2'
						)}>
							<Avatar size={50} src={is_self ? userStore?.userInfo?.avatar : item?.sender_info?.avatar} />
						</div>

						<div
							className={clsx(
								'overflow-hidden relative flex flex-col',
								is_self ? 'items-end' : 'items-start'
							)}
						>
							{messageStore.isGroup && (
								<span className="mb-1 text-[0.75rem] text-gray-500">{item?.sender_info?.name}</span>
							)}
							<Tippy
								content={<MessageTooltip item={item} setShow={setShowTippy} el={longPressRef} />}
								arrow={false}
								interactive={true}
								appendTo={document.body}
								theme="light"
								animation="shift-away-subtle"
								// touch={['hold', 300]}
								// trigger="manual"
								ref={longPressRef}
								visible={showTippy}
							>
								<div
									className="relative"
									{...longPressEvent}
									onContextMenu={(e) => e.preventDefault()}
									// onTouchMove={() => setIsMove(true)}
								>
									{render()}
								</div>
							</Tippy>

							<MessageTime item={item} is_self={is_self} />
						</div>
					</div>
				</div>
			</div>
		</ListItem>
	)
}

export default MessageRow
