import { Flex } from 'antd'
import InfiniteScrollComponent, { Props } from 'react-infinite-scroll-component'
import { forwardRef, useImperativeHandle, useRef } from 'react'
import { useElementSize } from '@reactuses/core'

interface InfiniteScrollProps {
	dataLength: number
	height?: number
	next?: () => void
	options?: Partial<Props>
	children: React.ReactNode
	reverse?: boolean
}

export interface InfiniteScrollPropsHandle {}

const InfiniteScroll: React.ForwardRefRenderFunction<InfiniteScrollPropsHandle, InfiniteScrollProps> = (props, ref) => {
	const infiniteRef = useRef<InfiniteScrollComponent>(null)
	const parentRef = useRef<HTMLDivElement>(null)

	const [, height] = useElementSize(parentRef)

	// const scrollThreshold = useMemo(() => Math.floor((props.height || height) / 2), [height, props.height])

	useImperativeHandle(ref, () => ({}))

	return (
		<Flex
			className="overflow-y-auto overflow-x-hidden flex-col-reverse"
			id="scrollableDiv"
			style={{ height: props.height || height, flexDirection: 'column-reverse' }}
			vertical
			ref={parentRef}
		>
			<InfiniteScrollComponent
				dataLength={props.dataLength}
				next={() => props.next && props.next()}
				style={{
					display: 'flex',
					flexDirection: props.reverse ? 'column-reverse' : 'column',
					minHeight: props.height || height
				}}
				inverse={true}
				hasMore={true}
				scrollableTarget="scrollableDiv"
				ref={infiniteRef}
				loader={<>loading...</>}
				scrollThreshold={0}
				{...props.options}
			>
				{props.children}
			</InfiniteScrollComponent>
		</Flex>
	)
}

InfiniteScroll.displayName = 'InfiniteScroll'

export default forwardRef(InfiniteScroll)
