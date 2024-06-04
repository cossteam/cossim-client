import { Virtuoso } from 'react-virtuoso'

interface VirtuosoListProps {
    // height: number
    // reverse?: boolean
}

const VirtuosoList: React.FC<VirtuosoListProps> = () => {
    return (
        // <Virtuoso
        //     className="flex flex-col overflow-y-auto"
        //     style={{ height }}
        //     totalCount={10}
        //     increaseViewportBy={{ top: 20, bottom: 20 }}
        //     itemContent={(index) => <div>Item {index}</div>}
        // />
        <Virtuoso
            // 设置的高度
            style={{ overflow: 'auto' }}
            // 数据
            // data={messageStore.messages}
            // increaseViewportBy={100}
            // 初始化滚动到位置
            // initialTopMostItemIndex={messageStore.messages.length}
            // firstItemIndex={messageStore.messages.length}
            // 默认图片高度
            defaultItemHeight={300}
            // ref={virtuoso}
            atTopStateChange={(isAtTop) => {
                if (isAtTop) {
                    console.log('at top')

                    // TODO: 加载更多
                    // setLoading(true)
                    // loadMore()
                }
            }}
            followOutput={(isAtBottom: boolean) => {
                // if (isAtBottom) {
                //     return 'smooth' // can be 'auto' or false to avoid scrolling
                // } else {
                return isAtBottom ? 'smooth' : false
                // }
            }}
            totalCount={100}
            overscan={50}
            itemContent={(index) => <div>Item {index}</div>}
        />
    )
}

export default VirtuosoList
