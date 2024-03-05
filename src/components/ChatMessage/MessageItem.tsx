import { $t, TOOLTIP_TYPE } from '@/shared'
import { useMessageStore } from '@/stores/message'
import { List, ListItem, f7 } from 'framework7-react'
import React, { RefObject, useCallback, useEffect, useRef, useState } from 'react'
import { useTooltipsStore } from '@/stores/tooltips'
import { useAsyncEffect, useClipboard } from '@reactuses/core'
import { useToast } from '@/hooks/useToast'
import MessageBox from './MessageBox'
import MessageVariableSizeList, { RowProps } from './MessageVariableSizeList'

interface MessageItemProps {
	dialog_id: number
	el: RefObject<HTMLDivElement | null>
}

const Row = ({
	index,
	setItemSize,
	selectChange,
	onSelect
}: RowProps & { selectChange: (...args: any[]) => void; onSelect: (...args: any[]) => void }) => {
	const msgStore = useMessageStore()
	const tooltipStore = useTooltipsStore()
	const msg = msgStore.messages[index]

	const itemRef = useRef<HTMLDivElement | null>(null)

	const replyMessage = useCallback((msg_id: number) => msgStore.messages.find((v) => v?.msg_id === msg_id), [])

	useEffect(() => {
		const doc = new DOMParser().parseFromString(msg?.content ?? '', 'text/html')
		const imgs = doc.querySelectorAll('img')
		const elementHeight = itemRef.current?.offsetHeight
		// 替换图片
		if (imgs.length) {
			const image = new Image()
			for (let i = 0; i < imgs.length; i++) {
				image.src = imgs[i].src
				image.onload = () => {
					const elementHeight = itemRef.current?.offsetHeight
					setItemSize(index, elementHeight!)
				}
			}
		} else {
			setItemSize(index, elementHeight!)
		}
	}, [])

	return (
		<div ref={itemRef} className="h-auto " style={{ zIndex: 1 }}>
			<List noChevron mediaList className="my-0">
				<ListItem
					key={index}
					className="coss_list_item "
					data-index={index}
					style={{ zIndex: 1 }}
					checkbox={tooltipStore.showSelect && !msg?.tips_msg_id}
					onChange={(e) => onSelect(e, msg)}
				>
					<MessageBox
						msg={msg}
						index={index}
						onSelect={selectChange}
						reply={msg?.reply_id !== 0 ? replyMessage(msg?.reply_id) : null}
						listItemRef={itemRef}
					/>
				</ListItem>
			</List>
		</div>
	)
}

const MessageItem: React.FC<MessageItemProps> = ({ dialog_id, el }) => {
	const { messages, ...msgStore } = useMessageStore()
	const { type, selectItem, selectMember, selectItems, ...tooltipStore } = useTooltipsStore()
	const [, copy] = useClipboard()
	const { toast } = useToast()
	const [height, setHeight] = useState<number>(700)

	const selectChange = useCallback(async (type: TOOLTIP_TYPE, msg_id: number) => {
		const msg = messages.find((item) => item?.msg_id === msg_id)
		tooltipStore.updateType(type)
		msg && tooltipStore.updateSelectItem(msg)

		switch (type) {
			case TOOLTIP_TYPE.COPY:
				selectEvent.copy(msg?.content ?? '')
				break
			case TOOLTIP_TYPE.FORWARD:
				tooltipStore.updateShowSelectMember(true)
				break
			case TOOLTIP_TYPE.SELECT:
				tooltipStore.updateShowSelect(true)
				break
			case TOOLTIP_TYPE.DELETE:
				tooltipStore.updateSelectItems([msg!])
				tooltipStore.updateSelectDelete(true)
				break
			case TOOLTIP_TYPE.MARK:
				msg && selectEvent.mark(msg)
				break
			default:
				break
		}
	}, [])

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
		forward: async (msgs: any[]) => {
			try {
				selectMember.forEach(async (v) => {
					const is_group = v?.group_id ? true : false
					msgs.forEach((item) => {
						msgStore.sendMessage(1, item?.content, {
							is_group,
							receiver_id: v?.user_id,
							dialog_id: v?.dialog_id,
							is_forward: v?.dialog_id !== dialog_id
						})
					})
				})
				selectEvent.clear()
				toast('转发成功')
			} catch {
				toast('转发失败')
			}
		},
		mark: async (msg: any) => {
			await msgStore.markMessage(msg)
			selectEvent.clear()
		},
		selectChange: (e: any, item: any) => {
			const checked = e.target.checked || false
			checked
				? tooltipStore.updateSelectItems([...selectItems, item])
				: tooltipStore.updateSelectItems(selectItems.filter((v) => v?.msg_id !== item?.msg_id))
		},
		clear: () => {
			tooltipStore.clear()
		}
	}

	// 转发
	useAsyncEffect(
		async () => {
			if (!selectMember.length) return
			await selectEvent.forward(type === TOOLTIP_TYPE.FORWARD ? [selectItem] : selectItems)
		},
		() => {},
		[selectMember]
	)

	// 删除
	useEffect(() => {
		if (!tooltipStore.selectDelete) return
		try {
			f7.dialog.confirm(
				$t('确认删除消息？'),
				() => {
					console.log('selectItems', selectItems)
					selectItems.forEach(async (v) => await msgStore.deleteMessage(v?.msg_id))
					toast('删除成功')
					selectEvent.clear()
				},
				() => {
					tooltipStore.updateSelectDelete(false)
				}
			)
		} catch {
			toast('删除失败')
		}
	}, [tooltipStore.selectDelete])

	useEffect(() => {
		if (!el.current) return
		setHeight(el.current?.clientHeight ?? 700)
	}, [el])

	return (
		<MessageVariableSizeList
			Row={({ index, style, setItemSize }) =>
				Row({ index, style, setItemSize, selectChange, onSelect: selectEvent.selectChange })
			}
			height={height}
			el={el}
		/>
	)
}

export default MessageItem
