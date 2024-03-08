import { $t, TOOLTIP_TYPE, burnAfterReading } from '@/shared'
import { useMessageStore } from '@/stores/message'
import { f7 } from 'framework7-react'
import React, { RefObject, useCallback, useEffect, useState } from 'react'
import { useTooltipsStore } from '@/stores/tooltips'
import { useAsyncEffect, useClipboard } from '@reactuses/core'
import { useToast } from '@/hooks/useToast'
import MessageVariableSizeList from './MessageVariableSizeList'
import MessageRow from './MessageRow'
import { debounce } from 'lodash-es'

interface MessageItemProps {
	dialog_id: number
	el: RefObject<HTMLDivElement | null>
	isScrollEnd: (setp?: number) => boolean
}

const MessageItem: React.FC<MessageItemProps> = ({ dialog_id, el, isScrollEnd }) => {
	const { messages, ...msgStore } = useMessageStore()
	const tooltipStore = useTooltipsStore()
	const [, copy] = useClipboard()
	const { toast } = useToast()
	const [height, setHeight] = useState<number>(700)

	useEffect(() => {
		console.log(dialog_id)
	}, [dialog_id])

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
				tooltipStore.updateSelectItems(msg!, true)
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
				tooltipStore.selectMember.forEach(async (v) => {
					const is_group = v?.group_id ? true : false
					msgs.forEach((item) => {
						msgStore.sendMessage(1, item?.content, {
							is_group,
							receiver_id: v?.user_id,
							dialog_id: v?.dialog_id,
							is_forward: v?.dialog_id !== dialog_id,
							is_burn_after_reading: v?.preferences?.open_burn_after_reading ?? 0
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
			tooltipStore.updateSelectItems(item, checked)
		},
		clear: () => {
			tooltipStore.clear()
		}
	}

	// 转发
	useAsyncEffect(
		async () => {
			if (!tooltipStore.selectMember.length) return
			await selectEvent.forward(
				tooltipStore.type === TOOLTIP_TYPE.FORWARD ? [tooltipStore.selectItem] : tooltipStore.selectItems
			)
			toast($t('转发成功'))
		},
		() => {},
		[tooltipStore.selectMember]
	)

	// 删除
	useEffect(() => {
		if (!tooltipStore.selectDelete) return
		try {
			f7.dialog.confirm(
				$t('确认删除消息？'),
				() => {
					tooltipStore.selectItems.forEach(async (v) => await msgStore.deleteMessage(v?.msg_id))
					toast($t('删除成功'))
					selectEvent.clear()
				},
				() => {
					tooltipStore.updateSelectDelete(false)
				}
			)
		} catch {
			toast($t('删除失败'))
		}
	}, [tooltipStore.selectDelete])

	useEffect(() => {
		if (!el.current) return
		setHeight(el.current?.clientHeight ?? 700)
	}, [el])

	const clearReadMessage = () => {
		msgStore.readMessage(msgStore.reads)
		burnAfterReading(msgStore)
	}

	const fn = debounce(clearReadMessage, 3000)
	useEffect(() => {
		if (!msgStore.reads) return
		// console.log('msgStore.reads', msgStore.reads)
		fn()
		return () => {
			// 在组件卸载或下一次 effect 运行之前取消 debounce 函数
			fn.cancel()
		}
	}, [msgStore.reads])

	useEffect(() => {
		burnAfterReading(msgStore)
	}, [])

	return (
		<MessageVariableSizeList
			Row={({ index, style, setItemSize }) => (
				<MessageRow
					index={index}
					style={style}
					setItemSize={setItemSize}
					selectChange={selectChange}
					onSelect={selectEvent.selectChange}
					el={el}
				/>
			)}
			height={height}
			el={el}
			isScrollEnd={isScrollEnd}
		/>
	)
}

export default MessageItem
