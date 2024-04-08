// import { useRef, useState } from 'react'
import InfiniteScrollList from 'react-infinite-scroll-component'

interface InfiniteScrollProps {
	items: any[]
	setItems: () => void
	next: () => void
	load: React.FC
	children: React.ReactNode
}

interface InfiniteScrollMethods {
	// ref:
}

const InfiniteScroll: React.ForwardRefRenderFunction<InfiniteScrollMethods, InfiniteScrollProps> = (props) => {
	return (
		<div id="scrollableDiv" className="flex flex-col-reverse flex-1 overflow-auto">
			<InfiniteScrollList
				dataLength={props.items.length}
				next={props.next}
				style={{ display: 'flex', flexDirection: 'column-reverse' }}
				inverse={true}
				hasMore={true}
				loader={<h4>Loading...</h4>}
				scrollableTarget="scrollableDiv"
				// ref={ref}
				scrollThreshold={0}
			>
				{props.children}
			</InfiniteScrollList>
		</div>
	)
}

export default InfiniteScroll
