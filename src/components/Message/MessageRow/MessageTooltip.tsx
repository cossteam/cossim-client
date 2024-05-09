import { $t, isOverRecallTime, MESSAGE_MARK, MESSAGE_SEND, msgType, tooltipType } from '@/shared'
import clsx from 'clsx'
import {
	ArrowUpRight,
	ArrowUturnLeft,
	BubbleLeftBubbleRight,
	Flag,
	PlusCircle,
	SquareOnSquare,
	SquarePencil,
	TextAlignleft,
	Trash
} from 'framework7-icons/react'
import { Link } from 'framework7-react'
import useMessageStore from '@/stores/message'
import React, { useMemo, useRef } from 'react'
import tooltipStatMachine from '../script/tootip'
import useUserStore from '@/stores/user'
import emojiData from '@/shared/emoji_data'
import { useClickOutside } from '@reactuses/core'

interface MessageTooltipProps {
	item: any
	setShow: (show: boolean) => void
	el: React.RefObject<Element>
	toggleEmojis?: (data: { show: boolean; emoji: any }) => void
}

const MessageTooltip: React.FC<MessageTooltipProps> = ({ item, setShow, el, toggleEmojis }) => {
	const messageStore = useMessageStore()
	const userStore = useUserStore()

	const toolTipRef = useRef<HTMLDivElement | null>(null)

	// 点击其他地方移除提示框
	useClickOutside(el, async () => {
		setTimeout(() => {
			setShow(false)
		}, 100)
	})

	const tips = [
		{
			name: tooltipType.COPY,
			title: $t('复制'),
			icon: <SquareOnSquare className="text-lg" />
		},
		{
			name: tooltipType.FORWARD,
			title: $t('转发'),
			icon: <ArrowUpRight className="text-lg" />
		},
		{
			name: tooltipType.EDIT,
			title: $t('编辑'),
			icon: <SquarePencil className="text-lg" />
		},
		{
			name: tooltipType.DELETE,
			title: $t('删除'),
			icon: <Trash className="text-lg" />
		},
		{
			name: tooltipType.SELECT,
			title: $t('多选'),
			icon: <TextAlignleft className="text-lg" />
		},
		{
			name: tooltipType.REPLY,
			title: $t('回复'),
			icon: <BubbleLeftBubbleRight className="text-lg" />
		},
		{
			name: tooltipType.MARK,
			title: item?.is_label === MESSAGE_MARK.NOT_MARK ? $t('标注') : $t('取消标注'),
			icon: <Flag className="text-lg" />
		},
		{
			name: tooltipType.RECALL,
			title: $t('撤回'),
			icon: <ArrowUturnLeft className="text-lg" />
		}
	]

	const tooltips = useMemo(() => {
		// 是否错误消息
		const isError = item?.msg_send_state && item?.msg_send_state !== MESSAGE_SEND.SEND_SUCCESS
		// 是否是通话消息
		const isCall = item?.type === msgType.CALL

		// 当前消息是通话
		if (isCall || isError) {
			return tips.filter((tip) => tip.name === tooltipType.DELETE)
		}

		// 是否是自己的消息
		const isMe = (item?.sender_info?.user_id ?? item?.sender_id) === userStore.userId
		if (!isMe) {
			return tips.filter((tip) => ![tooltipType.EDIT, tooltipType.RECALL].includes(tip.name))
		}

		// 如果当前消息已经超过撤回时间
		if (isOverRecallTime(item?.created_at ?? item?.send_at ?? item?.send_time)) {
			return tips.filter((tip) => tip.name !== tooltipType.RECALL)
		}

		return tips
	}, [item])

	const handlerClick = (data: any) => {
		const ManualCloseList = [tooltipType.EDIT, tooltipType.FORWARD, tooltipType.REPLY, tooltipType.SELECT]

		if (ManualCloseList.includes(data.name)) {
			messageStore.update({ manualTipType: data.name })
		} else {
			messageStore.update({ tipType: data.name })
		}
		messageStore.update({ selectedMessage: item })
		// 处理
		tooltipStatMachine(data.name, item)
	}

	const allEmojis: any = emojiData

	/**
	 * 获取常用表情 id数组
	 */
	const getFrequent = (): [string] => {
		return allEmojis.categories.find((item: any) => item.id === 'frequent').emojis
		// return ['']
	}

	// const div = document.createElement('div')
	// document.body.appendChild(div)

	// @ts-ignore
	return (
		<div
			className="h-auto max-w-[300px] pt-2 w-auto rounded relative z-[100] flex flex-col items-center justify-center"
			ref={toolTipRef}
		>
			<div className={clsx('grid', tooltips.length >= 6 ? 'grid-cols-6' : `grid-cols-${tooltips.length}`)}>
				{tooltips.map((item) => (
					<Link
						onClick={() => handlerClick(item)}
						aria-expanded="true"
						key={item.name}
						className={clsx('flex min-w-[56px] max-w-[56px] p-3 px-4 text-[1rem]')}
					>
						<div className="flex flex-col items-center justify-center">
							<div className="mb-[6px]">{item?.icon}</div>
							<span className="text-[0.75rem] text-center whitespace-nowrap">{item?.title}</span>
						</div>
					</Link>
				))}
			</div>
			<div className="w-full flex gap-1">
				<div style={{ width: '100%', overflowX: 'scroll', display: 'flex', gap: '10px' }}>
					{getFrequent()
						.slice(0, 8)
						.map((item: string) => (
							// @ts-ignore
							<em-emoji
								key={item}
								id={item}
								size="2em"
								onClick={() => {
									toggleEmojis &&
										toggleEmojis({
											show: false,
											emoji: allEmojis?.emojis[item]?.skins[0]?.native ?? item
										})
								}}
							/>
						))}
				</div>
				<PlusCircle
					onClick={() => {
						setShow(false)
						// setShowTippy(true)
						toggleEmojis && toggleEmojis({ show: true, emoji: null })
					}}
					className="toolbar-icon"
				/>
			</div>
		</div>
	)
}

export default MessageTooltip
