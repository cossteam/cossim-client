import { Flex, Typography } from 'antd'
import React, { forwardRef, memo, useEffect, useImperativeHandle, useRef } from 'react'
import { VirtualItem, Virtualizer, VirtualizerOptions, useWindowVirtualizer } from '@tanstack/react-virtual'
import { useElementSize } from '@reactuses/core'
import useDefer from '@/hooks/useDefer'
import clsx from 'clsx'

interface VirtualizerListProps {
	/**
	 * @description 列表元素数量
	 * @default 100
	 */
	count?: number
	/**
	 * @description 列表高度
	 * @default 400
	 */
	listHeight?: number
	/**
	 * @description 虚拟列表配置项
	 * @see https://github.com/TanStack/virtual
	 * @default {}
	 */
	options?: Partial<VirtualizerOptions<Window, Element>>
	/**
	 * @description 列表元素的渲染函数
	 * @param index 元素索引
	 * @rquired
	 */
	renderItem: (index: number) => JSX.Element
	/**
	 * @description 列表滚动时触发
	 * @param item 虚拟列表项
	 * @default undefined
	 */
	onScroll?: (item: VirtualItem) => void
	/**
	 * @description 列表元素更新时触发
	 * @param index 元素 item
	 * @default undefined
	 */
	onRendering?: (item: VirtualItem) => void
	/**
	 * @description 列表元素全部渲染完成时触发
	 * @default undefined
	 */
	onRenderFinish?: () => void
	/**
	 * @description 是否显示 loading 状态
	 * @default false
	 */
	loading?: boolean
	/**
	 * @description 自定义 loading
	 * @default undefined
	 */
	loadingComponent?: React.ReactNode
	/**
	 * @description 自定义 loading className
	 * @default undefined
	 */
	loadingClassName?: string
	/**
	 * @description 是否需要滚动到底部
	 * @default false
	 */
	isScrollToEnd?: boolean
}

export interface VirtualizerListHandle {
	scrollToIndex: (index: number) => void
	scrollToEnd: () => void
	virtualizer: Virtualizer<Window, Element>
}

const VirtualizerList: React.ForwardRefRenderFunction<
	VirtualizerListHandle,
	VirtualizerListProps & React.HTMLAttributes<HTMLDivElement>
> = (
	{
		count = 100,
		listHeight = 400,
		options = {},
		renderItem,
		onScroll,
		onRendering,
		onRenderFinish,
		loading = false,
		loadingComponent,
		loadingClassName,
		isScrollToEnd = false,
		...props
	},
	ref
) => {
	const parentRef = useRef<HTMLDivElement>(null)

	const [, height] = useElementSize(parentRef)

	const { defer, isRendering, isRenderFinish } = useDefer(count)

	// count,
	// getScrollElement: () => parentRef.current,
	// estimateSize: () => 48,
	// overscan: 5,
	// initialOffset: count - 1,
	// ...options
	const virtualizer = useWindowVirtualizer({
		count,
		estimateSize: () => 48,
		overscan: 5,
		...options
	})

	// 列表滚动时触发
	useEffect(() => {
		const [lastItem] = [...virtualizer.getVirtualItems()]
		if (!lastItem) return
		onScroll && onScroll(lastItem)
	}, [virtualizer.getVirtualItems()])

	const scrollToIndex = (index: number) => virtualizer.scrollToIndex(index)
	const scrollToEnd = () => virtualizer.scrollToIndex(count - 1)

	useImperativeHandle(ref, () => ({
		scrollToIndex,
		scrollToEnd,
		virtualizer
	}))

	useEffect(() => {
		if (isRendering) onRendering && onRendering(virtualizer.getVirtualItems()[0])
		if (isRenderFinish && isScrollToEnd) virtualizer.scrollToIndex(count - 1)
		if (isRenderFinish) onRenderFinish && onRenderFinish()
	}, [isRendering, isRenderFinish])

	return (
		<Flex
			className="ttt flex-1 w-full h-full overflow-y-auto overflow-x-hidden relative"
			style={{ contain: 'strict', height: listHeight || height }}
			ref={parentRef}
			{...props}
			vertical
		>
			{loading && (
				<Flex
					className={clsx(
						'flex-1 h-full bg-background absolute top-0 left-0 w-full z-10 ',
						isRendering ? '!flex' : '!hidden',
						loadingClassName
					)}
					align="center"
					justify="center"
				>
					{loadingComponent ? loadingComponent : <Typography.Text>loading...</Typography.Text>}
				</Flex>
			)}
			<Flex
				style={{
					height: virtualizer.getTotalSize(),
					width: '100%',
					position: 'relative'
				}}
			>
				{virtualizer.getVirtualItems().map((virtualRow) => (
					<Flex
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							width: '100%',
							transform: `translateY(${virtualRow.start}px)`
						}}
						key={virtualRow.key}
						data-index={virtualRow.index}
						ref={virtualizer.measureElement}
					>
						{defer(virtualRow.index) && renderItem(virtualRow.index)}
					</Flex>
				))}
			</Flex>
		</Flex>
	)
}

VirtualizerList.displayName = 'VirtualizerList'

export default memo(forwardRef(VirtualizerList))
