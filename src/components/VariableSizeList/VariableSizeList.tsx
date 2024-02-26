import React, { useEffect, useState, useCallback, useRef } from 'react'
import { VariableSizeList as VariableSList } from 'react-window'

import './VariableSizeList.scss'
import { List, ListItem } from 'framework7-react'
import Chat from '@/components/Message/Chat'

interface RowProps {
	index: number
	style: React.CSSProperties
	setItemSize: (index: number, height: number) => void
	rowIndex?: number
	isSelect: () => boolean
	onSelectChange: (e: any, msg: any) => void
	onSelect: (...args: any[]) => void
	replyMessage: (msg_id: number) => any
	item: any
}

/**
 * 项（Item）组件
 */
const Row: React.FC<RowProps> = ({ index, style, setItemSize, ...props }) => {
	const itemRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		// const elementHeight = itemRef.current?.offsetHeight
		// console.log("elementHeight",elementHeight);
		// const chatEl = itemRef.current?.querySelector('.chat') as HTMLDivElement
		// console.log("chatEl",chatEl.offsetHeight);
		// setItemSize(index, elementHeight!)
		const elementHeight = itemRef.current?.offsetHeight
		// console.log('elementHeight', elementHeight)
		// const chatEl = itemRef.current?.querySelector('.chat') as HTMLDivElement
		// console.log('chatEl', chatEl.offsetHeight)
		setItemSize(index, elementHeight!)
	}, [])

	return (
		<div ref={itemRef} className="h-auto" style={style}>
			<List noChevron mediaList className="my-0">
				<ListItem
					key={index}
					className="coss_list_item"
					data-index={index}
					style={{ zIndex: 1 }}
					checkbox={props.isSelect() && !props.item?.tips_msg_id}
					onChange={(e) => props.onSelectChange(e, props.item)}
				>
					<Chat
						msg={props.item}
						index={index}
						onSelect={props.onSelect}
						isSelected={props.isSelect()}
						reply={props.item?.reply_id !== 0 ? props.replyMessage(props.item?.reply_id) : null}
						className="chat"
					/>
				</ListItem>
			</List>
		</div>
	)
}

interface VariableSizeListProps {
	pageHeight: number
	render: (data: any) => JSX.Element
	len: number
	isSelect: () => boolean
	onSelectChange: (e: any, msg: any) => void
	onSelect: (...args: any[]) => void
	replyMessage: (msg_id: number) => any
	messages: any[]
}

const VariableSizeList: React.FC<VariableSizeListProps> = ({ pageHeight, ...props }) => {
	const [sizes, setSizes] = useState<{ [key: number]: number }>({ 1: 50 }) // 根据索引记录列表的高度
	const listRef = useRef<VariableSList | null>(null)

	useEffect(() => {
		if (!props.messages) return
		setTimeout(() => {
			listRef.current?.scrollToItem(props.messages.length * props.messages.length, 'end')
		}, 0)
	}, [props.messages])

	// 根据索引获取Item的尺寸
	const getItemSize = useCallback(
		(index: number) => {
			return sizes[index] || 50
		},
		[sizes]
	)

	// 根据索引，设置Item高度
	const setItemSize = useCallback((index = 1, size = 10) => {
		setSizes((prevSize) => {
			return {
				...prevSize,
				[index]: size
			}
		})
		// 根据索引，重置缓存位置。
		listRef.current?.resetAfterIndex(index, false)
	}, [])

	const rowRender = useCallback(({ index: rowIndex, style }: { index: number; style: React.CSSProperties }) => {
		return (
			<div data-index={rowIndex} style={style} className="variable-list">
				<Row
					style={{}}
					index={rowIndex}
					key={rowIndex}
					setItemSize={setItemSize}
					rowIndex={rowIndex}
					isSelect={props.isSelect}
					onSelect={props.onSelect}
					replyMessage={props.replyMessage}
					onSelectChange={props.onSelectChange}
					item={props.messages[rowIndex]}
				/>
			</div>
		)
	}, [])

	return (
		<>
			{
				<VariableSList
					height={pageHeight}
					itemCount={props.messages.length}
					itemSize={getItemSize}
					width={'100%'}
					ref={listRef}

					// initialScrollOffset={props.messages.length * props.messages.length}
				>
					{rowRender}
				</VariableSList>
			}
		</>
	)
}

export default VariableSizeList
